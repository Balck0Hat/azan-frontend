import React from "react";
import PersonCard from "./PersonCard";
import { mainLineage } from "./prophetsData";

const MainLineageView = ({ onSelect }) => (
  <div className="main-lineage-view">
    <h3 className="section-title">
      <span className="icon">{"\uD83D\uDCFF"}</span>
      {"\u0633\u0644\u0633\u0644\u0629 \u0627\u0644\u0646\u0633\u0628 \u0645\u0646 \u0622\u062F\u0645 \u0625\u0644\u0649 \u0645\u062D\u0645\u062F \uFDFA"}
    </h3>
    <p className="section-subtitle">{mainLineage.length} {"\u062C\u064A\u0644\u0627\u064B"}</p>
    <div className="lineage-scroll">
      {mainLineage.map((prophet, index) => (
        <React.Fragment key={prophet.id}>
          <PersonCard
            person={prophet}
            isMain={true}
            isLast={prophet.isLast}
            onSelect={onSelect}
          />
          {index < mainLineage.length - 1 && (
            <div className="lineage-connector">
              <div className="connector-line" />
              <div className="connector-arrow">{"\u25BC"}</div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

export default MainLineageView;
