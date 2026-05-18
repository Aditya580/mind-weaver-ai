import { Image, FileJson, RefreshCw, Loader2 } from 'lucide-react';
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

  /* ================= EXPORT PNG ================= */
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

  /* ================= EXPORT JSON ================= */
  const handleExportJSON = () => {
    const blob = new Blob(
      [JSON.stringify(mindMapData, null, 2)],
      { type: 'application/json' }
    );

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
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        fixed 
        bottom-4 sm:bottom-6
        left-1/2 -translate-x-1/2
        z-50
        px-4
        w-full max-w-md
        pointer-events-none
      "
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div className="
        glass-panel 
        rounded-2xl sm:rounded-3xl
        p-1.5 sm:p-2
        card-shadow
        flex gap-1 sm:gap-2
        justify-center
        pointer-events-auto
      ">
        {actions.map(({ icon: Icon, label, onClick, loading }) => (
          <button
            key={label}
            onClick={onClick}
            disabled={loading}
            className="
              flex items-center justify-center
              gap-2
              
              px-3 sm:px-4
              py-2.5 sm:py-3
              
              rounded-xl sm:rounded-2xl
              
              text-xs sm:text-sm
              font-medium
              
              min-h-[44px]
              min-w-[44px]
              
              text-foreground
              hover:bg-muted
              active:scale-95
              
              transition-all duration-200
              disabled:opacity-50
            "
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}

            {/* Hide label on very small screens */}
            <span className="hidden xs:inline sm:inline">
              {label}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default FloatingActions;
