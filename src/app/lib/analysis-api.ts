import { apiRequest } from "./api";
import type { AnalysisResult } from "../data/contractAnalysis";

type BackendRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface ContractAnalysisResponse {
  ocr: {
    raw_text: string;
    confidence?: number | null;
  };
  parsed: {
    property_info: {
      address?: string | null;
      area_m2?: number | null;
      building_type?: string | null;
      floor?: string | null;
    };
    conditions: {
      deposit_amount?: number | null;
      monthly_rent?: number | null;
      contract_start?: string | null;
      contract_end?: string | null;
      special_terms: string[];
    };
    mortgages?: Array<{
      amount?: number | null;
      creditor?: string | null;
      date?: string | null;
    }> | null;
  };
  fraud_analysis: {
    overall_risk: BackendRiskLevel;
    risk_score: number;
    risk_items: Array<{
      category: string;
      description: string;
      level: BackendRiskLevel;
      recommendation: string;
    }>;
    safe_items: string[];
    checklist: string[];
    summary: string;
    registry_info?: {
      senior_rights?: Array<{
        right_type: string;
        holder?: string | null;
        amount?: number | null;
        description?: string | null;
      }> | null;
    } | null;
    market_price?: {
      address: string;
      estimated_market_price?: number | null;
      sample_count: number;
      period?: string | null;
      status: string;
      message: string;
    } | null;
    deposit_ratio?: number | null;
  };
}

function formatWon(value?: number | null) {
  if (value === null || value === undefined) {
    return "미확인";
  }

  if (value >= 100000000) {
    const units = value / 100000000;
    return `${Number.isInteger(units) ? units : units.toFixed(1)}억원`;
  }

  if (value >= 10000) {
    return `${Math.round(value / 10000).toLocaleString("ko-KR")}만원`;
  }

  return `${value.toLocaleString("ko-KR")}원`;
}

function mapRiskLevel(level: BackendRiskLevel): AnalysisResult["riskLevel"] {
  if (level === "LOW") return "low";
  if (level === "MEDIUM") return "medium";
  return "high";
}

function mapIssueType(level: BackendRiskLevel): AnalysisResult["issues"][number]["type"] {
  if (level === "LOW") return "info";
  if (level === "MEDIUM") return "warning";
  return "critical";
}

export function mapContractAnalysisResponse(response: ContractAnalysisResponse): AnalysisResult {
  const conditions = response.parsed.conditions;
  const property = response.parsed.property_info;
  const deposit = conditions.deposit_amount ?? 0;
  const marketPrice = response.fraud_analysis.market_price;
  const estimatedMarketPrice = marketPrice?.estimated_market_price ?? 0;
  const mortgages = (() => {
    const fromRegistry = (response.fraud_analysis.registry_info?.senior_rights ?? [])
      .filter((right) => right.right_type === "근저당권" && typeof right.amount === "number" && right.amount > 0)
      .map((right) => ({
        amount: right.amount ?? 0,
        creditor: right.holder ?? "미확인",
        date: "",
      }));

    if (fromRegistry.length > 0) {
      return fromRegistry;
    }

    return (response.parsed.mortgages ?? [])
      .filter((mortgage) => typeof mortgage.amount === "number" && mortgage.amount > 0)
      .map((mortgage) => ({
        amount: mortgage.amount ?? 0,
        creditor: mortgage.creditor ?? "미확인",
        date: mortgage.date ?? "",
      }));
  })();

  return {
    riskLevel: mapRiskLevel(response.fraud_analysis.overall_risk),
    riskScore: response.fraud_analysis.risk_score,
    issues: response.fraud_analysis.risk_items.map((item) => ({
      type: mapIssueType(item.level),
      title: item.category,
      description: `${item.description}${item.recommendation ? ` ${item.recommendation}` : ""}`.trim(),
    })),
    contractInfo: {
      type: conditions.monthly_rent && conditions.monthly_rent > 0 ? "월세계약" : "전세계약",
      deposit: formatWon(conditions.deposit_amount),
      monthlyRent: conditions.monthly_rent ? formatWon(conditions.monthly_rent) : "없음",
      period:
        conditions.contract_start || conditions.contract_end
          ? `${conditions.contract_start ?? "시작일 미확인"} ~ ${conditions.contract_end ?? "종료일 미확인"}`
          : "미확인",
      address: property.address || "주소 미확인",
    },
    marketPriceInfo: marketPrice
      ? {
          estimatedMarketPrice,
          sampleCount: marketPrice.sample_count,
          period: marketPrice.period ?? undefined,
          status: marketPrice.status,
          message: marketPrice.message,
        }
      : undefined,
    recommendations: [
      ...response.fraud_analysis.checklist,
      ...response.fraud_analysis.safe_items.map((item) => `확인됨: ${item}`),
    ],
    rightsData: {
      propertyValue: estimatedMarketPrice,
      deposit,
      mortgages,
      previousDeposits: 0,
    },
  };
}

export async function analyzeContractFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiRequest<ContractAnalysisResponse>("/analysis/contract", {
    method: "POST",
    auth: true,
    body: formData,
  });

  return mapContractAnalysisResponse(response);
}

export async function analyzeContractText(text: string) {
  const response = await apiRequest<ContractAnalysisResponse>("/analysis/contract/text", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ text }),
  });

  return mapContractAnalysisResponse(response);
}
