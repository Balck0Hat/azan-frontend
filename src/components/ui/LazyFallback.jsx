import React from "react";

const fallbackStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 200,
  gap: 16,
  padding: 32,
};

const spinnerStyle = {
  width: 40,
  height: 40,
  border: "3px solid var(--border, #e5e7eb)",
  borderTopColor: "var(--primary, #6366f1)",
  borderRadius: "50%",
  animation: "lazy-spin 0.8s linear infinite",
};

const textStyle = {
  color: "var(--text-secondary, #6b7280)",
  fontSize: 14,
  fontFamily: "inherit",
};

export default function LazyFallback() {
  return (
    <div style={fallbackStyle}>
      <style>{`@keyframes lazy-spin { to { transform: rotate(360deg) } }`}</style>
      <div style={spinnerStyle} />
      <span style={textStyle}>جارٍ التحميل...</span>
    </div>
  );
}
