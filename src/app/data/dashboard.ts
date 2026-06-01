export type DashboardRiskLevel = "low" | "medium" | "high";
export type DashboardRiskLevelInput = DashboardRiskLevel | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
export type DashboardDateInput = Date | string | number;

export interface AnalysisHistory {
  id: string;
  fileName: string;
  date: DashboardDateInput;
  riskLevel: DashboardRiskLevelInput;
  riskScore: number;
  address: string;
  contractType: string;
}

export interface RecentChatActivity {
  id: string;
  title: string;
  timestamp: DashboardDateInput;
}

export interface RecentCommunityActivity {
  id: string;
  title: string;
  category: "experience" | "qa" | "region" | "warning";
  timestamp: DashboardDateInput;
  engagement: string;
}

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  tone: "primary" | "warning" | "secondary";
}

export function normalizeRiskLevel(level: DashboardRiskLevelInput): DashboardRiskLevel {
  switch (String(level).toLowerCase()) {
    case "low":
      return "low";
    case "medium":
      return "medium";
    case "high":
    case "critical":
      return "high";
    default:
      return "medium";
  }
}

export function toDashboardDate(date: DashboardDateInput): Date {
  if (date instanceof Date) {
    return Number.isNaN(date.getTime()) ? new Date(0) : date;
  }

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime()) ? new Date(0) : parsedDate;
}

export function formatDashboardDate(date: DashboardDateInput) {
  return toDashboardDate(date).toLocaleDateString("ko-KR");
}

export function getRiskBadgeClass(level: DashboardRiskLevelInput) {
  switch (normalizeRiskLevel(level)) {
    case "low":
      return "bg-green-100 text-green-700 border-green-200";
    case "medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "high":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "";
  }
}

export function getRiskLabel(level: DashboardRiskLevelInput) {
  switch (normalizeRiskLevel(level)) {
    case "low":
      return "낮음";
    case "medium":
      return "중간";
    case "high":
      return "높음";
    default:
      return "";
  }
}

export function buildDashboardStats(history: AnalysisHistory[]) {
  const validScores = history
    .map((item) => Number(item.riskScore))
    .filter((score) => Number.isFinite(score));
  const averageRisk = validScores.length
    ? Math.round(validScores.reduce((acc, score) => acc + score, 0) / validScores.length)
    : 0;

  return [
    {
      label: "총 분석 건수",
      value: history.length,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "평균 위험도",
      value: averageRisk,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      suffix: "/100"
    },
    {
      label: "고위험 계약",
      value: history.filter((item) => normalizeRiskLevel(item.riskLevel) === "high").length,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      label: "안전한 계약",
      value: history.filter((item) => normalizeRiskLevel(item.riskLevel) === "low").length,
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ];
}

export function formatTimeAgo(date: DashboardDateInput) {
  const seconds = Math.floor((Date.now() - toDashboardDate(date).getTime()) / 1000);

  if (seconds < 60) return "방금 전";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}일 전`;
  return formatDashboardDate(date);
}

export function buildRecommendedActions(history: AnalysisHistory[]): RecommendedAction[] {
  const latestHighRisk = history.find((item) => normalizeRiskLevel(item.riskLevel) === "high");

  const actions: RecommendedAction[] = [
    {
      id: "action-chatbot",
      title: "AI 상담으로 위험 요소 확인하기",
      description: "최근 분석 결과에서 궁금한 점을 바로 질문하고 후속 조치를 점검하세요.",
      ctaLabel: "챗봇 열기",
      href: "/chatbot",
      tone: "primary",
    },
    {
      id: "action-policy",
      title: "보증·지원 제도 함께 확인하기",
      description: "현재 상황에 맞는 정책, 보증, 체크리스트를 살펴보고 계약 판단에 참고하세요.",
      ctaLabel: "정책 보기",
      href: "/policy",
      tone: "secondary",
    },
    {
      id: "action-contract",
      title: "새 계약서 다시 분석하기",
      description: "다른 후보 매물이나 수정된 계약서를 같은 흐름으로 다시 확인해보세요.",
      ctaLabel: "새 분석 시작",
      href: "/contract-analysis",
      tone: "secondary",
    },
  ];

  if (latestHighRisk) {
    actions.unshift({
      id: "action-high-risk",
      title: "고위험 계약 우선 재확인",
      description: `${latestHighRisk.fileName} 분석 결과가 높음으로 표시되었습니다. 계약 진행 전 권리관계와 특약을 다시 점검하세요.`,
      ctaLabel: "분석 화면 보기",
      href: "/contract-analysis",
      tone: "warning",
    });
  } else {
    actions.unshift({
      id: "action-community",
      title: "커뮤니티 경험담 참고하기",
      description: "실제 경험과 주의 사례를 확인해 계약 전 판단에 참고하세요.",
      ctaLabel: "커뮤니티 보기",
      href: "/community",
      tone: "secondary",
    });
  }

  return actions;
}
