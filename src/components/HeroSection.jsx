import { motion } from "framer-motion";

export default function HeroSection({ settings }) {
    return (
        <motion.section
            className="relative overflow-hidden rounded-2xl mx-auto my-8 px-6 py-14 md:py-20 text-center"
            style={{
                background: 'var(--gradient-card), var(--bg-card)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-color)',
            }}
            id="top"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            {/* Glow effects */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)' }}
            />
            <div
                className="absolute bottom-0 right-0 w-56 h-56 rounded-full opacity-15 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, var(--accent-secondary) 0%, transparent 70%)' }}
            />

            <motion.div
                className="relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                {/* Badge */}
                <motion.span
                    className="inline-block px-5 py-2 mb-6 text-sm font-medium rounded-full"
                    style={{
                        background: 'color-mix(in srgb, var(--accent-primary) 15%, transparent)',
                        color: 'var(--accent-primary)',
                        border: '1px solid color-mix(in srgb, var(--accent-primary) 25%, transparent)',
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {settings.hero_badge}
                </motion.span>

                {/* Title with animated gradient */}
                <motion.h1
                    className="text-3xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight"
                    style={{
                        background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 40%, var(--accent-secondary) 60%, var(--text-primary) 100%)',
                        backgroundSize: '200% 200%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        animation: 'heroGradientShift 6s ease infinite',
                    }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    {settings.hero_title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.6 }}
                >
                    {settings.hero_subtitle}
                </motion.p>
            </motion.div>

            <style>{`
                @keyframes heroGradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
            `}</style>
        </motion.section>
    );
}
