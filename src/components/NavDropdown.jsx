import { motion } from "framer-motion";
import { ICON_MAP } from "./navData";

function NavDropdown({ children, activeCard, onChildClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute top-full right-0 mt-2 min-w-[260px] rounded-2xl border border-white/[0.08] p-2 z-50"
      style={{ background: "rgba(15,23,42,0.92)", backdropFilter: "blur(20px)" }}
    >
      {children.map((child) => {
        const Icon = ICON_MAP[child.key];
        const active = activeCard === child.key;
        return (
          <button
            key={child.key}
            onClick={() => onChildClick(child.key)}
            className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-right transition-all duration-150 cursor-pointer
              ${active
                ? "bg-gradient-to-l from-indigo-500/15 to-purple-500/10 text-white"
                : "text-[#94a3b8] hover:bg-white/[0.04] hover:text-[#e2e8f0]"
              }`}
          >
            <span className="mt-0.5 shrink-0">
              {Icon ? <Icon size={18} strokeWidth={1.6} /> : null}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-tight">{child.label}</span>
              {child.desc && (
                <span className="text-xs text-[#64748b] mt-0.5 leading-snug">{child.desc}</span>
              )}
            </div>
          </button>
        );
      })}
    </motion.div>
  );
}

export default NavDropdown;
