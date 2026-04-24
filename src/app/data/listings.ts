export type ListingType = "jeonse" | "monthly" | "office-tel";
export type ListingRiskLevel = "safe" | "caution" | "warning";
export type ListingBudgetRange = "all" | "under-100m" | "100m-300m" | "300m-plus";

export interface Listing {
  id: string;
  title: string;
  region: "seoul" | "gyeonggi" | "incheon" | "busan" | "daejeon";
  district: string;
  neighborhood: string;
  address: string;
  type: ListingType;
  depositText: string;
  monthlyRentText: string;
  priceValue: number;
  areaText: string;
  floorText: string;
  commuteText: string;
  landlordType: string;
  riskLevel: ListingRiskLevel;
  riskSummary: string;
  highlights: string[];
  cautionPoints: string[];
  recommendedActions: string[];
  recommendedPolicyCategory: "guarantee" | "support" | "finance" | "checklist";
  nearbyUniversities: string[];
  tags: string[];
  featured?: boolean;
}

export const LISTING_TYPE_OPTIONS: Array<{ value: ListingType | "all"; label: string }> = [
  { value: "all", label: "전체 유형" },
  { value: "jeonse", label: "전세" },
  { value: "monthly", label: "월세" },
  { value: "office-tel", label: "오피스텔" },
];

export const LISTING_BUDGET_OPTIONS: Array<{ value: ListingBudgetRange; label: string }> = [
  { value: "all", label: "전체 가격" },
  { value: "under-100m", label: "1억 이하" },
  { value: "100m-300m", label: "1억~3억" },
  { value: "300m-plus", label: "3억 이상" },
];

export const LISTING_RISK_LABELS: Record<ListingRiskLevel, string> = {
  safe: "안전도 양호",
  caution: "추가 확인 필요",
  warning: "주의 필요",
};

export const LISTING_RISK_STYLES: Record<ListingRiskLevel, string> = {
  safe:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300",
  caution:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300",
  warning:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300",
};

