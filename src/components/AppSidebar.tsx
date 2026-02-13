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

const AppSidebar = ({ savedMaps, onSelectMap, onDeleteMap, onNewMap, activeMapId }: AppSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 260 }}
      transition={{ duration: 0.2 }}
      className="h-screen border-r border-border bg-card flex flex-col shrink-0 relative"
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-card border border-border 
                   flex items-center justify-center hover:bg-muted transition-colors shadow-sm"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-border">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
          <Brain className="w-4 h-4 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-display font-bold text-lg gradient-text"
            >
              MindFlow
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* New Map Button */}
      <div className="p-3">
        <button
          onClick={onNewMap}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg gradient-primary text-primary-foreground
                     text-sm font-medium hover:shadow-md transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!collapsed && <span>New Mind Map</span>}
        </button>
      </div>

      {/* Saved Maps */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <div className="flex items-center gap-2 px-2 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Clock className="w-3 h-3" />
            Recent
          </div>
          <div className="space-y-1">
            {savedMaps.length === 0 && (
              <p className="text-xs text-muted-foreground px-2 py-4">No mind maps yet. Generate one to get started!</p>
            )}
            {savedMaps.map((map) => (
              <div
                key={map.id}
                onClick={() => onSelectMap(map.id)}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm
                  ${activeMapId === map.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'}`}
              >
                <span className="truncate flex-1">{map.title}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteMap(map.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
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
