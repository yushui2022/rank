import React from "react";
import type { Entity, RankingRow } from "../types/rankings";

type RankingRecord = {
  row: RankingRow;
  entity: Entity;
  viewScore: number;
};

type RankHistoryChartProps = {
  records: RankingRecord[];
  selectedEntityId: string;
};

type Point = {
  date: Date;
  rank: number;
};

type Series = {
  entityId: string;
  name: string;
  color: string;
  points: Point[];
};

// Generate mock historical data for the top 10 entities
function generateMockHistory(topRecords: RankingRecord[]) {
  const history: Series[] = [];
  const now = new Date();
  
  // Create 12 months of history
  const months = 12;
  const timePoints = Array.from({ length: months }).map((_, i) => {
    const d = new Date(now);
    d.setMonth(now.getMonth() - (months - 1 - i));
    return d;
  });

  // Desaturated warm-neutral palette aligned with the editorial direction.
  // Rank 1 gets the accent; the rest step down through muted slate/taupe tones.
  const colors = [
    "#1f6c9f", // accent (rank 1)
    "#5c5f66", // slate
    "#956400", // amber
    "#346538", // moss
    "#8a6d3b", // taupe
    "#6b7280", // cool gray
    "#9f6b53", // clay
    "#4a6670", // steel
    "#7a6a8a", // muted plum
    "#8a8d93", // light gray
  ];

  topRecords.forEach((record, index) => {
    const currentRank = record.row.rank;
    const points = [];
    
    // Start with some random rank and move towards the current rank
    let rank = Math.max(1, Math.min(10, currentRank + Math.floor(Math.random() * 4) - 2));
    
    for (let i = 0; i < months; i++) {
      if (i === months - 1) {
        rank = currentRank; // Force the last point to be the actual current rank
      } else {
        // Random walk, tending towards current rank
        const diff = currentRank - rank;
        const move = Math.random() > 0.5 ? Math.sign(diff) * Math.floor(Math.random() * 2) : 0;
        rank = Math.max(1, Math.min(10, rank + move));
      }
      
      points.push({
        date: timePoints[i],
        rank: rank,
      });
    }
    
    history.push({
      entityId: record.entity.id,
      name: record.entity.name,
      color: colors[index % colors.length],
      points,
    });
  });

  return { history, timePoints };
}

export function RankHistoryChart({ records, selectedEntityId }: RankHistoryChartProps) {
  // Only show top 10
  const topRecords = records.slice(0, 10);
  
  if (topRecords.length === 0) return null;

  const { history, timePoints } = React.useMemo(() => generateMockHistory(topRecords), [topRecords]);

  // Chart dimensions aligned with RankingTable
  const width = 800;
  const headerHeight = 48; // Matches .ranking-table th height
  const rowHeight = 52; // Matches .ranking-table td height
  const height = headerHeight + 10 * rowHeight;
  const padding = { top: 0, right: 140, bottom: 0, left: 40 };
  const innerWidth = width - padding.left - padding.right;

  // Scales
  const getX = (date: Date) => {
    const startTime = timePoints[0].getTime();
    const endTime = timePoints[timePoints.length - 1].getTime();
    return padding.left + ((date.getTime() - startTime) / (endTime - startTime)) * innerWidth;
  };

  const getY = (rank: number) => {
    // Rank 1 is in the middle of the first row (headerHeight + rowHeight / 2)
    return headerHeight + (rank - 1) * rowHeight + (rowHeight / 2);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  };

  return (
    <section className="ranking-panel rank-history-panel" style={{ marginTop: "0" }}>
      <div className="panel-title-row">
        <div>
          <span>History</span>
          <h2>Rank Trend (Top 10)</h2>
        </div>
        <p>12-month trailing position</p>
      </div>
      
      <div className="chart-container" style={{ overflowX: "auto", padding: "0 16px" }}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ minWidth: "600px", display: "block" }}>
          {/* Grid lines (horizontal) */}
          {Array.from({ length: 10 }).map((_, i) => {
            const rank = i + 1;
            const y = getY(rank);
            return (
              <g key={`grid-y-${rank}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="var(--line)"
                  strokeDasharray="2 4"
                  opacity={0.5}
                />
                <text
                  x={padding.left - 10}
                  y={y}
                  alignmentBaseline="middle"
                  textAnchor="end"
                  fill="var(--ink-3)"
                  fontSize="13"
                  fontFamily="var(--mono)"
                  fontWeight="600"
                >
                  {rank}
                </text>
              </g>
            );
          })}

          {/* Grid lines (vertical) */}
          {timePoints.map((date, i) => {
            const x = getX(date);
            return (
              <g key={`grid-x-${i}`}>
                <line
                  x1={x}
                  y1={headerHeight}
                  x2={x}
                  y2={height}
                  stroke="var(--line)"
                  strokeDasharray="2 4"
                  opacity={0.3}
                />
                {/* Show label for every other month to avoid crowding */}
                {i % 2 === 0 && (
                  <text
                    x={x}
                    y={headerHeight / 2}
                    alignmentBaseline="middle"
                    textAnchor="middle"
                    fill="var(--ink-3)"
                    fontSize="12"
                    fontFamily="var(--mono)"
                    fontWeight="700"
                  >
                    {formatDate(date)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Lines and points */}
          {history.map((series) => {
            // Determine highlighting/dimming based on selected entity
            const isSelected = selectedEntityId === series.entityId;
            const hasSelection = Boolean(selectedEntityId);
            const isFocused = hasSelection ? isSelected : false;
            
            // Set opacity: 
            // - If something is selected, selected gets 1.0, others get 0.15
            // - If nothing is selected, all get 0.8
            const opacity = hasSelection ? (isSelected ? 1.0 : 0.18) : 0.85;
            const labelOpacity = hasSelection ? (isSelected ? 1.0 : 0.45) : 1.0;

            // Build step-after path
            let pathD = "";
            series.points.forEach((point, j) => {
              const x = getX(point.date);
              const y = getY(point.rank);
              if (j === 0) {
                pathD += `M ${x} ${y}`;
              } else {
                // Step after: go horizontally to current X, then vertically to current Y
                pathD += ` L ${x} ${getY(series.points[j - 1].rank)} L ${x} ${y}`;
              }
            });

            return (
              <g key={`series-${series.entityId}`}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={series.color}
                  strokeWidth={isFocused ? "3" : "2"}
                  opacity={opacity}
                />
                {series.points.map((point, j) => {
                  const x = getX(point.date);
                  const y = getY(point.rank);
                  return (
                    <rect
                      key={`point-${series.entityId}-${j}`}
                      x={x - (isFocused ? 4 : 3)}
                      y={y - (isFocused ? 4 : 3)}
                      width={isFocused ? 8 : 6}
                      height={isFocused ? 8 : 6}
                      fill={series.color}
                      opacity={opacity}
                    />
                  );
                })}
                
                {/* Legend label at the end of the line */}
                <text
                  x={width - padding.right + 10}
                  y={getY(series.points[series.points.length - 1].rank)}
                  alignmentBaseline="middle"
                  fill={series.color}
                  fontSize="13"
                  fontWeight={isFocused ? "800" : "600"}
                  opacity={labelOpacity}
                  stroke="#ffffff"
                  strokeWidth="3"
                  paintOrder="stroke"
                  style={{ strokeLinejoin: "round" }}
                >
                  {series.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
