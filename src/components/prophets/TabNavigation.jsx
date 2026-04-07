import React from "react";

const TABS = [
  { key: "prophets", icon: "\uD83D\uDCD6", label: "\u0627\u0644\u0623\u0646\u0628\u064A\u0627\u0621" },
  { key: "family", icon: "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66", label: "\u0627\u0644\u0639\u0627\u0626\u0644\u0629" },
  { key: "khulafa", icon: "\u2694", label: "\u0627\u0644\u062E\u0644\u0641\u0627\u0621" },
];

const TabNavigation = ({ activeTab, setActiveTab }) => (
  <div className="tab-navigation">
    {TABS.map(({ key, icon, label }) => (
      <button
        key={key}
        className={`tab-btn ${activeTab === key ? "active" : ""}`}
        onClick={() => setActiveTab(key)}
      >
        <span className="tab-icon">{icon}</span>
        {label}
      </button>
    ))}
  </div>
);

export default TabNavigation;
