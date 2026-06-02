export interface CommunityComment {
  id: string;
  postId: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked?: boolean;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: "experience" | "qa" | "region" | "warning";
  likes: number;
  comments: number;
  views: number;
  timestamp: Date;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isAuthor?: boolean;
  tags?: string[];
}

export type CommunityReportReasonId =
  | "fraud"
  | "personal-info"
  | "abuse"
  | "spam"
  | "misleading"
  | "other";

export interface CommunityReportReasonOption {
  id: CommunityReportReasonId;
  label: string;
  description: string;
}

export interface CommunityInteractionRecord {
  postId: string;
  title: string;
  content: string;
  author: string;
  category: CommunityPost["category"];
  tags?: string[];
  recordedAt: string;
}

interface CommunityActivityStore {
  likedPosts: CommunityInteractionRecord[];
  bookmarkedPosts: CommunityInteractionRecord[];
}

const COMMUNITY_ACTIVITY_STORAGE_KEY = "banguard_community_activity";

export const MOCK_COMMENTS: CommunityComment[] = [
  {
    id: "c1",
    postId: "1",
    author: "안전거래왕",
    content: "정말 중요한 정보네요! 저도 비슷한 경험이 있어서 공감됩니다. 등기부등본 확인은 필수입니다!",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    likes: 12
  },
  {
    id: "c2",
    postId: "1",
    author: "부동산초보",
    content: "근저당권이 얼마나 설정되어 있었나요? 구체적인 금액이 궁금합니다.",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    likes: 5
  },
  {
    id: "c3",
    postId: "2",
    author: "계약전문가",
    content: "확정일자는 전입신고 당일에 바로 받는 것이 가장 안전합니다. 동사무소에서 한번에 처리 가능해요.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 23
  }
];

export const MOCK_POSTS: CommunityPost[] = [
  {
    id: "1",
    title: "근저당권 많은 집 계약했다가 큰일 날 뻔했어요",
    content: "작년에 전세 계약하려던 집이 있었는데, 등기부등본 확인해보니 근저당권이 전세금보다 많이 설정되어 있더라고요. 방가드에서 분석해보니 위험 신호가 떠서 계약 안했는데, 최근에 그 집주인이 경매에 넘어갔다는 소식 들었습니다...",
    author: "안전제일",
    category: "experience",
    likes: 127,
    comments: 23,
    views: 1542,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    tags: ["근저당권", "전세사기", "후기"]
  },
  {
    id: "2",
    title: "확정일자 받는 타이밍이 정확히 언제인가요?",
    content: "전입신고 하고 바로 받아야 하는건지, 아니면 며칠 있다가 받아도 되는건지 궁금합니다. 계약일과 이사일이 다른 경우는 어떻게 해야하나요?",
    author: "초보집주인",
    category: "qa",
    likes: 45,
    comments: 12,
    views: 832,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    tags: ["확정일자", "전입신고"]
  },
  {
    id: "3",
    title: "[경고] 서울 관악구 OO동 건물주 조심하세요",
    content: "최근 이 지역에서 전세 사기 의심 사례가 여러 건 보고되고 있습니다. 해당 건물의 근저당권 설정액이 비정상적으로 높고, 여러 채의 전세 계약이 동시에 진행되고 있다고 합니다. 계약 전 반드시 꼼꼼히 확인하세요!",
    author: "부동산지킴이",
    category: "warning",
    likes: 234,
    comments: 67,
    views: 3421,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    tags: ["관악구", "전세사기주의", "긴급"]
  },
  {
    id: "4",
    title: "신림동 원룸 시세 정보 공유합니다",
    content: "신림동에서 2년 살면서 파악한 시세 정보입니다. 역세권 원룸 기준 보증금 500-1000만원에 월세 45-55만원 정도가 평균이에요. 전세는 1억-1억 3천 정도 형성되어 있습니다.",
    author: "신림러버",
    category: "region",
    likes: 89,
    comments: 34,
    views: 1243,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    tags: ["신림동", "시세정보", "원룸"]
  },
  {
    id: "5",
    title: "전세보증보험 가입 성공 후기 (조건 까다로웠던 경우)",
    content: "집주인이 개인사업자라 전세보증보험 가입이 까다로울까봐 걱정했는데, HUG에서 추가 서류 제출하니 통과됐습니다. 제가 준비했던 서류 목록과 팁 공유해요!",
    author: "보험성공",
    category: "experience",
    likes: 156,
    comments: 28,
    views: 2103,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    tags: ["전세보증보험", "HUG", "성공후기"]
  }
];

