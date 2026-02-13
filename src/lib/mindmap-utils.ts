import type { Node, Edge } from '@xyflow/react';

interface MindMapNode {
  id: string;
  label: string;
  type: 'root' | 'branch';
  parent?: string;
}

interface MindMapEdge {
  from: string;
  to: string;
  label?: string;
}

export interface MindMapData {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

const BRANCH_COLORS = [
  'var(--node-branch-1)',
  'var(--node-branch-2)',
  'var(--node-branch-3)',
  'var(--node-branch-4)',
  'var(--node-branch-5)',
];

function getBranchColor(index: number): string {
  return BRANCH_COLORS[index % BRANCH_COLORS.length];
}

// Get the branch index for a node based on its root-level ancestor
function getBranchIndex(nodeId: string, nodes: MindMapNode[], edges: MindMapEdge[]): number {
  const node = nodes.find(n => n.id === nodeId);
  if (!node || node.type === 'root') return -1;

  // Find root-level parent
  let current = node;
  while (current.parent) {
    const parent = nodes.find(n => n.id === current.parent);
    if (!parent || parent.type === 'root') break;
    current = parent;
  }

  // Get index among root's direct children
  const rootChildren = nodes.filter(n => n.parent && nodes.find(p => p.id === n.parent)?.type === 'root');
  return rootChildren.findIndex(n => n.id === current.id);
}

export function transformToReactFlow(data: MindMapData): { nodes: Node[]; edges: Edge[] } {
  const rootNode = data.nodes.find(n => n.type === 'root');
  if (!rootNode) return { nodes: [], edges: [] };

  // Build tree levels
  const childrenMap = new Map<string, MindMapNode[]>();
  data.nodes.forEach(n => {
    if (n.parent) {
      const children = childrenMap.get(n.parent) || [];
      children.push(n);
      childrenMap.set(n.parent, children);
    }
  });

  const flowNodes: Node[] = [];
  const flowEdges: Edge[] = [];

  // Layout using radial positioning
  function layoutNode(node: MindMapNode, x: number, y: number, angle: number, radius: number, level: number, branchIdx: number) {
    const color = node.type === 'root' ? 'hsl(var(--node-root))' : `hsl(${BRANCH_COLORS[branchIdx % BRANCH_COLORS.length].replace('var(--node-branch-', '').replace(')', '')})`;
    
    const branchColorVar = branchIdx >= 0 ? `var(--node-branch-${(branchIdx % 5) + 1})` : 'var(--node-root)';

    flowNodes.push({
      id: node.id,
      type: 'mindMapNode',
      position: { x, y },
      data: {
        label: node.label,
        nodeType: node.type,
        level,
        branchIndex: branchIdx,
        branchColor: branchColorVar,
      },
    });

    const children = childrenMap.get(node.id) || [];
    if (children.length === 0) return;

    const spreadAngle = level === 0 ? Math.PI * 2 : Math.PI * 0.8;
    const startAngle = level === 0 ? 0 : angle - spreadAngle / 2;
    const step = children.length > 1 ? spreadAngle / (children.length - 1) : 0;
    const childRadius = level === 0 ? 280 : 200 - level * 20;

    children.forEach((child, i) => {
      const childAngle = children.length === 1 ? angle : startAngle + step * i;
      const cx = x + Math.cos(childAngle) * childRadius;
      const cy = y + Math.sin(childAngle) * childRadius;
      const bi = level === 0 ? i : branchIdx;

      layoutNode(child, cx, cy, childAngle, childRadius, level + 1, bi);
    });
  }

  layoutNode(rootNode, 0, 0, 0, 280, 0, -1);

  // Create edges
  data.edges.forEach((edge, i) => {
    const targetNode = data.nodes.find(n => n.id === edge.to);
    const bi = targetNode ? getBranchIndex(edge.to, data.nodes, data.edges) : 0;

    flowEdges.push({
      id: `e-${edge.from}-${edge.to}`,
      source: edge.from,
      target: edge.to,
      label: edge.label,
      type: 'smoothstep',
      animated: false,
      style: {
        stroke: `hsl(var(--node-branch-${(Math.max(0, bi) % 5) + 1}))`,
        strokeWidth: 2,
      },
      labelStyle: {
        fill: 'hsl(var(--muted-foreground))',
        fontSize: 11,
        fontWeight: 500,
      },
    });
  });

  return { nodes: flowNodes, edges: flowEdges };
}
