import { motion } from 'framer-motion';

export default function DuasSection({ duaFilter, setDuaFilter, duaCategories, filteredDuas, copiedDua, copyDua }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 bg-[var(--bg-card)] border border-[var(--border-color)] backdrop-blur-sm">
      <p className="text-[var(--text-primary)] font-bold mb-4">🤲 أدعية رمضان</p>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {duaCategories.map((cat) => (
          <motion.button key={cat} whileTap={{ scale: 0.95 }}
            onClick={() => setDuaFilter(cat)}
            className={`shrink-0 px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              duaFilter === cat ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
              'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
            }`}>{cat}</motion.button>
        ))}
      </div>
      <div className="space-y-3">
        {filteredDuas.map((dua, i) => (
          <motion.div key={dua.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <p className="text-indigo-300 text-xs font-medium mb-2">{dua.label}</p>
            <p className="text-[var(--text-primary)] leading-relaxed text-lg mb-3">{dua.text}</p>
            <motion.button whileTap={{ scale: 0.95 }}
              onClick={() => copyDua(dua.id, dua.text)}
              className={`text-xs px-3 py-1 rounded-lg transition-all ${
                copiedDua === dua.id ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              }`}>{copiedDua === dua.id ? '✓ تم النسخ' : '📋 نسخ'}</motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
