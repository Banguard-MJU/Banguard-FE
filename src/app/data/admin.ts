export type AdminSection = "overview" | "reports" | "content" | "knowledge";
export type AdminStatus = "pending" | "in-review" | "resolved" | "published" | "draft" | "archived";

export interface AdminReportItem {
  id: string;
  targetType: "post" | "comment";
  targetTitle: string;
  category: string;
  reporterCount: number;
  latestReason: string;
  reportedAt: string;
  status: Extract<AdminStatus, "pending" | "in-review" | "resolved">;
}

export interface AdminContentItem {
  id: string;
  type: "community" | "review" | "policy";
  title: string;
  owner: string;
  updatedAt: string;
  status: Extract<AdminStatus, "published" | "draft" | "archived">;
}

export interface AdminKnowledgeItem {
  id: string;
  title: string;
  source: string;
  updatedAt: string;
  status: Extract<AdminStatus, "published" | "draft" | "archived">;
  summary: string;
}

export interface AdminOverviewMetric {
  id: string;
  label: string;
  value: string;
  trend: string;
  description: string;
  tone: "amber" | "blue" | "emerald" | "violet";
}

export interface AdminQueueSnapshot {
  id: string;
  label: string;
  value: string;
  helper: string;
  status: "stable" | "watch" | "urgent";
}

export interface AdminRecentActivityItem {
  id: string;
  title: string;
  description: string;
  actor: string;
  occurredAt: string;
  type: "report" | "content" | "knowledge";
}

export interface AdminKnowledgeHealth {
  publishedCount: number;
  needsReviewCount: number;
  staleCount: number;
  lastSyncedAt: string;
}

export const ADMIN_SECTION_OPTIONS: Array<{ id: AdminSection; label: string; description: string }> = [
  { id: "overview", label: "운영 현황", description: "신고, 콘텐츠, 지식 상태를 한눈에 봅니다." },
  { id: "reports", label: "신고 목록", description: "신고 접수와 검토 상태를 관리합니다." },
  { id: "content", label: "콘텐츠 관리", description: "커뮤니티/리뷰/정책 콘텐츠 상태를 확인합니다." },
  { id: "knowledge", label: "지식베이스 관리", description: "정책/가이드 문서를 갱신하고 점검합니다." },
];

export const ADMIN_STATUS_LABELS: Record<AdminStatus, string> = {
  pending: "처리 대기",
  "in-review": "검토 중",
  resolved: "조치 완료",
  published: "게시 중",
  draft: "초안",
  archived: "보관",
};

export const ADMIN_STATUS_STYLES: Record<AdminStatus, string> = {
  pending:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300",
  "in-review":
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300",
  resolved:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300",
  published:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300",
  draft:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
  archived:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300",
};

export const MOCK_ADMIN_REPORTS: AdminReportItem[] = [
  {
    id: "report-001",
    targetType: "post",
    targetTitle: "[경고] 서울 관악구 OO동 건물주 조심하세요",
    category: "주의 매물",
    reporterCount: 3,
    latestReason: "사기 또는 불법 의심",
    reportedAt: "오늘 09:40",
    status: "pending",
  },
  {
    id: "report-002",
    targetType: "comment",
    targetTitle: "연락처가 포함된 댓글",
    category: "댓글",
    reporterCount: 1,
    latestReason: "개인정보 노출",
    reportedAt: "오늘 08:10",
    status: "in-review",
  },
  {
    id: "report-003",
    targetType: "post",
    targetTitle: "전세보증보험 가입 성공 후기",
    category: "경험 공유",
    reporterCount: 2,
    latestReason: "오해를 부르는 정보",
    reportedAt: "어제 16:22",
    status: "resolved",
  },
];

export const MOCK_ADMIN_CONTENT: AdminContentItem[] = [
  {
    id: "content-001",
    type: "community",
    title: "근저당권 많은 집 계약했다가 큰일 날 뻔했어요",
    owner: "안전제일",
    updatedAt: "오늘 10:30",
    status: "published",
  },
  {
    id: "content-002",
    type: "review",
    title: "성수동 첫 자취 후기, 한양대 통학은 정말 편했어요",
    owner: "자취새내기",
    updatedAt: "어제 13:20",
    status: "published",
  },
  {
    id: "content-003",
    type: "policy",
    title: "청년 월세 특별지원 안내 카드",
    owner: "운영팀",
    updatedAt: "2일 전",
    status: "draft",
  },
];

