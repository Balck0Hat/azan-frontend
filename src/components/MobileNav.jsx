import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { NAV_ITEMS, ICON_MAP } from "./navData";

function MobileNav({ activeCard, setActiveCard }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const isGroupActive = (item) =>
    item.children ? item.children.some((c) => c.key === activeCard) : activeCard === item.key;

  const handleNavClick = (item) => {
    if (item.children) {
      setOpenMenu(openMenu === item.key ? null : item.key);
    } else {
      setActiveCard(item.key);
      setOpenMenu(null);
      setIsOpen(false);
    }
  };

  const handleChildClick = (childKey) => {
    setActiveCard(childKey);
    setOpenMenu(null);
    setIsOpen(false);
  };

  return (
    <MobileMenu isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
      {NAV_ITEMS.map((item) => {
        const Icon = ICON_MAP[item.key];
        const active = isGroupActive(item);
        return (
          <li key={item.key} className="list-none">
            <button
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer
                ${active
                  ? "bg-gradient-to-l from-indigo-500/15 to-purple-500/10 text-white"
                  : "text-[#94a3b8] hover:bg-white/[0.04] hover:text-[#e2e8f0]"
                }`}
            >
              {Icon && <Icon size={18} strokeWidth={1.6} />}
              <span className="flex-1 text-right">{item.label}</span>
              {item.children && (
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${openMenu === item.key ? "rotate-180" : ""}`}
                />
              )}
            </button>

            <AnimatePresence>
              {item.children && openMenu === item.key && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pr-6 pt-1 pb-1 flex flex-col gap-0.5">
                    {item.children.map((child) => {
                      const ChildIcon = ICON_MAP[child.key];
                      return (
                        <button
                          key={child.key}
                          onClick={() => handleChildClick(child.key)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-right text-sm transition-colors cursor-pointer
                            ${activeCard === child.key
                              ? "text-indigo-300 bg-indigo-500/10"
                              : "text-[#64748b] hover:text-[#94a3b8] hover:bg-white/[0.03]"
                            }`}
                        >
                          {ChildIcon && <ChildIcon size={16} strokeWidth={1.5} />}
                          <span>{child.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </MobileMenu>
  );
}

export default MobileNav;
