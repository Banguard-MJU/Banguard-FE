import type { RegionCode } from "./profile";

export type ResidenceHousingType = "one-room" | "villa" | "officetel" | "apartment";
export type ResidenceSatisfaction = "high" | "medium" | "low";

export interface ResidenceReview {
  id: string;
  title: string;
  author: string;
  region: RegionCode;
  district: string;
  neighborhood: string;
  nearbyUniversity?: string;
  housingType: ResidenceHousingType;
  satisfaction: ResidenceSatisfaction;
  monthlyCostText: string;
  stayDurationText: string;
  summary: string;
  pros: string[];
  cons: string[];
  tips: string[];
  tags: string[];
  createdAt: Date;
}

export const HOUSING_TYPE_OPTIONS: Array<{ value: ResidenceHousingType | "all"; label: string }> = [
  { value: "all", label: "전체 주거 형태" },
  { value: "one-room", label: "원룸" },
  { value: "villa", label: "빌라" },
  { value: "officetel", label: "오피스텔" },
  { value: "apartment", label: "아파트" },
];

export const SATISFACTION_OPTIONS: Array<{ value: ResidenceSatisfaction | "all"; label: string }> = [
  { value: "all", label: "전체 만족도" },
  { value: "high", label: "만족" },
  { value: "medium", label: "보통" },
  { value: "low", label: "아쉬움" },
];

export const SATISFACTION_LABELS: Record<ResidenceSatisfaction, string> = {
  high: "만족",
  medium: "보통",
  low: "아쉬움",
};

export const SATISFACTION_STYLES: Record<ResidenceSatisfaction, string> = {
  high:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300",
  medium:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300",
  low:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300",
};

export const RESIDENCE_REVIEWS: ResidenceReview[] = [
  {
    id: "review-seongsu-hanyang",
    title: "성수동 첫 자취 후기, 한양대 통학은 정말 편했어요",
    author: "자취새내기",
    region: "seoul",
    district: "seoul-seongdong",
    neighborhood: "성동구 성수동",
    nearbyUniversity: "hanyang",
    housingType: "one-room",
    satisfaction: "high",
    monthlyCostText: "보증금 1,000 / 월세 62만",
    stayDurationText: "8개월 거주",
    summary: "통학과 생활 편의는 좋았고, 다만 관리비와 주말 유동인구는 미리 감안하면 좋습니다.",
    pros: ["한양대, 성수역 접근이 편함", "야간 귀가 동선이 비교적 밝음", "카페/편의점 밀집"],
    cons: ["관리비 체감이 큼", "주말 소음이 있는 편", "신축형 원룸은 가격이 빠르게 오름"],
    tips: ["계약 전 관리비 포함 항목을 꼭 확인", "엘리베이터 유무가 생활 만족도 차이를 크게 만듦"],
    tags: ["한양대", "성수동", "원룸"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "review-mapo-hongik",
    title: "망원동 오피스텔 후기, 홍대/연남 생활권 좋아요",
    author: "홍대통학러",
    region: "seoul",
    district: "seoul-mapo",
    neighborhood: "마포구 망원동",
    nearbyUniversity: "hongik",
    housingType: "officetel",
    satisfaction: "medium",
    monthlyCostText: "보증금 1,500 / 월세 78만",
    stayDurationText: "1년 2개월 거주",
    summary: "주변 분위기와 이동은 만족스럽지만, 오피스텔 특유의 관리비와 공용 규정은 호불호가 있습니다.",
    pros: ["홍대입구/합정 이동 편리", "생활 인프라가 풍부", "건물 보안은 안정적"],
    cons: ["관리비가 높음", "분리수거 규정이 까다로움", "방음은 기대보다 평범"],
    tips: ["오피스텔은 주거용 확정일자 가능 여부 확인", "월 고정비를 관리비까지 합산해 계산"],
    tags: ["홍익대", "망원동", "오피스텔"],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "review-bundang-gachon",
    title: "정자동 전세형 원룸, 조용해서 공부하기 좋았습니다",
    author: "분당정착",
    region: "gyeonggi",
    district: "gyeonggi-seongnam-bundang",
    neighborhood: "성남시 분당구 정자동",
    nearbyUniversity: "gachon-global",
    housingType: "villa",
    satisfaction: "high",
    monthlyCostText: "전세 2억 8,000",
    stayDurationText: "2년 거주",
    summary: "조용한 주거 환경과 생활 편의는 좋았고, 전세 계약이라 보증보험과 대출 한도 점검이 중요했습니다.",
    pros: ["조용한 분위기", "정자동 인프라 우수", "치안 체감이 좋은 편"],
    cons: ["전세금 진입장벽 높음", "역세권 대비 도보 시간이 조금 있음"],
    tips: ["전세는 계약 직전 등기부 재확인", "보증보험 가능 여부를 먼저 체크"],
    tags: ["분당", "정자동", "전세"],
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
  },
  {
    id: "review-bupyeong-inha",
    title: "부평 빌라 거주 후기, 예산은 좋지만 건물 상태 차이가 커요",
    author: "실속거주자",
    region: "incheon",
    district: "incheon-bupyeong",
    neighborhood: "인천 부평구 부평동",
    nearbyUniversity: "inha",
    housingType: "villa",
    satisfaction: "low",
    monthlyCostText: "전세 1억 1,000",
    stayDurationText: "6개월 거주",
    summary: "예산상 메리트는 있었지만 건물 컨디션 편차가 크고, 계약 전 확인이 부족하면 만족도가 크게 갈릴 수 있습니다.",
    pros: ["예산이 비교적 낮음", "생활권은 무난"],
    cons: ["주차/공용관리 아쉬움", "같은 동네도 건물 상태 편차 큼", "습기 체크 필요"],
    tips: ["빌라는 낮 시간 방문으로 채광/습기 확인", "근저당과 선순위 권리 확인은 필수"],
    tags: ["부평", "빌라", "주의"],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
];

export function getHousingTypeLabel(type: ResidenceHousingType) {
  return HOUSING_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? "기타";
}

export function filterResidenceReviews({
  query,
  region,
  district,
  university,
  housingType,
  satisfaction,
}: {
  query: string;
  region?: string;
  district?: string;
  university?: string;
  housingType: ResidenceHousingType | "all";
  satisfaction: ResidenceSatisfaction | "all";
}) {
  const normalizedQuery = query.trim().toLowerCase();

  return RESIDENCE_REVIEWS.filter((review) => {
    const matchesRegion = !region || region === "all" || review.region === region;
    const matchesDistrict = !district || district === "all" || review.district === district;
    const matchesUniversity = !university || university === "all" || review.nearbyUniversity === university;
    const matchesHousingType = housingType === "all" || review.housingType === housingType;
    const matchesSatisfaction = satisfaction === "all" || review.satisfaction === satisfaction;
    const matchesQuery =
      normalizedQuery === "" ||
      [
        review.title,
        review.neighborhood,
        review.summary,
        review.monthlyCostText,
        ...review.tags,
        ...review.pros,
        ...review.cons,
      ].some((field) => field.toLowerCase().includes(normalizedQuery));

    return (
      matchesRegion &&
      matchesDistrict &&
      matchesUniversity &&
      matchesHousingType &&
      matchesSatisfaction &&
      matchesQuery
    );
  });
}
