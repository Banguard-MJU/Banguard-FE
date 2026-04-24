export interface AnalysisHistory {
  id: string;
  fileName: string;
  date: Date;
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  address: string;
  contractType: string;
}

export interface RecentChatActivity {
  id: string;
  title: string;
  summary: string;
  timestamp: Date;
}

export interface RecentCommunityActivity {
  id: string;
  title: string;
  category: "experience" | "qa" | "region" | "warning";
  summary: string;
  timestamp: Date;
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

export const MOCK_HISTORY: AnalysisHistory[] = [
  {
    id: "1",
    fileName: "전세계약서_신림동.pdf",
    date: new Date("2024-03-20"),
    riskLevel: "medium",
    riskScore: 68,
    address: "서울시 관악구 신림동 123-45",
    contractType: "전세"
  },
  {
    id: "2",
    fileName: "월세계약서_노량진.pdf",
    date: new Date("2024-03-15"),
    riskLevel: "low",
    riskScore: 32,
    address: "서울시 동작구 노량진동 67-89",
    contractType: "월세"
  },
  {
    id: "3",
    fileName: "전세계약서_상도동.pdf",
    date: new Date("2024-03-10"),
    riskLevel: "high",
    riskScore: 85,
    address: "서울시 동작구 상도동 234-56",
    contractType: "전세"
  },
  {
    id: "4",
    fileName: "원룸계약서_서울대입구.pdf",
    date: new Date("2024-03-05"),
    riskLevel: "low",
    riskScore: 28,
    address: "서울시 관악구 봉천동 345-67",
    contractType: "월세"
  }
];

export const MOCK_RECENT_CHAT_ACTIVITY: RecentChatActivity[] = [
  {
    id: "chat-1",
    title: "근저당권 설정 문의",
    summary: "근저당권이 전세금보다 많을 때 어떤 기준으로 위험을 판단해야 하는지 상담했어요.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: "chat-2",
    title: "전세보증보험 가입 조건",
    summary: "보증보험 가입 가능 여부와 준비 서류를 확인했어요.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
];

export const MOCK_RECENT_COMMUNITY_ACTIVITY: RecentCommunityActivity[] = [
  {
    id: "community-1",
    title: "전세보증보험 가입 성공 후기",
    category: "experience",
    summary: "조건이 까다로웠던 사례에서 어떤 서류를 준비했는지 공유한 글이에요.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    engagement: "댓글 28 · 좋아요 156",
  },
  {
    id: "community-2",
    title: "[경고] 서울 관악구 OO동 건물주 조심하세요",
    category: "warning",
    summary: "최근 지역 내 전세 사기 의심 사례를 경고하는 게시물이에요.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    engagement: "댓글 67 · 조회 3,421",
  },
];

export function getRiskBadgeClass(level: AnalysisHistory["riskLevel"]) {
  switch (level) {
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

export function getRiskLabel(level: AnalysisHistory["riskLevel"]) {
  switch (level) {
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
  return [
    {
      label: "총 분석 건수",
      value: history.length,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "평균 위험도",
      value: Math.round(history.reduce((acc, item) => acc + item.riskScore, 0) / history.length),
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      suffix: "/100"
    },
    {
      label: "고위험 계약",
      value: history.filter((item) => item.riskLevel === "high").length,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      label: "안전한 계약",
      value: history.filter((item) => item.riskLevel === "low").length,
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ];
}

export function formatTimeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "방금 전";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}일 전`;
  return date.toLocaleDateString("ko-KR");
}

export function buildRecommendedActions(history: AnalysisHistory[]): RecommendedAction[] {
  const latestHighRisk = history.find((item) => item.riskLevel === "high");

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
