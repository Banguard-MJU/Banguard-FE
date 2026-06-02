export interface ChatEvidenceItem {
  id: string;
  title: string;
  summary: string;
  type: "guide" | "policy" | "registry" | "insurance";
  page?: number;
  url?: string;
  excerpt?: string;
  content?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  evidence?: ChatEvidenceItem[];
  feedback?: "like" | "dislike";
}

export interface ChatConversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isPinned?: boolean;
  messages: ChatMessage[];
}

export const SUGGESTED_QUESTIONS = [
  "전세 계약할 때 꼭 확인해야 할 사항은?",
  "근저당권이 설정된 집, 계약해도 되나요?",
  "확정일자는 언제 받아야 하나요?",
  "전세보증보험 가입 조건이 궁금해요"
];

const KNOWLEDGE_BASE: Record<string, string> = {
  "전세": "전세 계약 시에는 다음 사항들을 반드시 확인해야 합니다:\n\n1. **등기부등본 확인**: 소유권, 근저당권, 가압류 등을 확인하세요\n2. **확정일자 받기**: 전입신고 후 주민센터에서 확정일자를 받으세요\n3. **임대인 신분 확인**: 등기부등본의 소유자와 임대인이 동일한지 확인\n4. **집의 하자 확인**: 계약 전 집의 상태를 꼼꼼히 체크하세요\n5. **전세보증보험 가입**: 가능한 경우 반드시 가입을 권장합니다",
  "근저당": "근저당권이 설정된 부동산의 경우 신중한 판단이 필요합니다:\n\n**위험 평가 방법:**\n- 근저당권 설정액이 전세 보증금보다 많은 경우 → 매우 위험\n- 부동산 시세 대비 (근저당권 + 전세금) 비율이 70% 이상 → 위험\n\n**안전 조치:**\n1. 임대인의 대출 상환 능력 확인\n2. 전세보증보험 가입 필수\n3. 추가 근저당권 설정 금지 특약 삽입\n4. 등기부등본을 계약 직전에 재확인",
  "확정일자": "확정일자는 전세권을 보호하는 중요한 절차입니다:\n\n**받는 시기:**\n- 전입신고 완료 후 즉시 받으세요\n- 계약 당일 이사하는 경우, 당일 전입신고 + 확정일자 처리\n\n**받는 장소:**\n- 주민센터(동사무소)\n- 등기소\n\n**효력:**\n- 확정일자를 받은 시점부터 대항력 발생\n- 경매 시 배당 우선순위 확보\n\n**주의사항:**\n- 전입신고만으로는 불충분, 반드시 확정일자까지 받아야 함",
  "보증보험": "전세보증보험은 전세 사기를 예방하는 최고의 안전장치입니다:\n\n**가입 조건:**\n- 주택 가격 대비 전세금 비율이 일정 수준 이하\n- 근저당권 등 권리관계가 과도하지 않을 것\n- 임대인의 세금 체납이 없을 것\n\n**보장 내용:**\n- 계약 종료 후 보증금 미반환 시 보험사가 대신 지급\n- 최대 3억원까지 보장 (상품에 따라 다름)\n\n**가입 방법:**\n- HUG(주택도시보증공사), SGI(서울보증보험) 등\n- 온라인 또는 지점 방문 신청",
  "등기부등본": "등기부등본은 부동산의 권리관계를 확인하는 핵심 서류입니다:\n\n**확인 방법:**\n1. 인터넷등기소(www.iros.go.kr) 접속\n2. 주소 또는 고유번호로 검색\n3. 수수료 700원 결제 후 열람/발급\n\n**확인 사항:**\n\n**[갑구]**\n- 소유권: 현재 소유자가 누구인지\n- 가압류/가처분: 법적 분쟁 여부\n\n**[을구]**\n- 근저당권: 대출 설정 내역\n- 전세권: 기존 전세 계약 내역\n\n**주의:**\n- 계약 직전(당일 또는 1~2일 전)에 최신 등본 재확인 필수"
};

