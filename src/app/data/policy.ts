export type PolicyCategory = "guarantee" | "support" | "finance" | "checklist";

export interface PolicyResource {
  id: string;
  title: string;
  provider: string;
  category: PolicyCategory;
  summary: string;
  benefit: string;
  eligibility: string;
  recommendedFor: string;
  keyPoints: string[];
  tags: string[];
  featured?: boolean;
}

export const POLICY_CATEGORY_OPTIONS: Array<{ value: PolicyCategory | "all"; label: string }> = [
  { value: "all", label: "전체" },
  { value: "guarantee", label: "보증" },
  { value: "support", label: "지원" },
  { value: "finance", label: "금융" },
  { value: "checklist", label: "체크리스트" },
];

export function getCategoryLabel(category: PolicyCategory) {
  return POLICY_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? "기타";
}
