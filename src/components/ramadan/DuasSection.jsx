import { motion } from 'framer-motion';

export default function DuasSection({ duaFilter, setDuaFilter, duaCategories, filteredDuas, copiedDua, copyDua }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 bg-white/[0.04] border border-white/10 backdrop-blur-sm">
      <p className="text-white font-bold mb-4">🤲 أدعية رمضان</p>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {duaCategories.map((cat) => (
          <motion.button key={cat} whileTap={{ scale: 0.95 }}
            onClick={() => setDuaFilter(cat)}
            className={`shrink-0 px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              duaFilter === cat ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
              'bg-white/[0.04] text-slate-500 border border-white/5 hover:bg-white/[0.07]'
            }`}>{cat}</motion.button>
        ))}
      </div>
      <div className="space-y-3">
        {filteredDuas.map((dua, i) => (
          <motion.div key={dua.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-indigo-300 text-xs font-medium mb-2">{dua.label}</p>
            <p className="text-slate-200 leading-relaxed text-lg mb-3">{dua.text}</p>
            <motion.button whileTap={{ scale: 0.95 }}
              onClick={() => copyDua(dua.id, dua.text)}
              className={`text-xs px-3 py-1 rounded-lg transition-all ${
                copiedDua === dua.id ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/[0.05] text-slate-400 hover:bg-white/10'
              }`}>{copiedDua === dua.id ? '✓ تم النسخ' : '📋 نسخ'}</motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
