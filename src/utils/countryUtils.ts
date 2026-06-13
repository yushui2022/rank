export type RegionCode = string;

type RegionData = {
  code: string;
  name: string;
  colorTheme: "blue" | "red" | "neutral" | "green" | "amber";
};

const REGION_MAP: Record<string, RegionData> = {
  US: { code: "US", name: "United States", colorTheme: "blue" },
  CN: { code: "CN", name: "China", colorTheme: "red" },
  UK: { code: "UK", name: "United Kingdom", colorTheme: "blue" },
  GB: { code: "UK", name: "United Kingdom", colorTheme: "blue" }, // Map GB to UK
  JP: { code: "JP", name: "Japan", colorTheme: "red" },
  EU: { code: "EU", name: "Europe", colorTheme: "blue" },
  KR: { code: "KR", name: "South Korea", colorTheme: "blue" },
  IN: { code: "IN", name: "India", colorTheme: "amber" },
  SG: { code: "SG", name: "Singapore", colorTheme: "red" },
  CA: { code: "CA", name: "Canada", colorTheme: "red" },
  FR: { code: "FR", name: "France", colorTheme: "blue" },
  DE: { code: "DE", name: "Germany", colorTheme: "neutral" },
};

const DEFAULT_REGION: RegionData = {
  code: "GL", // Global/Unknown
  name: "Global",
  colorTheme: "neutral",
};

export const getRegionData = (countryCode: string): RegionData => {
  const code = countryCode.toUpperCase().trim();
  return REGION_MAP[code] || { ...DEFAULT_REGION, code: code.slice(0, 2) || "GL", name: countryCode };
};
