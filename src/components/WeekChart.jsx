import { motion } from 'framer-motion';

export default function WeekChart({ weekStats, totalPrayed }) {
  const commitmentPct = Math.round((totalPrayed / 35) * 100);

  return (
    <div className="mt-5 pt-5 border-t border-white/[0.06]">
      <h4 className="text-sm font-semibold text-slate-300 mb-4">إحصائيات الأسبوع</h4>

      <div className="flex items-end justify-between gap-2 h-28 mb-4">
        {weekStats.map((day, idx) => {
          const pct = (day.prayed / 5) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-slate-500 font-mono">{day.prayed}</span>
              <div className="w-full h-20 rounded-lg bg-white/[0.04] relative overflow-hidden">
                <motion.div initial={{ height: 0 }}
                  animate={{ height: `${pct}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  className="absolute bottom-0 w-full rounded-lg bg-gradient-to-t from-indigo-500 to-purple-500/70" />
              </div>
              <span className="text-[10px] text-slate-500">{day.day}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 text-center">
          <div className="text-xl font-bold text-indigo-400">{totalPrayed}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">صلاة هذا الأسبوع</div>
        </div>
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 text-center">
          <div className="text-xl font-bold text-purple-400">{commitmentPct}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">نسبة الالتزام</div>
        </div>
      </div>
    </div>
  );
}
