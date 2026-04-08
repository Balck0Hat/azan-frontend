import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import NavDropdown from "./NavDropdown";
import { NAV_ITEMS, ICON_MAP } from "./navData";

function Navbar({ activeCard, setActiveCard }) {
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null);
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleNavClick = (item) => {
    if (item.children) {
      setOpenMenu(openMenu === item.key ? null : item.key);
    } else {
      setActiveCard(item.key);
      setOpenMenu(null);
    }
  };

  const handleChildClick = (childKey) => {
    setActiveCard(childKey);
    setOpenMenu(null);
  };

  const isGroupActive = (item) =>
    item.children ? item.children.some((c) => c.key === activeCard) : activeCard === item.key;

  return (
    <nav
      ref={navRef}
      aria-label="\u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629"
      className="hidden lg:flex items-center gap-1 relative"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = ICON_MAP[item.key];
        const active = isGroupActive(item);
        return (
          <div key={item.key} className="relative">
            <button
              onClick={() => handleNavClick(item)}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer
                ${active ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
            >
              {Icon && <Icon size={16} strokeWidth={1.8} />}
              <span>{item.label}</span>
              {item.children && (
                <ChevronDown size={14} className={`transition-transform duration-200 ${openMenu === item.key ? "rotate-180" : ""}`} />
              )}
              {active && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "color-mix(in srgb, var(--accent-primary) 15%, transparent)", border: "1px solid color-mix(in srgb, var(--accent-primary) 20%, transparent)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
            {item.children && openMenu === item.key && (
              <NavDropdown children={item.children} activeCard={activeCard} onChildClick={handleChildClick} />
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default Navbar;
