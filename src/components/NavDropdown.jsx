import { motion } from "framer-motion";
import { ICON_MAP } from "./navData";

function NavDropdown({ children, activeCard, onChildClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute top-full right-0 mt-2 min-w-[260px] rounded-2xl border border-[var(--border-color)] p-2 z-50"
      style={{ background: "var(--bg-card)", backdropFilter: "blur(20px)" }}
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
                ? "bg-[var(--bg-hover)] text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              }`}
          >
            <span className="mt-0.5 shrink-0">
              {Icon ? <Icon size={18} strokeWidth={1.6} /> : null}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-tight">{child.label}</span>
              {child.desc && (
                <span className="text-xs text-[var(--text-muted)] mt-0.5 leading-snug">{child.desc}</span>
              )}
            </div>
          </button>
        );
      })}
    </motion.div>
  );
}

export default NavDropdown;
