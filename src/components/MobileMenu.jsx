import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

function MobileMenu({ isOpen, onToggle, children }) {
  const scrollY = useRef(0);

  useEffect(() => {
    if (isOpen) {
      scrollY.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, scrollY.current);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        className="lg:hidden relative z-50 p-2 rounded-xl text-[#94a3b8] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
        onClick={onToggle}
        aria-label="\u0627\u0644\u0642\u0627\u0626\u0645\u0629"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={onToggle}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-40 w-72 overflow-y-auto lg:hidden"
              style={{ background: "rgba(15,23,42,0.95)", backdropFilter: "blur(24px)" }}
            >
              <div className="pt-20 px-4 pb-8">
                <ul className="flex flex-col gap-1">
                  {children}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default MobileMenu;