const EVIDENCE_BASE: Record<string, ChatEvidenceItem[]> = {
  "전세": [
    {
      id: "guide-jeonse-checklist",
      title: "전세 계약 전 핵심 확인 항목",
      summary: "등기부등본, 임대인 신분, 보증보험 가능 여부를 계약 직전 다시 점검하는 흐름입니다.",
      type: "guide",
    },
    {
      id: "policy-jeonse-guarantee",
      title: "전세보증금 반환보증 안내",
      summary: "보증금 미반환 위험에 대비해 가입 가능 조건과 준비 서류를 확인할 수 있는 항목입니다.",
      type: "insurance",
    },
  ],
  "근저당": [
    {
      id: "registry-mortgage-review",
      title: "근저당 설정 여부 확인 기준",
      summary: "등기부등본 을구에서 채권최고액과 추가 권리 설정 여부를 확인하는 기준입니다.",
      type: "registry",
    },
    {
      id: "guide-special-clause",
      title: "추가 근저당 방지 특약 체크",
      summary: "계약 이후 추가 담보 설정을 제한하는 특약을 검토할 때 참고할 수 있는 체크포인트입니다.",
      type: "guide",
    },
  ],
  "확정일자": [
    {
      id: "policy-confirmed-date",
      title: "확정일자와 전입신고 절차",
      summary: "대항력과 우선변제권 확보를 위해 전입신고와 확정일자를 어떤 순서로 챙겨야 하는지 요약합니다.",
      type: "policy",
    },
  ],
  "보증보험": [
    {
      id: "insurance-hug-overview",
      title: "전세보증보험 가입 준비",
      summary: "주택 가격 대비 보증금 비율, 권리관계, 임대인 체납 여부 등 가입 전 확인 요소를 정리한 항목입니다.",
      type: "insurance",
    },
    {
      id: "policy-youth-housing-support",
      title: "청년 주거 지원 제도 함께 보기",
      summary: "보증보험과 함께 살펴볼 수 있는 청년 대상 주거 금융·보증 지원 정보를 연결하기 위한 슬롯입니다.",
      type: "policy",
    },
  ],
  "등기부등본": [
    {
      id: "registry-certified-copy",
      title: "등기부등본 열람 포인트",
      summary: "갑구와 을구에서 소유권, 가압류, 근저당권을 어떤 순서로 읽어야 하는지 정리한 항목입니다.",
      type: "registry",
    },
  ],
};

const FALLBACK_EVIDENCE: ChatEvidenceItem[] = [
  {
    id: "guide-general-check",
    title: "계약 전 공식 서류 재확인",
    summary: "상담 내용은 참고용이므로 계약 직전에는 최신 등기부등본과 계약 조건을 다시 확인하는 것이 좋습니다.",
    type: "guide",
  },
];

function cloneEvidence(items: ChatEvidenceItem[]) {
  return items.map((item) => ({ ...item }));
}

export function getChatbotEvidence(userMessage: string): ChatEvidenceItem[] | undefined {
  const lowerMessage = userMessage.toLowerCase();

  for (const [keyword, evidence] of Object.entries(EVIDENCE_BASE)) {
    if (lowerMessage.includes(keyword)) {
      return cloneEvidence(evidence);
    }
  }

  return cloneEvidence(FALLBACK_EVIDENCE);
}

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: "1",
    title: "전세 계약 체크리스트",
    lastMessage: "전세 계약할 때 꼭 확인해야 할 사항은?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isPinned: true,
    messages: [
      {
        id: "1-1",
        role: "user",
        content: "전세 계약할 때 꼭 확인해야 할 사항은?",
        timestamp: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: "1-2",
        role: "assistant",
        content: KNOWLEDGE_BASE["전세"],
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        evidence: getChatbotEvidence("전세 계약할 때 꼭 확인해야 할 사항은?")
      }
    ]
  },
  {
    id: "2",
    title: "근저당권 설정 문의",
    lastMessage: "근저당권이 설정된 집, 계약해도 되나요?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    messages: [
      {
        id: "2-1",
        role: "user",
        content: "근저당권이 설정된 집, 계약해도 되나요?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
      },
      {
        id: "2-2",
        role: "assistant",
        content: KNOWLEDGE_BASE["근저당"],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        evidence: getChatbotEvidence("근저당권이 설정된 집, 계약해도 되나요?")
      }
    ]
  }
];

export function generateChatbotResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  for (const [keyword, response] of Object.entries(KNOWLEDGE_BASE)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }

  return `질문해 주셔서 감사합니다!\n\n'${userMessage}'에 대한 구체적인 답변을 드리기 위해 더 자세한 정보가 필요합니다.\n\n다음과 같은 주제로 질문해 주시면 도움을 드릴 수 있습니다:\n\n• 전세 계약 시 주의사항\n• 근저당권 관련 문의\n• 확정일자 받는 방법\n• 전세보증보험 가입\n• 등기부등본 확인 방법\n\n또는 좀 더 구체적으로 질문해 주시면 더 정확한 답변을 드릴 수 있습니다.`;
}
