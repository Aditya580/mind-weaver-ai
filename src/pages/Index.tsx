import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { Node, Edge } from '@xyflow/react';
import AppSidebar from '@/components/AppSidebar';
import HeroInput from '@/components/HeroInput';
import MindMapCanvas from '@/components/MindMapCanvas';
import FloatingActions from '@/components/FloatingActions';
import ThemeToggle from '@/components/ThemeToggle';
import { transformToReactFlow, type MindMapData } from '@/lib/mindmap-utils';
import { supabase } from '@/integrations/supabase/client';

interface SavedMap {
  id: string;
  title: string;
  createdAt: Date;
  data: MindMapData;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [flowNodes, setFlowNodes] = useState<Node[]>([]);
  const [flowEdges, setFlowEdges] = useState<Edge[]>([]);
  const [rawData, setRawData] = useState<MindMapData | null>(null);
  const [savedMaps, setSavedMaps] = useState<SavedMap[]>([]);
  const [activeMapId, setActiveMapId] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState('');
  const [showCanvas, setShowCanvas] = useState(false);

  const generateMindMap = useCallback(async (text: string) => {
    setIsLoading(true);
    setCurrentTopic(text);
    try {
      const { data, error } = await supabase.functions.invoke('generate-mindmap', {
        body: { text },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const mindmapData = data as MindMapData;
      const { nodes, edges } = transformToReactFlow(mindmapData);
      
      setRawData(mindmapData);
      setFlowNodes(nodes);
      setFlowEdges(edges);
      setShowCanvas(true);

      // Auto-save
      const newMap: SavedMap = {
        id: Date.now().toString(),
        title: text.length > 40 ? text.slice(0, 40) + '...' : text,
        createdAt: new Date(),
        data: mindmapData,
      };
      setSavedMaps(prev => [newMap, ...prev]);
      setActiveMapId(newMap.id);
      
      toast.success('Mind map generated!');
    } catch (err: any) {
      console.error('Generation error:', err);
      toast.error(err.message || 'Failed to generate mind map');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectMap = (id: string) => {
    const map = savedMaps.find(m => m.id === id);
    if (map) {
      const { nodes, edges } = transformToReactFlow(map.data);
      setFlowNodes(nodes);
      setFlowEdges(edges);
      setRawData(map.data);
      setActiveMapId(id);
      setShowCanvas(true);
    }
  };

  const handleDeleteMap = (id: string) => {
    setSavedMaps(prev => prev.filter(m => m.id !== id));
    if (activeMapId === id) {
      setActiveMapId(null);
      setShowCanvas(false);
      setFlowNodes([]);
      setFlowEdges([]);
      setRawData(null);
    }
  };

  const handleNewMap = () => {
    setShowCanvas(false);
    setActiveMapId(null);
    setFlowNodes([]);
    setFlowEdges([]);
    setRawData(null);
    setCurrentTopic('');
  };

  const handleRegenerate = () => {
    if (currentTopic) {
      generateMindMap(currentTopic);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar
        savedMaps={savedMaps}
        onSelectMap={handleSelectMap}
        onDeleteMap={handleDeleteMap}
        onNewMap={handleNewMap}
        activeMapId={activeMapId}
      />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            {showCanvas && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-medium text-muted-foreground"
              >
                {currentTopic}
              </motion.span>
            )}
          </div>
          <ThemeToggle />
        </header>

        {/* Main content */}
        <main className="flex-1 relative">
          <AnimatePresence mode="wait">
            {!showCanvas ? (
              <motion.div
                key="hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-center h-full px-6"
              >
                <HeroInput onGenerate={generateMindMap} isLoading={isLoading} />
              </motion.div>
            ) : (
              <motion.div
                key="canvas"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full"
              >
                <MindMapCanvas nodes={flowNodes} edges={flowEdges} />
                <FloatingActions
                  onRegenerate={handleRegenerate}
                  isLoading={isLoading}
                  mindMapData={rawData}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Index;
