import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Clock, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';

interface SavedMap {
  id: string;
  title: string;
  createdAt: Date;
}

interface AppSidebarProps {
  savedMaps: SavedMap[];
  onSelectMap: (id: string) => void;
  onDeleteMap: (id: string) => void;
  onNewMap: () => void;
  activeMapId: string | null;
}

const AppSidebar = ({
  savedMaps,
  onSelectMap,
  onDeleteMap,
  onNewMap,
  activeMapId,
}: AppSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 60 : 260 }}
      transition={{ duration: 0.25 }}
      className="
        h-screen 
        border-r border-border 
        bg-card 
        flex flex-col 
        shrink-0 
        relative
        sm:relative
        fixed sm:fixed md:relative
        z-40
      "
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle Sidebar"
        className="
          absolute -right-3 top-6 z-50
          w-7 h-7 rounded-full
          bg-card border border-border
          flex items-center justify-center
          hover:bg-muted transition-colors
          shadow-md
        "
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Logo Section */}
      <div className="p-4 flex items-center gap-3 border-b border-border">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-sm">
          <Brain className="w-4 h-4 text-primary-foreground" />
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="font-semibold text-base gradient-text whitespace-nowrap"
            >
              Weaving your Thoughts
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* New Map Button */}
      <div className="p-3">
        <button
          onClick={onNewMap}
          className={`
            w-full flex items-center gap-2
            px-3 py-2.5 rounded-xl
            gradient-primary text-primary-foreground
            text-sm font-medium
            hover:shadow-lg hover:scale-[1.02]
            transition-all duration-200
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!collapsed && <span>New Mind Map</span>}
        </button>
      </div>

      {/* Saved Maps List */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto px-3 pb-4 custom-scroll">
          <div className="flex items-center gap-2 px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Clock className="w-3 h-3" />
            Recent
          </div>

          <div className="space-y-1">
            {savedMaps.length === 0 && (
              <p className="text-xs text-muted-foreground px-2 py-4 leading-relaxed">
                No mind maps yet.  
                <br />
                Generate one to get started 🚀
              </p>
            )}

            {savedMaps.map((map) => (
              <div
                key={map.id}
                onClick={() => onSelectMap(map.id)}
                className={`
                  group flex items-center justify-between
                  px-3 py-2.5 rounded-xl
                  cursor-pointer transition-all duration-150
                  text-sm
                  ${
                    activeMapId === map.id
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'hover:bg-muted text-foreground'
                  }
                `}
              >
                <span className="truncate flex-1 pr-2">{map.title}</span>

                <button
                  aria-label="Delete Map"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteMap(map.id);
                  }}
                  className="
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-150
                    hover:text-destructive
                  "
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.aside>
  );
};

export default AppSidebar;
