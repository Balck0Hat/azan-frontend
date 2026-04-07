import { useState, useRef, useEffect } from "react";
import NavDropdown from "./NavDropdown";
import MobileMenu from "./MobileMenu";
import "../styles/navbar.css";
import "../styles/accessibility.css";

const NAV_ITEMS = [
    { key: "home", label: "الرئيسية", icon: "🏠" },
    { key: "ramadan", label: "رمضان", icon: "🌙" },
    {
        key: "salah", label: "الصلاة", icon: "🕌",
        children: [
            { key: "live", label: "الآن يُؤذَّن", icon: "📡", desc: "تابع الأذان لحظة بلحظة" },
            { key: "today", label: "أوقات اليوم", icon: "🕐", desc: "مواقيت الصلاة لمدينتك" },
            { key: "countries", label: "حسب الدولة", icon: "🌍", desc: "أوقات الصلاة حول العالم" },
            { key: "globe", label: "خريطة العالم", icon: "🗺️", desc: "شاهد الأذان حول العالم" },
        ],
    },
    {
        key: "quran-group", label: "القرآن", icon: "📖",
        children: [
            { key: "quran", label: "القرآن والتفسير", icon: "📖", desc: "اقرأ واستمع وتدبر" },
            { key: "rules", label: "قواعد قرآنية", icon: "📜", desc: "تعلّم أحكام التلاوة" },
        ],
    },
    {
        key: "more", label: "المزيد", icon: "☰",
        children: [
            { key: "tools", label: "الأدوات", icon: "🛠️", desc: "تسبيح، تتبع، إنجازات" },
            { key: "stream", label: "البث المباشر", icon: "📺", desc: "بث مباشر من الحرمين" },
            { key: "prophets", label: "شجرة الأنبياء", icon: "🌳", desc: "تعرّف على الأنبياء" },
        ],
    },
];

function Navbar({ activeCard, setActiveCard }) {
    const [openMenu, setOpenMenu] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null);
        };
        const handleEsc = (e) => {
            if (e.key === "Escape") { setMobileOpen(false); setOpenMenu(null); }
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
            setActiveCard(item.key); setOpenMenu(null); setMobileOpen(false);
        }
    };

    const handleChildClick = (childKey) => {
        setActiveCard(childKey); setOpenMenu(null); setMobileOpen(false);
    };

    const isGroupActive = (item) =>
        item.children ? item.children.some((c) => c.key === activeCard) : activeCard === item.key;

    return (
        <nav className="navbar" ref={navRef} aria-label="القائمة الرئيسية">
            <a href="#main-content" className="skip-link">انتقل إلى المحتوى الرئيسي</a>
            <MobileMenu isOpen={mobileOpen} onToggle={() => setMobileOpen(!mobileOpen)}>
                {NAV_ITEMS.map((item) => (
                    <li key={item.key} className={`nav-item ${item.children ? "has-dropdown" : ""}`}>
                        <button
                            className={`nav-btn ${isGroupActive(item) ? "nav-btn-active" : ""}`}
                            onClick={() => handleNavClick(item)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                            {item.children && (
                                <span className={`nav-arrow ${openMenu === item.key ? "open" : ""}`}>‹</span>
                            )}
                        </button>
                        {item.children && openMenu === item.key && (
                            <NavDropdown children={item.children} activeCard={activeCard} onChildClick={handleChildClick} />
                        )}
                    </li>
                ))}
            </MobileMenu>
        </nav>
    );
}

export default Navbar;
