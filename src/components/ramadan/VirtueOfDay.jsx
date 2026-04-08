import { motion } from 'framer-motion';

export default function VirtueOfDay({ todayVirtue }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
      className="rounded-2xl p-5 bg-gradient-to-br from-amber-600/10 to-purple-600/10 border border-amber-500/10 backdrop-blur-sm flex flex-col justify-center">
      <p className="text-white font-bold text-center mb-3">✨ فضيلة اليوم</p>
      <p className="text-slate-200 text-center leading-relaxed text-lg mb-2">{todayVirtue.text}</p>
      <p className="text-amber-400/70 text-center text-sm">— {todayVirtue.source}</p>
    </motion.div>
  );
}
