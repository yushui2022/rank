import { getDimensionMaxScore } from "../../data/scoringWeights";
import type { DomainId } from "../../types/rankings";
import type { DimensionScore } from "../../types/rankings";
import { displayDimensionLabel } from "../../utils/displayText";

type CompanyScoreRadarProps = {
  dimensions: DimensionScore[];
  domainId: DomainId;
};

type RadarPoint = {
  x: number;
  y: number;
};

type RadarDimension = DimensionScore & {
  displayLabel: string;
  shortLabel: string;
  maxScore: number;
  ratio: number;
  attainment: number;
  point: RadarPoint;
  labelPoint: RadarPoint;
};

const center = 210;
const radarRadius = 122;
const labelRadius = 172;

const shortLabelMap: Record<string, string> = {
  "Market position": "Market",
  "Commercial traction": "Commercial",
  "Product and technology": "Product",
  "Delivery and operations": "Delivery",
  "Ecosystem and channels": "Ecosystem",
  "Global reach": "Global",
  "Financial and organizational health": "Finance",
  "Risk control": "Risk",
};

const pointAt = (angle: number, radius: number): RadarPoint => ({
  x: center + Math.cos(angle) * radius,
  y: center + Math.sin(angle) * radius,
});

const pointsToString = (points: RadarPoint[]) =>
  points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");

const textAnchorFor = (x: number) => {
  if (x < center - 54) return "start";
  if (x > center + 54) return "end";
  return "middle";
};

const topDimensions = (dimensions: RadarDimension[]) =>
  [...dimensions]
    .sort((left, right) => right.ratio - left.ratio || right.score - left.score)
    .slice(0, 3);

export function CompanyScoreRadar({ dimensions, domainId }: CompanyScoreRadarProps) {
  const angleStep = (Math.PI * 2) / Math.max(dimensions.length, 1);

  const radarDimensions: RadarDimension[] = dimensions.map((dimension, index) => {
    const angle = -Math.PI / 2 + index * angleStep;
    const displayLabel = displayDimensionLabel(dimension.label);
    const maxScore = getDimensionMaxScore(domainId, displayLabel, dimension.weight);
    const rawRatio = maxScore > 0 ? dimension.score / maxScore : 0;
    const ratio = Math.max(0, Math.min(1, rawRatio));

    return {
      ...dimension,
      displayLabel,
      shortLabel: shortLabelMap[displayLabel] ?? displayLabel,
      maxScore,
      ratio,
      attainment: ratio * 100,
      point: pointAt(angle, radarRadius * ratio),
      labelPoint: pointAt(angle, labelRadius),
    };
  });

  const outerPolygon = pointsToString(
    radarDimensions.map((_, index) => pointAt(-Math.PI / 2 + index * angleStep, radarRadius)),
  );
  const midPolygon = pointsToString(
    radarDimensions.map((_, index) => pointAt(-Math.PI / 2 + index * angleStep, radarRadius * 0.66)),
  );
  const innerPolygon = pointsToString(
    radarDimensions.map((_, index) => pointAt(-Math.PI / 2 + index * angleStep, radarRadius * 0.33)),
  );
  const valuePolygon = pointsToString(radarDimensions.map((dimension) => dimension.point));
  const leaders = topDimensions(radarDimensions);

  return (
    <div className="company-score-radar-layout">
      <figure className="company-score-radar-chart" aria-label="Dimension attainment radar">
        <svg className="company-radar-svg" viewBox="0 0 420 420" role="img">
          <title>Dimension attainment radar</title>
          <defs>
            <linearGradient
              id="companyRadarFill"
              x1="90"
              y1="90"
              x2="330"
              y2="330"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#2f3437" stopOpacity="0.28" />
              <stop offset="1" stopColor="#1f6c9f" stopOpacity="0.34" />
            </linearGradient>
          </defs>

          <circle className="company-radar-outer-circle" cx={center} cy={center} r="174" />
          <polygon className="company-radar-ring muted" points={innerPolygon} />
          <polygon className="company-radar-ring muted" points={midPolygon} />
          <polygon className="company-radar-ring strong" points={outerPolygon} />

          {radarDimensions.map((dimension, index) => {
            const outerPoint = pointAt(-Math.PI / 2 + index * angleStep, radarRadius);
            return (
              <line
                key={`${dimension.displayLabel}-axis`}
                className="company-radar-axis"
                x1={center}
                y1={center}
                x2={outerPoint.x}
                y2={outerPoint.y}
              />
            );
          })}

          <polygon className="company-radar-fill" points={valuePolygon} />
          <polygon className="company-radar-line" points={valuePolygon} />

          {radarDimensions.map((dimension) => (
            <g key={`${dimension.displayLabel}-point`}>
              <circle className="company-radar-dot" cx={dimension.point.x} cy={dimension.point.y} r="4" />
              <text
                className="company-radar-label"
                x={dimension.labelPoint.x}
                y={dimension.labelPoint.y}
                textAnchor={textAnchorFor(dimension.labelPoint.x)}
              >
                {dimension.shortLabel}
              </text>
              <text
                className="company-radar-label-score"
                x={dimension.labelPoint.x}
                y={dimension.labelPoint.y + 15}
                textAnchor={textAnchorFor(dimension.labelPoint.x)}
              >
                {Math.round(dimension.attainment)}%
              </text>
            </g>
          ))}

          <circle className="company-radar-center-dot" cx={center} cy={center} r="3" />
        </svg>
      </figure>

      <div className="company-radar-copy">
        <div className="company-radar-insight">
          <span>Dimension attainment</span>
          <strong>{leaders.map((dimension) => dimension.shortLabel).join(" / ")}</strong>
          <p>
            Each axis uses the fixed max score from the scoring formula, not the imported
            row weight. A fuller radius means the company is closer to the full mark for
            that specific dimension.
          </p>
        </div>

        <div className="company-radar-dimension-list">
          {radarDimensions.map((dimension, index) => (
            <div className="company-radar-dimension" key={`${dimension.displayLabel}-${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong title={dimension.displayLabel}>{dimension.shortLabel}</strong>
                <em>
                  {dimension.score.toFixed(1)} / {dimension.maxScore.toFixed(1)} pts
                </em>
              </div>
              <b>{Math.round(dimension.attainment)}%</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
