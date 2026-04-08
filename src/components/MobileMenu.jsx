import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
    };
  }, [isOpen]);

  return (
    <>
      <button
        className="lg:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
        onClick={onToggle}
        aria-label="menu-toggle"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      {isOpen && createPortal(
        <>
          <div
            onClick={onToggle}
            style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.6)" }}
          />
          <div
            style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "18rem", zIndex: 9999, background: "var(--bg-card-solid)", overflowY: "auto" }}
          >
            <div style={{ padding: "5rem 1rem 2rem" }}>
              <ul className="flex flex-col gap-1">
                {children}
              </ul>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

export default MobileMenu;
