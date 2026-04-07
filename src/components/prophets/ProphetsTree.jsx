import React, { useState, useCallback } from "react";
import { useEscapeKey } from "../../hooks";
import "../../styles/prophetsTree.css";

import TabNavigation from "./TabNavigation";
import DetailModal from "./DetailModal";
import MainLineageView from "./MainLineageView";
import TimelineView from "./TimelineView";
import {
  GridViewQuran,
  GridViewSunnah,
  ProphetFamilySection,
  KhulafaSection,
  UluAlAzmSection,
} from "./GridViews";

const VIEW_MODES = [
  { key: "tree", icon: "\uD83C\uDF33", label: "\u0627\u0644\u0633\u0644\u0633\u0644\u0629" },
  { key: "timeline", icon: "\u23F3", label: "\u0627\u0644\u0632\u0645\u0646" },
  { key: "quran", icon: "\uD83D\uDCD6", label: "\u0627\u0644\u0642\u0631\u0622\u0646" },
  { key: "sunnah", icon: "\uD83D\uDCDA", label: "\u0627\u0644\u0633\u0646\u0629" },
];

const STATS = [
  { number: "25", label: "\u0646\u0628\u064A\u0627\u064B \u0641\u064A \u0627\u0644\u0642\u0631\u0622\u0646" },
  { number: "124,000", label: "\u0646\u0628\u064A (\u0641\u064A \u0627\u0644\u0623\u062D\u0627\u062F\u064A\u062B)" },
  { number: "5", label: "\u0623\u0648\u0644\u0648 \u0627\u0644\u0639\u0632\u0645" },
  { number: "12", label: "\u0623\u0645\u0647\u0627\u062A \u0627\u0644\u0645\u0624\u0645\u0646\u064A\u0646" },
];

const ProphetsTree = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [viewMode, setViewMode] = useState("tree");
  const [activeTab, setActiveTab] = useState("prophets");

  const clearSelection = useCallback(() => setSelectedPerson(null), []);
  useEscapeKey(clearSelection);

  return (
    <div className="prophets-tree-page">
      <div className="prophets-header">
        <div className="header-decoration">{"\u274B"}</div>
        <h1 className="page-title">{"\u0634\u062C\u0631\u0629 \u0627\u0644\u0623\u0646\u0628\u064A\u0627\u0621"}</h1>
        <p className="page-subtitle">{"\u0645\u0646 \u0622\u062F\u0645 \u0639\u0644\u064A\u0647 \u0627\u0644\u0633\u0644\u0627\u0645 \u0625\u0644\u0649 \u0645\u062D\u0645\u062F \uFDFA \u0648\u0630\u0631\u064A\u062A\u0647"}</p>
        <div className="header-decoration">{"\u274B"}</div>
      </div>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="prophets-stats">
        {STATS.map(({ number, label }) => (
          <div key={label} className="stat-card">
            <div className="stat-number">{number}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {activeTab === "prophets" && (
        <>
          <div className="view-toggle">
            {VIEW_MODES.map(({ key, icon, label }) => (
              <button
                key={key}
                className={`toggle-btn ${viewMode === key ? "active" : ""}`}
                onClick={() => setViewMode(key)}
              >
                <span className="btn-icon">{icon}</span>{label}
              </button>
            ))}
          </div>

          <div className="prophets-content">
            {viewMode === "tree" && <MainLineageView onSelect={setSelectedPerson} />}
            {viewMode === "timeline" && <TimelineView onSelect={setSelectedPerson} />}
            {viewMode === "quran" && <GridViewQuran onSelect={setSelectedPerson} />}
            {viewMode === "sunnah" && <GridViewSunnah onSelect={setSelectedPerson} />}
          </div>

          <UluAlAzmSection onSelect={setSelectedPerson} />
        </>
      )}

      {activeTab === "family" && <ProphetFamilySection onSelect={setSelectedPerson} />}
      {activeTab === "khulafa" && <KhulafaSection onSelect={setSelectedPerson} />}

      <DetailModal person={selectedPerson} onClose={clearSelection} onSelect={setSelectedPerson} />
    </div>
  );
};

export default ProphetsTree;
