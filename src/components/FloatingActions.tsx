import { Download, Image, FileJson, RefreshCw, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

interface FloatingActionsProps {
  onRegenerate: () => void;
  isLoading: boolean;
  mindMapData: { nodes: any[]; edges: any[] } | null;
}

const FloatingActions = ({ onRegenerate, isLoading, mindMapData }: FloatingActionsProps) => {
  if (!mindMapData) return null;

  const handleExportPNG = async () => {
    const el = document.querySelector('.react-flow') as HTMLElement;
    if (!el) return;
    try {
      const dataUrl = await toPng(el, { backgroundColor: 'transparent' });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'mindmap.png';
      a.click();
      toast.success('Exported as PNG');
    } catch {
      toast.error('Export failed');
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(mindMapData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmap.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported as JSON');
  };

  const actions = [
    { icon: RefreshCw, label: 'Regenerate', onClick: onRegenerate, loading: isLoading },
    { icon: Image, label: 'PNG', onClick: handleExportPNG },
    { icon: FileJson, label: 'JSON', onClick: handleExportJSON },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2"
    >
      <div className="glass-panel rounded-2xl p-1.5 flex gap-1 card-shadow">
        {actions.map(({ icon: Icon, label, onClick, loading }) => (
          <button
            key={label}
            onClick={onClick}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
                       text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
            {label}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default FloatingActions;
