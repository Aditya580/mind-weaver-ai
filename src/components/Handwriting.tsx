import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { Download, Copy, Type, Palette, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const FONTS = [
  { label: 'Caveat', value: "'Caveat', cursive" },
  { label: 'Homemade Apple', value: "'Homemade Apple', cursive" },
  { label: 'Dancing Script', value: "'Dancing Script', cursive" },
  { label: 'Shadows Into Light', value: "'Shadows Into Light', cursive" },
  { label: 'Kalam', value: "'Kalam', cursive" },
  { label: 'Patrick Hand', value: "'Patrick Hand', cursive" },
];

const INK_COLORS = [
  { label: 'Blue', value: '#1e3a8a' },
  { label: 'Black', value: '#111111' },
  { label: 'Red', value: '#b91c1c' },
  { label: 'Green', value: '#15803d' },
  { label: 'Purple', value: '#6d28d9' },
];

const PAGE_STYLES = [
  { label: 'Ruled', value: 'ruled' },
  { label: 'Grid', value: 'grid' },
  { label: 'Blank', value: 'blank' },
] as const;

type PageStyle = (typeof PAGE_STYLES)[number]['value'];

const Handwriting = () => {
  const [text, setText] = useState(
    "Dear friend,\n\nThis is your typed text — now beautifully transformed into handwriting. Write notes, letters, or quotes, then download as an image."
  );
  const [font, setFont] = useState(FONTS[0].value);
  const [ink, setInk] = useState(INK_COLORS[0].value);
  const [size, setSize] = useState(32);
  const [pageStyle, setPageStyle] = useState<PageStyle>('ruled');
  const [tilt, setTilt] = useState(true);
  const paperRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!paperRef.current) return;
    try {
      const dataUrl = await toPng(paperRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `handwriting-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Saved as image');
    } catch {
      toast.error('Failed to export');
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    toast.success('Text copied');
  };

  const pageBg =
    pageStyle === 'ruled'
      ? 'repeating-linear-gradient(to bottom, transparent 0, transparent 47px, rgba(59,130,246,0.18) 47px, rgba(59,130,246,0.18) 48px)'
      : pageStyle === 'grid'
      ? 'linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px) 0 0/32px 32px, linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px) 0 0/32px 32px'
      : 'none';

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Homemade+Apple&family=Dancing+Script:wght@400;700&family=Shadows+Into+Light&family=Kalam:wght@400;700&family=Patrick+Hand&display=swap"
      />

      <div className="w-full h-full overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
              Handwriting Studio
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Convert typed text into beautiful handwritten notes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel card-shadow rounded-2xl p-5 space-y-5 h-fit"
            >
              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                  <Type className="w-3.5 h-3.5" /> Your text
                </label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={8}
                  placeholder="Type anything..."
                  className="resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Handwriting style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FONTS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFont(f.value)}
                      style={{ fontFamily: f.value }}
                      className={`px-3 py-2 rounded-lg text-base border transition-all ${
                        font === f.value
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border hover:border-primary/50 text-foreground/80'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                  <Palette className="w-3.5 h-3.5" /> Ink color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {INK_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setInk(c.value)}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        ink === c.value
                          ? 'border-primary scale-110'
                          : 'border-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.value }}
                      aria-label={c.label}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Size: {size}px
                </label>
                <Slider
                  value={[size]}
                  min={20}
                  max={64}
                  step={1}
                  onValueChange={(v) => setSize(v[0])}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Paper
                </label>
                <div className="flex gap-2">
                  {PAGE_STYLES.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPageStyle(p.value)}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs border transition-all ${
                        pageStyle === p.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" /> Natural tilt
                </span>
                <input
                  type="checkbox"
                  checked={tilt}
                  onChange={(e) => setTilt(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
              </label>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleDownload} className="flex-1 gradient-primary">
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
                <Button onClick={handleCopy} variant="outline">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* Paper preview */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start justify-center"
            >
              <div
                ref={paperRef}
                className="w-full max-w-2xl rounded-xl card-shadow overflow-hidden"
                style={{
                  background: '#fbf7ee',
                  backgroundImage: pageBg,
                  minHeight: '500px',
                  padding: '48px 56px',
                  boxShadow:
                    '0 20px 50px -20px rgba(0,0,0,0.25), inset 0 0 80px rgba(120,80,30,0.05)',
                }}
              >
                <p
                  style={{
                    fontFamily: font,
                    color: ink,
                    fontSize: `${size}px`,
                    lineHeight: pageStyle === 'ruled' ? '48px' : '1.4',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    transform: tilt ? 'rotate(-0.6deg)' : 'none',
                    transformOrigin: 'top left',
                    letterSpacing: '0.5px',
                  }}
                >
                  {text || 'Start typing on the left...'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Handwriting;
