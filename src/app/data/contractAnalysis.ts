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
  marketPriceInfo?: {
    estimatedMarketPrice: number;
    sampleCount: number;
    period?: string;
    status: string;
    message: string;
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
