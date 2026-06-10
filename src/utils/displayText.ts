const dimensionLabelMap: Record<string, string> = {
  "市场地位": "Market position",
  "商业化能力": "Commercial traction",
  "产品与技术能力": "Product and technology",
  "交付与运营能力": "Delivery and operations",
  "生态与渠道能力": "Ecosystem and channels",
  "全球化能力": "Global reach",
  "财务与组织健康": "Financial and organizational health",
  "风险控制": "Risk control",
};

export const displayDimensionLabel = (label: string) =>
  dimensionLabelMap[label] ?? label;

export const formatSignedNumber = (value: number) =>
  `${value >= 0 ? "+" : "-"}${Math.abs(value)}`;

export const formatWorkbookSnapshot = (
  slug?: string,
  snapshotDate?: string,
) => `${slug ?? "workbook"} / snapshot ${snapshotDate ?? "n/a"}`;
