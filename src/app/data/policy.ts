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

export const POLICY_RESOURCES: PolicyResource[] = [
  {
    id: "jeonse-guarantee",
    title: "전세보증금 반환보증",
    provider: "주택도시보증공사(HUG)",
    category: "guarantee",
    summary: "계약 종료 후 보증금을 돌려받지 못할 때 보증기관이 대신 반환을 지원하는 대표 보증 제도입니다.",
    benefit: "보증금 미반환 위험을 낮추고, 고위험 계약 여부를 다시 점검하는 기준으로도 활용할 수 있습니다.",
    eligibility: "주택 가격과 보증금 비율, 권리관계, 임대인 세금 체납 여부 등을 종합해 확인합니다.",
    recommendedFor: "전세 계약을 앞두고 있거나 근저당이 있어 반환 위험이 걱정되는 사용자",
    keyPoints: [
      "계약 직전 최신 등기부등본으로 권리관계를 다시 확인합니다.",
      "보증금 비율과 주택 가격이 가입 기준에 들어오는지 점검합니다.",
      "추가 근저당 여부나 임대인 체납 리스크를 함께 확인합니다.",
    ],
    tags: ["전세", "보증보험", "보증금", "반환보증"],
    featured: true,
  },
  {
    id: "youth-monthly-support",
    title: "청년 월세 특별지원",
    provider: "국토교통부 · 지자체 연계",
    category: "support",
    summary: "청년 1인 가구의 주거비 부담을 줄이기 위해 일정 기간 월세를 지원하는 제도입니다.",
    benefit: "예산이 빠듯한 사회초년생이나 대학생이 월세 부담을 줄이며 안정적으로 거주를 이어갈 수 있습니다.",
    eligibility: "연령, 소득, 가구 형태, 거주 주택 기준을 충족해야 하며 지역별 세부 조건이 다를 수 있습니다.",
    recommendedFor: "월세 거주 중이거나 전세 대신 월세를 검토 중인 청년층",
    keyPoints: [
      "지원 기간과 월 지원 한도는 공고 시점 기준으로 달라질 수 있습니다.",
      "부모와 별도 거주 여부, 소득 기준 충족 여부를 함께 확인합니다.",
      "거주 지역별 공고를 다시 확인하는 것이 안전합니다.",
    ],
    tags: ["청년", "월세", "특별지원", "주거비"],
    featured: true,
  },
  {
    id: "youth-loan",
    title: "청년 전월세보증금 대출 안내",
    provider: "주택도시기금 · 협약 은행",
    category: "finance",
    summary: "청년층이 전세 또는 월세 보증금을 마련할 수 있도록 저금리 대출 정보를 제공하는 제도입니다.",
    benefit: "초기 보증금 마련 부담을 줄이고, 무리한 계약 규모를 피하는 데 도움이 됩니다.",
    eligibility: "나이, 소득, 자산, 주택 기준, 기존 대출 보유 여부 등을 종합적으로 봅니다.",
    recommendedFor: "보증금 마련 계획을 세우는 대학생, 취업 준비생, 사회초년생",
    keyPoints: [
      "대출 가능 금액과 상환 계획을 계약 규모보다 먼저 계산합니다.",
      "보증보험과 병행 가능한 상품인지 확인합니다.",
      "금리와 중도상환 조건을 함께 확인하면 판단이 쉬워집니다.",
    ],
    tags: ["청년", "대출", "전월세", "보증금"],
  },
  {
    id: "move-in-check",
    title: "전입신고 · 확정일자 체크 가이드",
    provider: "주민센터 · 등기소 안내 기준",
    category: "checklist",
    summary: "입주 직후 챙겨야 하는 전입신고와 확정일자 절차를 한 번에 정리한 안내 가이드입니다.",
    benefit: "대항력과 우선변제권 확보를 위한 기본 절차를 놓치지 않게 도와줍니다.",
    eligibility: "주택 임대차 계약을 체결하고 실제 입주하는 대부분의 임차인에게 해당됩니다.",
    recommendedFor: "계약 직후 해야 할 절차가 헷갈리는 사용자",
    keyPoints: [
      "이사 당일 또는 가능한 빠른 시점에 전입신고와 확정일자를 함께 챙깁니다.",
      "계약서 원본과 신분증을 미리 준비하면 절차가 빠릅니다.",
      "전입신고만으로 충분하지 않으므로 확정일자까지 완료 여부를 확인합니다.",
    ],
    tags: ["전입신고", "확정일자", "대항력", "우선변제권"],
  },
  {
    id: "contract-checklist",
    title: "계약 전 필수 확인 체크리스트",
    provider: "방가드 AI 정리 가이드",
    category: "checklist",
    summary: "계약 전후로 꼭 확인해야 하는 서류, 권리관계, 특약, 보증 관련 체크포인트를 정리한 가이드입니다.",
    benefit: "복잡한 정보를 한 번에 정리해 계약 직전 빠르게 재점검할 수 있습니다.",
    eligibility: "전세, 월세, 보증부월세를 검토하는 모든 사용자에게 유용합니다.",
    recommendedFor: "계약 직전에 빠르게 전체 흐름을 다시 점검하고 싶은 사용자",
    keyPoints: [
      "등기부등본은 계약 직전 다시 확인합니다.",
      "임대인 신분과 실제 소유자가 같은지 점검합니다.",
      "보증보험 가능 여부와 특약 문구를 함께 확인합니다.",
    ],
    tags: ["계약", "체크리스트", "서류", "특약"],
  },
];

export function getCategoryLabel(category: PolicyCategory) {
  return POLICY_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? "기타";
}

export function getFeaturedPolicies() {
  return POLICY_RESOURCES.filter((policy) => policy.featured);
}

export function getPoliciesByCategory(category: PolicyCategory | "all") {
  if (category === "all") {
    return POLICY_RESOURCES;
  }

  return POLICY_RESOURCES.filter((policy) => policy.category === category);
}

export function filterPolicies(query: string, category: PolicyCategory | "all") {
  const normalizedQuery = query.trim().toLowerCase();
  const byCategory = getPoliciesByCategory(category);

  if (!normalizedQuery) {
    return byCategory;
  }

  return byCategory.filter((policy) => {
    return [
      policy.title,
      policy.provider,
      policy.summary,
      policy.benefit,
      policy.eligibility,
      policy.recommendedFor,
      ...policy.tags,
    ].some((field) => field.toLowerCase().includes(normalizedQuery));
  });
}

export function getPolicyById(policyId: string) {
  return POLICY_RESOURCES.find((policy) => policy.id === policyId) ?? null;
}
