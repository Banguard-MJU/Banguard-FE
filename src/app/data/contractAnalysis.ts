export interface AnalysisResult {
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  issues: {
    type: "critical" | "warning" | "info";
    title: string;
    description: string;
  }[];
  contractInfo: {
    type: string;
    deposit: string;
    monthlyRent: string;
    period: string;
    address: string;
  };
  recommendations: string[];
  rightsData: {
    propertyValue: number;
    deposit: number;
    mortgages: {
      amount: number;
      creditor: string;
      date: string;
    }[];
    previousDeposits: number;
  };
}

const SAMPLE_RESULTS: Record<string, AnalysisResult> = {
  safe: {
    riskLevel: "low",
    riskScore: 32,
    contractInfo: {
      type: "월세계약",
      deposit: "5천만원",
      monthlyRent: "50만원",
      period: "2024.03.01 ~ 2026.02.28",
      address: "서울시 관악구 신림동 456-78"
    },
    issues: [
      {
        type: "info",
        title: "안전한 계약 구조",
        description: "부동산 시세 대비 부담 비율이 45%로 안전한 수준입니다."
      },
      {
        type: "info",
        title: "근저당권 없음",
        description: "해당 부동산에 근저당권이 설정되어 있지 않습니다."
      }
    ],
    recommendations: [
      "전입신고와 확정일자를 반드시 받으세요",
      "월세 자동이체를 설정하여 납부 증빙을 남기세요",
      "계약서 특약사항에 수리 책임 범위를 명확히 하세요"
    ],
    rightsData: {
      propertyValue: 120000000,
      deposit: 50000000,
      mortgages: [],
      previousDeposits: 4000000
    }
  },
  moderate: {
    riskLevel: "medium",
    riskScore: 68,
    contractInfo: {
      type: "전세계약",
      deposit: "1억 5천만원",
      monthlyRent: "없음",
      period: "2024.04.01 ~ 2026.03.31",
      address: "서울시 동작구 봉천동 123-45"
    },
    issues: [
      {
        type: "critical",
        title: "근저당권 설정 확인 필요",
        description: "해당 부동산에 1억 2천만원의 근저당권이 설정되어 있습니다."
      },
      {
        type: "warning",
        title: "부담 비율 주의",
        description: "부동산 시세 대비 총 부담이 68%로 주의가 필요한 수준입니다."
      },
      {
        type: "warning",
        title: "특약사항 누락",
        description: "계약서에 중개보수, 하자보수 책임 등에 대한 특약사항이 명시되지 않았습니다."
      }
    ],
    recommendations: [
      "전세보증보험에 반드시 가입하세요",
      "등기부등본을 계약 직전에 재확인하세요",
      "임대인의 세금 체납 여부를 확인하세요",
      "추가 근저당권 설정 금지 특약을 삽입하세요"
    ],
    rightsData: {
      propertyValue: 220000000,
      deposit: 150000000,
      mortgages: [
        {
          amount: 120000000,
          creditor: "국민은행",
          date: "2022-05-15"
        }
      ],
      previousDeposits: 0
    }
  },
  risky: {
    riskLevel: "high",
    riskScore: 92,
    contractInfo: {
      type: "전세계약",
      deposit: "2억원",
      monthlyRent: "없음",
      period: "2024.05.01 ~ 2026.04.30",
      address: "서울시 동작구 상도동 789-12"
    },
    issues: [
      {
        type: "critical",
        title: "매우 높은 부담 비율",
        description: "부동산 시세 대비 총 부담이 92%로 매우 위험한 수준입니다. 경매 시 보증금 회수가 어려울 수 있습니다."
      },
      {
        type: "critical",
        title: "고액 근저당권",
        description: "2억 5천만원의 근저당권이 설정되어 있어 전세금을 초과합니다."
      },
      {
        type: "critical",
        title: "선순위 전세금 존재",
        description: "나보다 먼저 계약한 세입자의 보증금 5천만원이 있어 배당 순위에서 밀립니다."
      },
      {
        type: "warning",
        title: "임대인 재정 상태 불투명",
        description: "근저당 설정액이 과도하여 임대인의 재정 상태가 좋지 않을 가능성이 있습니다."
      }
    ],
    recommendations: [
      "⚠️ 이 계약은 매우 위험합니다. 계약을 재고하세요",
      "보증금을 대폭 낮추거나 다른 매물을 알아보세요",
      "만약 계약을 진행한다면 전세보증보험 가입이 필수입니다",
      "법무사를 통해 등기부등본을 정밀 분석하세요",
      "임대인의 세금 체납, 대출 상환 능력을 반드시 확인하세요"
    ],
    rightsData: {
      propertyValue: 350000000,
      deposit: 200000000,
      mortgages: [
        {
          amount: 180000000,
          creditor: "신한은행",
          date: "2021-03-20"
        },
        {
          amount: 70000000,
          creditor: "우리은행",
          date: "2023-08-10"
        }
      ],
      previousDeposits: 50000000
    }
  }
};

export const uploadedFileMockResult: AnalysisResult = {
  riskLevel: "medium",
  riskScore: 68,
  contractInfo: {
    type: "전세계약",
    deposit: "1억 5천만원",
    monthlyRent: "없음",
    period: "2024.04.01 ~ 2026.03.31",
    address: "서울시 관악구 신림동 123-45"
  },
  issues: [
    {
      type: "critical",
      title: "근저당권 설정 확인 필요",
      description: "해당 부동산에 1억 2천만원의 근저당권이 설정되어 있습니다. 전세 보증금보다 낮지만 추가 근저당권 설정 여부를 확인해야 합니다."
    },
    {
      type: "warning",
      title: "특약사항 누락",
      description: "계약서에 중개보수, 하자보수 책임 등에 대한 특약사항이 명시되지 않았습니다."
    },
    {
      type: "warning",
      title: "확정일자 미기재",
      description: "전세권 확정일자 날인에 대한 조항이 계약서에 포함되어 있지 않습니다."
    },
    {
      type: "info",
      title: "계약금 비율 확인",
      description: "계약금이 전체 보증금의 10%로 적정한 수준입니다."
    }
  ],
  recommendations: [
    "등기부등본을 최신으로 재발급받아 근저당권 및 가압류 여부를 재확인하세요",
    "확정일자를 받기 전에 주민센터에서 전입신고를 완료하세요",
    "임대인의 체납세금 여부를 국세청 홈택스에서 확인하세요",
    "전세보증보험 가입을 적극 검토하세요",
    "특약사항에 중개보수 부담 주체를 명확히 기재하세요"
  ],
  rightsData: {
    propertyValue: 150000000,
    deposit: 15000000,
    mortgages: [
      {
        amount: 12000000,
        creditor: "국민은행",
        date: "2023-01-01"
      }
    ],
    previousDeposits: 0
  }
};

export function getSampleAnalysisResult(sampleId: string): AnalysisResult {
  return SAMPLE_RESULTS[sampleId];
}