export const COMMUNITY_REPORT_REASONS: CommunityReportReasonOption[] = [
  {
    id: "fraud",
    label: "사기 또는 불법 의심",
    description: "허위 매물, 사기 유도, 불법 중개 정황이 의심되는 경우"
  },
  {
    id: "personal-info",
    label: "개인정보 노출",
    description: "전화번호, 계좌번호, 주소 등 민감한 정보가 드러난 경우"
  },
  {
    id: "abuse",
    label: "비방 또는 혐오 표현",
    description: "특정 개인이나 집단을 공격하거나 불쾌감을 주는 표현이 포함된 경우"
  },
  {
    id: "spam",
    label: "광고 또는 도배",
    description: "반복 게시, 홍보성 문구, 외부 유입 목적의 스팸 게시글인 경우"
  },
  {
    id: "misleading",
    label: "오해를 부르는 정보",
    description: "검증되지 않은 주장이나 사실과 다른 안내로 혼란을 줄 수 있는 경우"
  },
  {
    id: "other",
    label: "기타",
    description: "위 항목에 딱 맞지 않지만 운영진 검토가 필요한 경우"
  }
];

export const CATEGORY_CONFIG = {
  all: { label: "전체", color: "from-gray-500 to-gray-600" },
  experience: { label: "경험 공유", color: "from-blue-500 to-blue-600" },
  qa: { label: "Q&A", color: "from-green-500 to-green-600" },
  region: { label: "지역 정보", color: "from-purple-500 to-purple-600" },
  warning: { label: "주의 매물", color: "from-red-500 to-red-600" }
} as const;

function getEmptyActivityStore(): CommunityActivityStore {
  return {
    likedPosts: [],
    bookmarkedPosts: [],
  };
}

function canUseStorage() {
  return typeof window !== "undefined";
}

function readCommunityActivityMap(): Record<string, CommunityActivityStore> {
  if (!canUseStorage()) {
    return {};
  }

  const rawValue = window.localStorage.getItem(COMMUNITY_ACTIVITY_STORAGE_KEY);
  if (!rawValue) {
    return {};
  }

  try {
    return JSON.parse(rawValue) as Record<string, CommunityActivityStore>;
  } catch {
    window.localStorage.removeItem(COMMUNITY_ACTIVITY_STORAGE_KEY);
    return {};
  }
}

function writeCommunityActivityMap(activityMap: Record<string, CommunityActivityStore>) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(COMMUNITY_ACTIVITY_STORAGE_KEY, JSON.stringify(activityMap));
}

function createInteractionRecord(post: CommunityPost): CommunityInteractionRecord {
  return {
    postId: post.id,
    title: post.title,
    content: post.content,
    author: post.author,
    category: post.category,
    tags: post.tags,
    recordedAt: new Date().toISOString(),
  };
}

function upsertInteractionRecord(
  records: CommunityInteractionRecord[],
  post: CommunityPost
): CommunityInteractionRecord[] {
  const nextRecord = createInteractionRecord(post);
  return [nextRecord, ...records.filter((record) => record.postId !== post.id)];
}

export function getCommunityActivityStore(userId?: string | null): CommunityActivityStore {
  if (!userId) {
    return getEmptyActivityStore();
  }

  const activityMap = readCommunityActivityMap();
  return activityMap[userId] ?? getEmptyActivityStore();
}

export function getCommunityInteractionFlags(userId?: string | null) {
  const activityStore = getCommunityActivityStore(userId);

  return {
    likedPostIds: new Set(activityStore.likedPosts.map((record) => record.postId)),
    bookmarkedPostIds: new Set(activityStore.bookmarkedPosts.map((record) => record.postId)),
  };
}

export function applyCommunityInteractionFlags(
  posts: CommunityPost[],
  userId?: string | null
): CommunityPost[] {
  const { likedPostIds, bookmarkedPostIds } = getCommunityInteractionFlags(userId);

  return posts.map((post) => ({
    ...post,
    isLiked: likedPostIds.has(post.id),
    isBookmarked: bookmarkedPostIds.has(post.id),
  }));
}

export function toggleCommunityActivity(
  userId: string | undefined,
  post: CommunityPost,
  type: "likedPosts" | "bookmarkedPosts"
): boolean {
  if (!userId) {
    return false;
  }

  const activityMap = readCommunityActivityMap();
  const currentStore = activityMap[userId] ?? getEmptyActivityStore();
  const alreadyExists = currentStore[type].some((record) => record.postId === post.id);

  activityMap[userId] = {
    ...currentStore,
    [type]: alreadyExists
      ? currentStore[type].filter((record) => record.postId !== post.id)
      : upsertInteractionRecord(currentStore[type], post),
  };

  writeCommunityActivityMap(activityMap);
  return !alreadyExists;
}
