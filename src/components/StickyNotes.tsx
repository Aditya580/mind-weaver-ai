import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Pin, Search } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  rotation: number;
  createdAt: number;
}

const NOTE_PALETTE = [
  { bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', pin: '#f59e0b' },
  { bg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', pin: '#ec4899' },
  { bg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', pin: '#3b82f6' },
  { bg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', pin: '#10b981' },
  { bg: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)', pin: '#8b5cf6' },
  { bg: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)', pin: '#f97316' },
  { bg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', pin: '#ef4444' },
  { bg: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)', pin: '#14b8a6' },
];

const STORAGE_KEY = 'mindflow-sticky-notes';

const StickyNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [composing, setComposing] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setNotes(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!draftTitle.trim() && !draftContent.trim()) {
      setComposing(false);
      return;
    }
    const paletteIdx = Math.floor(Math.random() * NOTE_PALETTE.length);
    const note: Note = {
      id: Date.now().toString(),
      title: draftTitle.trim() || 'Untitled',
      content: draftContent.trim(),
      color: String(paletteIdx),
      rotation: (Math.random() - 0.5) * 4,
      createdAt: Date.now(),
    };
    setNotes((p) => [note, ...p]);
    setDraftTitle('');
    setDraftContent('');
    setComposing(false);
  };

  const deleteNote = (id: string) =>
    setNotes((p) => p.filter((n) => n.id !== id));

  const filtered = notes.filter(
    (n) =>
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full h-full overflow-y-auto">
      {/* Soft paper-board backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, hsl(var(--accent)/0.15), transparent 40%), radial-gradient(circle at 80% 60%, hsl(var(--primary)/0.15), transparent 40%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
              <span className="gradient-text">Sticky Notes</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Pin your important thoughts. Pinterest-style.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes…"
                className="glass-panel rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 w-48 sm:w-56"
              />
            </div>
            <button
              onClick={() => setComposing(true)}
              className="gradient-primary text-primary-foreground rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" /> New Note
            </button>
          </div>
        </div>

        {/* Composer */}
        <AnimatePresence>
          {composing && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="glass-panel rounded-2xl p-4 mb-8 card-shadow max-w-2xl mx-auto"
            >
              <input
                autoFocus
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder="Title"
                className="w-full bg-transparent border-0 outline-none text-lg font-display font-semibold placeholder:text-muted-foreground"
              />
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                placeholder="Write something important…"
                rows={3}
                className="w-full bg-transparent border-0 outline-none mt-2 text-sm resize-none placeholder:text-muted-foreground"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => { setComposing(false); setDraftTitle(''); setDraftContent(''); }}
                  className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addNote}
                  className="gradient-primary text-primary-foreground rounded-lg px-4 py-1.5 text-sm font-medium hover:shadow-md transition-all"
                >
                  Pin it
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pinterest-style masonry */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Pin className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">
              {notes.length === 0 ? 'No notes yet. Pin your first thought!' : 'No notes match your search.'}
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]">
            <AnimatePresence>
              {filtered.map((note) => {
                const palette = NOTE_PALETTE[Number(note.color) % NOTE_PALETTE.length];
                return (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotate: note.rotation }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ rotate: 0, scale: 1.03, y: -4 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    className="group relative mb-4 break-inside-avoid rounded-2xl p-5 cursor-default"
                    style={{
                      background: palette.bg,
                      boxShadow:
                        '0 10px 30px -10px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.08)',
                    }}
                  >
                    {/* Pin */}
                    <div
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-md"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${palette.pin}, ${palette.pin}cc 60%, #00000033)`,
                      }}
                    />

                    <button
                      onClick={() => deleteNote(note.id)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/10 hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Delete note"
                    >
                      <X className="w-3.5 h-3.5 text-gray-900" />
                    </button>

                    <h3 className="font-display font-bold text-gray-900 text-lg leading-snug pr-6 break-words">
                      {note.title}
                    </h3>
                    {note.content && (
                      <p className="mt-2 text-sm text-gray-800/90 whitespace-pre-wrap break-words leading-relaxed">
                        {note.content}
                      </p>
                    )}
                    <div className="mt-3 text-[10px] uppercase tracking-wider text-gray-700/60 font-medium">
                      {new Date(note.createdAt).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric',
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyNotes;
