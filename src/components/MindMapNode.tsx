import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';

interface MindMapNodeData {
  label: string;
  nodeType: 'root' | 'branch';
  level: number;
  branchIndex: number;
  branchColor: string;
}

const MindMapNodeComponent = memo(({ data }: NodeProps) => {
  const { label, nodeType, level, branchColor } = data as unknown as MindMapNodeData;
  const isRoot = nodeType === 'root';

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: level * 0.05 }}
      className={`
        relative px-4 py-2.5 rounded-xl cursor-grab active:cursor-grabbing
        transition-all duration-200 select-none
        ${isRoot
          ? 'gradient-primary text-primary-foreground px-6 py-3.5 text-base font-bold shadow-lg animate-pulse-glow'
          : 'glass-panel card-shadow hover:scale-105'
        }
      `}
      style={!isRoot ? {
        borderLeft: `3px solid hsl(${branchColor})`,
      } : undefined}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-primary !border-0 !opacity-0"
      />
      <span className={`
        font-display whitespace-nowrap
        ${isRoot ? 'text-base' : level === 1 ? 'text-sm font-semibold' : 'text-xs font-medium'}
      `}>
        {label}
      </span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-primary !border-0 !opacity-0"
      />
    </motion.div>
  );
});

MindMapNodeComponent.displayName = 'MindMapNode';
export default MindMapNodeComponent;