export const MOCK_ADMIN_KNOWLEDGE: AdminKnowledgeItem[] = [
  {
    id: "knowledge-001",
    title: "전세보증금 반환보증 운영 가이드",
    source: "주택도시보증공사(HUG)",
    updatedAt: "오늘 11:15",
    status: "published",
    summary: "보증보험 가입 조건과 최신 확인 포인트를 운영 지식베이스에 반영한 상태입니다.",
  },
  {
    id: "knowledge-002",
    title: "전입신고 · 확정일자 체크리스트",
    source: "방가드 내부 정리",
    updatedAt: "어제 15:00",
    status: "draft",
    summary: "신규 상담 답변용 체크리스트를 정리 중이며 관리자 검수가 필요합니다.",
  },
  {
    id: "knowledge-003",
    title: "청년 전월세 대출 FAQ",
    source: "주택도시기금",
    updatedAt: "3일 전",
    status: "archived",
    summary: "구버전 금리 기준으로 작성돼 교체 전까지 보관 상태로 유지합니다.",
  },
];

export const MOCK_ADMIN_OVERVIEW_METRICS: AdminOverviewMetric[] = [
  {
    id: "pending-reports",
    label: "처리 대기 신고",
    value: "12건",
    trend: "+3 오늘",
    description: "오전 시간대 커뮤니티 신고가 늘어 우선 검토가 필요한 상태입니다.",
    tone: "amber",
  },
  {
    id: "review-sla",
    label: "평균 1차 응답",
    value: "43분",
    trend: "-12분 이번 주",
    description: "직전 주보다 빠르게 검토를 시작하고 있어 운영 응답 속도가 개선되고 있습니다.",
    tone: "blue",
  },
  {
    id: "healthy-content",
    label: "게시 중 콘텐츠",
    value: "96%",
    trend: "기준 유지",
    description: "초안과 보관 상태를 제외한 주요 사용자 노출 콘텐츠의 최신성이 안정적입니다.",
    tone: "emerald",
  },
  {
    id: "knowledge-sync",
    label: "지식베이스 최신 반영",
    value: "4건",
    trend: "이번 주",
    description: "정책/보증 관련 가이드가 금주에 새로 반영되거나 수정되었습니다.",
    tone: "violet",
  },
];

export const MOCK_ADMIN_QUEUE_SNAPSHOTS: AdminQueueSnapshot[] = [
  {
    id: "queue-reports",
    label: "신고 대기열",
    value: "7건",
    helper: "2건은 30분 이상 미처리",
    status: "urgent",
  },
  {
    id: "queue-content",
    label: "콘텐츠 검수",
    value: "5건",
    helper: "리뷰 2건, 정책 카드 1건 포함",
    status: "watch",
  },
  {
    id: "queue-knowledge",
    label: "지식베이스 검토",
    value: "3건",
    helper: "대출 FAQ와 체크리스트 갱신 필요",
    status: "stable",
  },
];

export const MOCK_ADMIN_RECENT_ACTIVITY: AdminRecentActivityItem[] = [
  {
    id: "activity-001",
    title: "관악구 주의 매물 게시글 신고 접수",
    description: "동일 게시글에 중복 신고가 누적되어 우선 검토 대상으로 승격되었습니다.",
    actor: "운영봇",
    occurredAt: "10분 전",
    type: "report",
  },
  {
    id: "activity-002",
    title: "청년 월세 특별지원 정책 카드 수정",
    description: "지원 자격 설명 문구와 제출 서류 예시가 최신 기준으로 수정되었습니다.",
    actor: "정책 운영자",
    occurredAt: "42분 전",
    type: "content",
  },
  {
    id: "activity-003",
    title: "전세보증금 반환보증 가이드 게시",
    description: "HUG 기준 변경 사항이 반영된 새 버전이 게시 상태로 전환되었습니다.",
    actor: "지식베이스 관리자",
    occurredAt: "오늘 11:15",
    type: "knowledge",
  },
  {
    id: "activity-004",
    title: "거주지 리뷰 한 건 보관 처리",
    description: "실거주 후기 검증이 되지 않은 게시물이 보관 상태로 이동했습니다.",
    actor: "커뮤니티 운영자",
    occurredAt: "오늘 09:20",
    type: "content",
  },
];

export const MOCK_ADMIN_KNOWLEDGE_HEALTH: AdminKnowledgeHealth = {
  publishedCount: 18,
  needsReviewCount: 3,
  staleCount: 2,
  lastSyncedAt: "오늘 11:15",
};
