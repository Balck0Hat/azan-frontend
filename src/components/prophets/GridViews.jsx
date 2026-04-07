import React from "react";
import PersonCard from "./PersonCard";
import {
  prophetsInQuran,
  prophetsNotInQuran,
  wives,
  prophetChildren,
  grandchildren,
  ahlAlBaytDescendants,
  khulafaRashidun,
  uluAlAzm,
  getProphet,
} from "./prophetsData";

export const GridViewQuran = ({ onSelect }) => (
  <div className="grid-view">
    <h3 className="section-title">
      <span className="icon">{"\uD83D\uDCD6"}</span>
      {"\u0627\u0644\u0623\u0646\u0628\u064A\u0627\u0621 \u0627\u0644\u062E\u0645\u0633\u0629 \u0648\u0627\u0644\u0639\u0634\u0631\u0648\u0646 \u0627\u0644\u0645\u0630\u0643\u0648\u0631\u0648\u0646 \u0641\u064A \u0627\u0644\u0642\u0631\u0622\u0646"}
    </h3>
    <div className="prophets-grid">
      {prophetsInQuran.map((prophet) => (
        <PersonCard key={prophet.id} person={prophet} isLast={prophet.isLast} onSelect={onSelect} />
      ))}
    </div>
  </div>
);

export const GridViewSunnah = ({ onSelect }) => (
  <div className="grid-view sunnah-view">
    <h3 className="section-title">
      <span className="icon">{"\uD83D\uDCDA"}</span>
      {"\u0623\u0646\u0628\u064A\u0627\u0621 \u0645\u0646 \u0627\u0644\u0633\u0646\u0629 \u0648\u0627\u0644\u062A\u0631\u0627\u062B"}
    </h3>
    <div className="prophets-grid">
      {prophetsNotInQuran.map((prophet) => (
        <PersonCard key={prophet.id} person={prophet} onSelect={onSelect} />
      ))}
    </div>
  </div>
);

const FamilySubsection = ({ icon, title, data, type, gridClass, onSelect }) => (
  <div className="family-subsection">
    <h4 className="subsection-title">
      <span className="sub-icon">{icon}</span>
      {title}
    </h4>
    <div className={`family-grid ${gridClass}-grid`}>
      {data.map((item) => (
        <PersonCard key={item.id} person={item} type={type} size="small" onSelect={onSelect} />
      ))}
    </div>
  </div>
);

export const ProphetFamilySection = ({ onSelect }) => (
  <div className="family-section">
    <h3 className="section-title">
      <span className="icon">{"\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66"}</span>
      {"\u0639\u0627\u0626\u0644\u0629 \u0627\u0644\u0646\u0628\u064A \uFDFA"}
    </h3>
    <FamilySubsection icon={"\uD83D\uDC8D"} title={"\u0623\u0645\u0647\u0627\u062A \u0627\u0644\u0645\u0624\u0645\u0646\u064A\u0646"} data={wives} type="wife" gridClass="wives" onSelect={onSelect} />
    <FamilySubsection icon={"\uD83D\uDC76"} title={"\u0623\u0628\u0646\u0627\u0621 \u0648\u0628\u0646\u0627\u062A \u0627\u0644\u0646\u0628\u064A \uFDFA"} data={prophetChildren} type="child" gridClass="children" onSelect={onSelect} />
    <FamilySubsection icon={"\uD83C\uDF19"} title={"\u0627\u0644\u0623\u062D\u0641\u0627\u062F (\u0623\u0628\u0646\u0627\u0621 \u0641\u0627\u0637\u0645\u0629 \u0648\u0639\u0644\u064A)"} data={grandchildren} type="grandchild" gridClass="grandchildren" onSelect={onSelect} />
    <FamilySubsection icon={"\uD83C\uDFE0"} title={"\u0645\u0646 \u0630\u0631\u064A\u0629 \u0627\u0644\u062D\u0633\u064A\u0646 (\u0622\u0644 \u0627\u0644\u0628\u064A\u062A)"} data={ahlAlBaytDescendants} type="grandchild" gridClass="descendants" onSelect={onSelect} />
  </div>
);

export const KhulafaSection = ({ onSelect }) => (
  <div className="khulafa-section">
    <h3 className="section-title">
      <span className="icon">{"\u2694"}</span>
      {"\u0627\u0644\u062E\u0644\u0641\u0627\u0621 \u0627\u0644\u0631\u0627\u0634\u062F\u0648\u0646"}
    </h3>
    <div className="khulafa-grid">
      {khulafaRashidun.map((khalifa) => (
        <PersonCard key={khalifa.id} person={khalifa} type="khalifa" onSelect={onSelect} />
      ))}
    </div>
  </div>
);

export const UluAlAzmSection = ({ onSelect }) => (
  <div className="ulu-alazm-section">
    <h3 className="section-title">
      <span className="icon">{"\u2B50"}</span>
      {"\u0623\u0648\u0644\u0648 \u0627\u0644\u0639\u0632\u0645 \u0645\u0646 \u0627\u0644\u0631\u0633\u0644"}
    </h3>
    <p className="section-subtitle">{"\u0623\u0641\u0636\u0644 \u0627\u0644\u0631\u0633\u0644 \u0648\u0623\u0639\u0638\u0645\u0647\u0645 \u0635\u0628\u0631\u0627\u064B"}</p>
    <div className="ulu-alazm-grid">
      {uluAlAzm.map((id) => {
        const prophet = getProphet(id);
        if (!prophet) return null;
        return (
          <PersonCard key={id} person={prophet} isMain={true} isLast={prophet.isLast} onSelect={onSelect} />
        );
      })}
    </div>
  </div>
);
