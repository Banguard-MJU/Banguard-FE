import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface SampleData {
  id: string;
  name: string;
  riskLevel: "low" | "medium" | "high";
  description: string;
}

const SAMPLE_CONTRACTS: SampleData[] = [
  {
    id: "safe",
    name: "안전한 계약 (신림동 원룸)",
    riskLevel: "low",
    description: "부담 비율 45%, 근저당 없음"
  },
  {
    id: "moderate",
    name: "주의 필요 계약 (봉천동 투룸)",
    riskLevel: "medium",
    description: "부담 비율 68%, 근저당 1.2억"
  },
  {
    id: "risky",
    name: "위험한 계약 (상도동 빌라)",
    riskLevel: "high",
    description: "부담 비율 92%, 근저당 2.5억 + 선순위 전세"
  }
];

interface SampleSelectorProps {
  onSelect: (sampleId: string) => void;
}

export function SampleSelector({ onSelect }: SampleSelectorProps) {
  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "medium": return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "high": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "border-green-200 bg-green-50";
      case "medium": return "border-yellow-200 bg-yellow-50";
      case "high": return "border-red-200 bg-red-50";
      default: return "";
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case "low": return "안전";
      case "medium": return "주의";
      case "high": return "위험";
      default: return "";
    }
  };

  return (
    <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="text-lg">💡 샘플 계약서로 체험하기</CardTitle>
        <CardDescription>
          다양한 위험도의 샘플 계약서를 선택하여 분석 기능을 체험해보세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {SAMPLE_CONTRACTS.map((sample) => (
            <div
              key={sample.id}
              className={`border-2 rounded-lg p-4 ${getRiskColor(sample.riskLevel)} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getRiskIcon(sample.riskLevel)}
                    <h3 className="font-semibold">{sample.name}</h3>
                    <Badge variant={
                      sample.riskLevel === "low" ? "secondary" :
                      sample.riskLevel === "medium" ? "default" :
                      "destructive"
                    }>
                      {getRiskLabel(sample.riskLevel)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{sample.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelect(sample.id)}
                >
                  분석하기
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
