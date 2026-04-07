import { useEffect, useRef } from "react";

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
                className="navbar-mobile-toggle"
                onClick={onToggle}
                aria-label="القائمة"
            >
                <span className={`hamburger ${isOpen ? "open" : ""}`}>
                    <span></span><span></span><span></span>
                </span>
            </button>

            <ul className={`navbar-links ${isOpen ? "mobile-open" : ""}`}>
                {children}
            </ul>
        </>
    );
}

export default MobileMenu;
