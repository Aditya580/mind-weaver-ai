import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

interface HeroInputProps {
  onGenerate: (text: string) => void;
  isLoading: boolean;
}

const HeroInput = ({ onGenerate, isLoading }: HeroInputProps) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim() && !isLoading) {
      onGenerate(text.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto"
    >
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
          <span className="gradient-text">Mind-Weaver</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Transform any idea into a visual mind map with AI
        </p>
      </div>

      <div className="w-full relative group">
        <div className="absolute -inset-1 rounded-2xl gradient-primary opacity-20 blur-lg group-focus-within:opacity-40 transition-opacity" />
        <div className="relative glass-panel rounded-2xl p-2 glow-shadow">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary ml-3 shrink-0" />
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a topic, idea, or paste some text..."
              className="flex-1 bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground py-3 px-2 text-base"
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || isLoading}
              className="gradient-primary text-primary-foreground rounded-xl px-5 py-2.5 font-medium text-sm 
                         flex items-center gap-2 transition-all duration-200
                         hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-50 disabled:pointer-events-none shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Generate
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {['Artificial Intelligence', 'Climate Change', 'Startup Business Plan', 'Machine Learning'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setText(suggestion)}
            className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground 
                       hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default HeroInput;
