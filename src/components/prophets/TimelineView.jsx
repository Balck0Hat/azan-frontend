import React from "react";
import PersonCard from "./PersonCard";
import { allProphets } from "./prophetsData";

const TimelineView = ({ onSelect }) => (
  <div className="timeline-view">
    <h3 className="section-title">
      <span className="icon">{"\u23F3"}</span>
      {"\u0627\u0644\u0623\u0646\u0628\u064A\u0627\u0621 \u0639\u0628\u0631 \u0627\u0644\u0632\u0645\u0646"}
    </h3>
    <div className="timeline-container">
      {allProphets.map((prophet, index) => (
        <div
          key={prophet.id}
          className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
        >
          <div className="timeline-content">
            <PersonCard
              person={prophet}
              isLast={prophet.isLast}
              onSelect={onSelect}
            />
          </div>
          <div className="timeline-dot">
            {prophet.isLast ? "\u262A" : "\u25CF"}
          </div>
          {prophet.era && <div className="timeline-era">{prophet.era}</div>}
        </div>
      ))}
      <div className="timeline-line" />
    </div>
  </div>
);

export default TimelineView;
