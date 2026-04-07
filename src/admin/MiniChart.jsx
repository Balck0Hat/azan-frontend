import React from 'react';

export default function MiniChart({ data = [] }) {
  if (!data.length) return <div className="admin-empty">No data yet</div>;

  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="mini-chart">
      <div className="mini-chart-bars">
        {data.map(d => {
          const pct = (d.count / maxCount) * 100;
          return (
            <div key={d.date} className="mini-chart-col" title={`${d.date}: ${d.count}`}>
              <div className="mini-chart-bar" style={{ height: `${Math.max(pct, 2)}%` }} />
              <div className="mini-chart-label">{d.date.slice(5)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
