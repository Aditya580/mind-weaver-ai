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

  const suggestions = [
    'Artificial Intelligence',
    'Climate Change',
    'Startup Business Plan',
    'Machine Learning',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="
        flex flex-col items-center gap-5 sm:gap-6 
        w-full max-w-2xl mx-auto
        px-4 sm:px-6
      "
    >
      {/* Heading */}
      <div className="text-center space-y-2">
        <h1 className="
          text-3xl sm:text-4xl md:text-5xl 
          font-display font-bold tracking-tight
        ">
          <span className="gradient-text">Mind-Weaver</span>
        </h1>

        <p className="
          text-sm sm:text-base md:text-lg
          text-muted-foreground
          max-w-md mx-auto
        ">
          Transform any idea into a visual mind map with AI
        </p>
      </div>

      {/* Input Box */}
      <div className="w-full relative group">
        <div className="
          absolute -inset-1 rounded-2xl 
          gradient-primary opacity-20 blur-lg
          group-focus-within:opacity-40 transition-opacity
        " />

        <div className="
          relative glass-panel rounded-2xl 
          p-2 sm:p-3 glow-shadow
        ">
          <div className="flex items-center gap-2 sm:gap-3">
            
            <Sparkles className="
              w-4 h-4 sm:w-5 sm:h-5 
              text-primary ml-2 sm:ml-3 shrink-0
            " />

            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter topic or paste text..."
              className="
                flex-1 bg-transparent border-0 outline-none
                text-foreground placeholder:text-muted-foreground
                py-3 sm:py-3.5 px-2
                text-sm sm:text-base
              "
              disabled={isLoading}
            />

            <button
              onClick={handleSubmit}
              disabled={!text.trim() || isLoading}
              className="
                gradient-primary text-primary-foreground
                rounded-xl 
                px-3 sm:px-5
                py-2.5 sm:py-3
                font-medium 
                text-xs sm:text-sm
                min-h-[44px]
                flex items-center gap-2
                transition-all duration-200
                hover:shadow-lg hover:scale-[1.02]
                active:scale-[0.98]
                disabled:opacity-50 disabled:pointer-events-none
                shrink-0
              "
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline">Generate</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="
        w-full
        overflow-x-auto
        scrollbar-hide
      ">
        <div className="
          flex gap-2
          w-max mx-auto
          sm:flex-wrap sm:justify-center
        ">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setText(suggestion)}
              className="
                text-xs sm:text-sm
                px-3 py-2
                min-h-[40px]
                rounded-full
                bg-secondary text-secondary-foreground
                hover:bg-accent hover:text-accent-foreground
                transition-colors
                whitespace-nowrap
              "
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

    </motion.div>
  );
};

export default HeroInput;
