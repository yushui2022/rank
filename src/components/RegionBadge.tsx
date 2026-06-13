import { getRegionData } from "../utils/countryUtils";

type RegionBadgeProps = {
  countryCode: string;
  showName?: boolean;
};

export function RegionBadge({ countryCode, showName = true }: RegionBadgeProps) {
  const region = getRegionData(countryCode);

  return (
    <span className={`region-badge theme-${region.colorTheme}`} title={region.name}>
      <span className="region-badge-code">{region.code}</span>
      {showName && <span className="region-badge-name">{countryCode}</span>}
    </span>
  );
}