export const LISTINGS: Listing[] = [
  {
    id: "listing-seongsu-jeonse",
    title: "성수동 청년 전세 추천 매물",
    region: "seoul",
    district: "seoul-seongdong",
    neighborhood: "성동구 성수동",
    address: "서울시 성동구 성수이로 00길",
    type: "jeonse",
    depositText: "전세 2억 4,000",
    monthlyRentText: "관리비 8만",
    priceValue: 240000000,
    areaText: "전용 23m²",
    floorText: "7층 / 12층",
    commuteText: "성수역 도보 6분",
    landlordType: "개인 임대인",
    riskLevel: "safe",
    riskSummary: "보증보험 검토 가능성이 높고 주변 시세 대비 과도하게 높지 않아 첫 검토 우선순위로 보기 좋습니다.",
    highlights: ["역세권", "신축 4년차", "풀옵션", "보증보험 가능 검토"],
    cautionPoints: ["계약 직전 등기부등본 재확인", "관리비 포함 항목 확인"],
    recommendedActions: ["계약서 분석으로 특약 점검", "보증보험 가능 여부 AI 상담", "성수동 후기 검색"],
    recommendedPolicyCategory: "guarantee",
    nearbyUniversities: ["hanyang"],
    tags: ["역세권", "신축", "청년추천"],
    featured: true,
  },
  {
    id: "listing-mapo-monthly",
    title: "망원동 보증부 월세 스튜디오",
    region: "seoul",
    district: "seoul-mapo",
    neighborhood: "마포구 망원동",
    address: "서울시 마포구 월드컵로 00길",
    type: "monthly",
    depositText: "보증금 2,000",
    monthlyRentText: "월세 68만",
    priceValue: 20000000,
    areaText: "전용 18m²",
    floorText: "3층 / 5층",
    commuteText: "망원역 도보 9분",
    landlordType: "법인 임대인",
    riskLevel: "caution",
    riskSummary: "월세 부담은 무난하지만 법인 임대인 계약이라 관리 주체와 특약 범위를 조금 더 세밀하게 볼 필요가 있습니다.",
    highlights: ["반려동물 협의", "즉시 입주", "채광 양호"],
    cautionPoints: ["관리비 상세 내역 확인", "임대 사업자 정보 일치 확인", "중도 퇴실 특약 검토"],
    recommendedActions: ["월세 지원 정책 보기", "AI 상담으로 계약 조건 점검", "같은 지역 후기 참고"],
    recommendedPolicyCategory: "support",
    nearbyUniversities: ["hongik", "sogang", "yonsei", "ewha"],
    tags: ["월세", "즉시입주", "도심생활"],
    featured: true,
  },
  {
    id: "listing-suwon-office",
    title: "광교 오피스텔 1.5룸",
    region: "gyeonggi",
    district: "gyeonggi-suwon-yeongtong",
    neighborhood: "수원시 영통구 광교",
    address: "경기도 수원시 영통구 센트럴타운로 00",
    type: "office-tel",
    depositText: "보증금 1,000",
    monthlyRentText: "월세 82만",
    priceValue: 10000000,
    areaText: "전용 27m²",
    floorText: "12층 / 20층",
    commuteText: "광교중앙역 버스 8분",
    landlordType: "개인 임대인",
    riskLevel: "caution",
    riskSummary: "오피스텔 특성상 관리비와 주거용 확정일자 가능 여부를 먼저 확인해야 합니다.",
    highlights: ["복층", "커뮤니티 시설", "주차 가능"],
    cautionPoints: ["주거용 사용 조건 확인", "공용관리비 확인", "확정일자 가능 여부 확인"],
    recommendedActions: ["체크리스트 정책 열기", "오피스텔 계약 분석", "거주 후기 확인"],
    recommendedPolicyCategory: "checklist",
    nearbyUniversities: ["ajou", "kyonggi-suwon"],
    tags: ["오피스텔", "광교", "복층"],
  },
  {
    id: "listing-bupyeong-jeonse",
    title: "부평 구축 빌라 전세",
    region: "incheon",
    district: "incheon-bupyeong",
    neighborhood: "부평구 부평동",
    address: "인천시 부평구 부평문화로 00번길",
    type: "jeonse",
    depositText: "전세 1억 1,000",
    monthlyRentText: "관리비 4만",
    priceValue: 110000000,
    areaText: "전용 34m²",
    floorText: "2층 / 4층",
    commuteText: "부평시장역 도보 7분",
    landlordType: "개인 임대인",
    riskLevel: "warning",
    riskSummary: "주변 구축 시세 대비 보증금이 높아 보이고, 권리관계 확인 전까지는 서두르지 않는 편이 좋습니다.",
    highlights: ["큰 실면적", "전통시장 인접", "저층"],
    cautionPoints: ["선순위 권리 여부 확인", "보증보험 가입 가능 여부 우선 확인", "근저당 변동 이력 확인"],
    recommendedActions: ["전세보증 정책 확인", "등기부 기반 계약 분석", "주의 매물 커뮤니티 탐색"],
    recommendedPolicyCategory: "guarantee",
    nearbyUniversities: ["inha"],
    tags: ["구축", "빌라", "주의매물"],
  },
  {
    id: "listing-gangseo-monthly",
    title: "가양동 사회초년생 원룸",
    region: "seoul",
    district: "seoul-gangseo",
    neighborhood: "강서구 가양동",
    address: "서울시 강서구 양천로 00길",
    type: "monthly",
    depositText: "보증금 1,000",
    monthlyRentText: "월세 55만",
    priceValue: 10000000,
    areaText: "전용 16m²",
    floorText: "5층 / 6층",
    commuteText: "가양역 도보 11분",
    landlordType: "법인 임대인",
    riskLevel: "safe",
    riskSummary: "예산이 빠듯한 사용자에게 무난한 월세 선택지이며 청년 월세 지원과 함께 보기에 좋습니다.",
    highlights: ["보증금 낮음", "인터넷 포함", "엘리베이터"],
    cautionPoints: ["월세 인상 특약 확인", "계약 갱신 조건 확인"],
    recommendedActions: ["청년 월세 지원 보기", "AI 상담으로 실부담 계산", "지역 후기 확인"],
    recommendedPolicyCategory: "support",
    nearbyUniversities: ["kangseo"],
    tags: ["월세지원", "사회초년생", "실속형"],
  },
  {
    id: "listing-bundang-jeonse",
    title: "정자동 신축형 원룸 전세",
    region: "gyeonggi",
    district: "gyeonggi-seongnam-bundang",
    neighborhood: "성남시 분당구 정자동",
    address: "경기도 성남시 분당구 정자일로 00",
    type: "jeonse",
    depositText: "전세 3억 2,000",
    monthlyRentText: "관리비 10만",
    priceValue: 320000000,
    areaText: "전용 26m²",
    floorText: "10층 / 15층",
    commuteText: "정자역 도보 5분",
    landlordType: "전문 임대 법인",
    riskLevel: "caution",
    riskSummary: "매물 상태는 좋지만 전세금이 큰 편이라 대출과 보증보험을 함께 검토하는 흐름이 중요합니다.",
    highlights: ["초역세권", "신축급", "보안 우수", "분리형 구조"],
    cautionPoints: ["전세대출 한도 확인", "보증보험 수수료 확인", "법인 임대 계약 문구 확인"],
    recommendedActions: ["금융 정책 보기", "전세 계약 분석", "같은 단지 후기 확인"],
    recommendedPolicyCategory: "finance",
    nearbyUniversities: ["gachon-global"],
    tags: ["전세대출", "역세권", "신축급"],
  },
];

function matchesBudget(priceValue: number, range: ListingBudgetRange) {
  if (range === "all") {
    return true;
  }

  if (range === "under-100m") {
    return priceValue < 100000000;
  }

  if (range === "100m-300m") {
    return priceValue >= 100000000 && priceValue < 300000000;
  }

  return priceValue >= 300000000;
}

export function getListingTypeLabel(type: ListingType) {
  return LISTING_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? "기타";
}

export function getFeaturedListings() {
  return LISTINGS.filter((listing) => listing.featured);
}

export function getListingById(listingId: string) {
  return LISTINGS.find((listing) => listing.id === listingId) ?? null;
}

export function filterListings({
  query,
  region,
  district,
  university,
  type,
  budget,
}: {
  query: string;
  region: string;
  district?: string;
  university?: string;
  type: ListingType | "all";
  budget: ListingBudgetRange;
}) {
  const normalizedQuery = query.trim().toLowerCase();

  return LISTINGS.filter((listing) => {
    const matchesRegion = region === "all" || listing.region === region;
    const matchesDistrict = !district || district === "all" || listing.district === district;
    const matchesUniversity = !university || university === "all" || listing.nearbyUniversities.includes(university);
    const matchesType = type === "all" || listing.type === type;
    const matchesPrice = matchesBudget(listing.priceValue, budget);
    const matchesQuery =
      normalizedQuery === "" ||
      [
        listing.title,
        listing.region,
        listing.neighborhood,
        listing.address,
        listing.depositText,
        listing.monthlyRentText,
        listing.riskSummary,
        ...listing.highlights,
        ...listing.tags,
      ].some((field) => field.toLowerCase().includes(normalizedQuery));

    return matchesRegion && matchesDistrict && matchesUniversity && matchesType && matchesPrice && matchesQuery;
  });
}
