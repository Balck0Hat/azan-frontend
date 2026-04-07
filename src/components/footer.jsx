import "../styles/footer.css"

export default function Footer() {
    return (
        <footer className="footer">
            {/* Gradient overlay */}
            <div className="footer-glow" />

            <div className="footer-container">
                <div className="footer-content">
                    {/* Copyright */}
                    <div className="footer-copyright">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path d="M3 21h18" />
                            <path d="M5 21V11" />
                            <path d="M19 21V11" />
                            <path d="M5 11h14" />
                            <path d="M12 11V6" />
                            <path d="M9 11c0-3 3-5 3-5s3 2 3 5" />
                            <path d="M12 6l-0.5-2" />
                            <circle cx="12" cy="3" r="1" fill="currentColor" />
                        </svg>
                        <span>© 2025 الأذان مباشر | Azan Live</span>
                    </div>

                    {/* Disclaimer */}
                    <p className="footer-disclaimer">الأوقات للعرض والمشاهدة والمتابعة فقط، ولا تُعتبر مرجعًا شرعيًا لها.</p>

                    {/* Made with love */}
                    <div className="footer-made">
                        <span>صُنع بـ</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </footer>
    )
}
