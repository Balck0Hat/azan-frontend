import prophetsData from "../../data/prophets.json";

export const getProphet = (id) =>
  prophetsData.prophets.find((p) => p.id === id);

export const getChild = (id) =>
  prophetsData.prophetChildren.find((c) => c.id === id);

export const mainLineage = prophetsData.mainLineage
  .map((id) => getProphet(id))
  .filter(Boolean);

export const allProphets = prophetsData.prophets.filter((p) => p.isProphet);

export const prophetsInQuran = prophetsData.prophets.filter(
  (p) => p.isProphet && p.inQuran
);

export const prophetsNotInQuran = prophetsData.prophets.filter(
  (p) => p.isProphet && !p.inQuran
);

export const { wives, prophetChildren, grandchildren, ahlAlBaytDescendants, khulafaRashidun, uluAlAzm } = prophetsData;
