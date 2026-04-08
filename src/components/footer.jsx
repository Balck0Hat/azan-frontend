import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-16">
      {/* Gradient border top */}
      <div className="h-px w-full bg-gradient-to-l from-transparent via-indigo-500/40 to-transparent" />

      <div
        className="py-8 px-4"
        style={{ background: "rgba(2,6,23,0.8)", backdropFilter: "blur(16px)" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4 text-center">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-[#e2e8f0] text-sm font-medium">
            <span className="text-indigo-400">&#1757;</span>
            <span>&copy; 2025 {"\u0627\u0644\u0623\u0630\u0627\u0646 \u0645\u0628\u0627\u0634\u0631"} | Azan Live</span>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-[#64748b] max-w-md leading-relaxed">
            {"\u0627\u0644\u0623\u0648\u0642\u0627\u062a \u0644\u0644\u0639\u0631\u0636 \u0648\u0627\u0644\u0645\u0634\u0627\u0647\u062f\u0629 \u0648\u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0641\u0642\u0637\u060c \u0648\u0644\u0627 \u062a\u064f\u0639\u062a\u0628\u0631 \u0645\u0631\u062c\u0639\u064b\u0627 \u0634\u0631\u0639\u064a\u064b\u0627 \u0644\u0647\u0627."}
          </p>

          {/* Made with love */}
          <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
            <span>{"\u0635\u064f\u0646\u0639 \u0628\u0640"}</span>
            <Heart size={14} className="text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
