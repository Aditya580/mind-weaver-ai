import { useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import MindMapNodeComponent from './MindMapNode';

interface MindMapCanvasProps {
  nodes: Node[];
  edges: Edge[];
}

const MindMapCanvas = ({
  nodes: initialNodes,
  edges: initialEdges,
}: MindMapCanvasProps) => {

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // ✅ Stable node types (performance)
  const nodeTypes = useMemo(() => ({
    mindMapNode: MindMapNodeComponent,
  }), []);

  // ✅ Correct hook for syncing props → state
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div className="
      w-full 
      h-full 
      min-h-[400px]
      sm:min-h-[500px]
      md:min-h-[600px]
      lg:min-h-full
      relative
    ">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}

        fitView
        fitViewOptions={{ padding: 0.25 }}

        minZoom={0.2}
        maxZoom={2}

        panOnDrag
        zoomOnScroll
        zoomOnPinch

        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}

        className="rounded-xl"
      >
        {/* Controls */}
        <Controls
          position="bottom-right"
          showInteractive={false}
        />

        {/* Background Grid */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1.2}
          color="hsl(var(--border))"
        />
      </ReactFlow>
    </div>
  );
};

export default MindMapCanvas;
