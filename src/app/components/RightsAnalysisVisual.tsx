import { Info, AlertTriangle, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

interface RightsData {
  propertyValue: number; // 부동산 시세
  deposit: number; // 보증금
  mortgages: {
    amount: number;
    creditor: string;
    date: string;
  }[];
  previousDeposits: number; // 선순위 전세금
}

interface RightsAnalysisVisualProps {
  data: RightsData;
}

export function RightsAnalysisVisual({ data }: RightsAnalysisVisualProps) {
  // 시세 정보 없음 처리
  const hasPropertyValue = data.propertyValue > 0;

  // 계산
  const totalMortgage = data.mortgages.reduce((sum, m) => sum + m.amount, 0);
  const totalBurden = totalMortgage + data.previousDeposits + data.deposit;
  const burdenRatio = hasPropertyValue ? (totalBurden / data.propertyValue) * 100 : 0;
  const mortgageRatio = hasPropertyValue ? (totalMortgage / data.propertyValue) * 100 : 0;
  const depositRatio = hasPropertyValue ? (data.deposit / data.propertyValue) * 100 : 0;

  // 시세 정보 없을 때 안내 UI
  if (!hasPropertyValue) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
        <HelpCircle className="w-16 h-16 text-gray-400" />
        <div>
          <p className="text-lg font-semibold text-gray-600">부동산 시세 정보 없음</p>
          <p className="text-sm text-gray-500 mt-1">
            계약서에서 보증금 또는 시세 정보를 확인하지 못했습니다.<br />
            국토교통부 실거래가 공개시스템에서 시세를 직접 확인하세요.
          </p>
        </div>
      </div>
    );
  }

  // 신호등 색상 결정
  const getTrafficLight = (ratio: number): { color: string; label: string; icon: any } => {
    if (ratio < 60) {
      return { color: "green", label: "안전", icon: CheckCircle };
    } else if (ratio < 80) {
      return { color: "yellow", label: "주의", icon: AlertTriangle };
    } else {
      return { color: "red", label: "위험", icon: XCircle };
    }
  };

  const trafficLight = getTrafficLight(burdenRatio);
  const trafficLightTextColor =
    trafficLight.color === "green"
      ? "text-green-700"
      : trafficLight.color === "yellow"
        ? "text-yellow-700"
        : "text-red-700";

  // 파이 차트 데이터
  const pieData = [
    { name: "근저당", value: totalMortgage, color: "#ef4444" },
    { name: "선순위 전세", value: data.previousDeposits, color: "#f59e0b" },
    { name: "내 보증금", value: data.deposit, color: "#3b82f6" },
    { name: "여유자금", value: Math.max(0, data.propertyValue - totalBurden), color: "#10b981" }
  ];

  // 바 차트 데이터
  const barData = [
    {
      name: "부동산 시세",
      value: data.propertyValue,
      fill: "#94a3b8"
    },
    {
      name: "총 부담액",
      value: totalBurden,
      fill: burdenRatio >= 80 ? "#ef4444" : burdenRatio >= 60 ? "#f59e0b" : "#10b981"
    }
  ];

  const formatCurrency = (value: number) => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(1)}억`;
    } else if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}만`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* 신호등 종합 평가 */}
      <Card className={`border-4 ${
        trafficLight.color === "green" ? "border-green-500 bg-green-50" :
        trafficLight.color === "yellow" ? "border-yellow-500 bg-yellow-50" :
        "border-red-500 bg-red-50"
      }`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {/* 신호등 아이콘 */}
            <div className="relative">
              <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                  trafficLight.color === "green" ? "bg-green-500 animate-pulse" :
                  trafficLight.color === "yellow" ? "bg-yellow-500 animate-pulse" :
                  "bg-red-500 animate-pulse"
                }`}>
                  <trafficLight.icon className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>

            {/* 평가 정보 */}
            <div className="text-center">
              <div className={`text-6xl font-bold mb-2 ${trafficLightTextColor}`}>
                {burdenRatio.toFixed(1)}%
              </div>
              <div className="text-2xl font-semibold mb-2">
                {trafficLight.label} 등급
              </div>
              <div className="text-gray-700">
                부동산 시세 대비 총 부담 비율
              </div>
            </div>
          </div>

          {/* 권장사항 */}
          <div className={`mt-6 p-4 rounded-lg border-2 ${
            trafficLight.color === "green" ? "border-green-300 bg-white" :
            trafficLight.color === "yellow" ? "border-yellow-300 bg-white" :
            "border-red-300 bg-white"
          }`}>
            <div className="font-semibold mb-2">
              {trafficLight.color === "green" && "✅ 비교적 안전한 계약입니다"}
              {trafficLight.color === "yellow" && "⚠️ 주의가 필요한 계약입니다"}
              {trafficLight.color === "red" && "🚨 매우 위험한 계약입니다"}
            </div>
            <div className="text-sm text-gray-700">
              {trafficLight.color === "green" && "부동산 가치 대비 부담이 적절한 수준입니다. 전세보증보험 가입을 권장합니다."}
              {trafficLight.color === "yellow" && "부동산 가치 대비 부담이 다소 높습니다. 반드시 전세보증보험에 가입하고, 임대인의 재정상태를 확인하세요."}
              {trafficLight.color === "red" && "부동산 가치 대비 부담이 매우 높아 위험합니다. 계약을 재고하거나, 보증금을 낮추는 것을 강력히 권장합니다."}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 상세 비율 분석 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 파이 차트 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              권리 구성 비율
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">부동산 시세를 기준으로 각 권리가 차지하는 비중을 나타냅니다</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>부동산 가치 대비 권리 분포</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`pie-cell-${entry.name}-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {pieData.map((item, index) => (
                <div key={`legend-${item.name}-${index}`} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 바 차트 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              시세 vs 부담액
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">부동산 시세와 총 부담액을 비교합니다. 부담액이 시세에 가까울수록 위험합니다</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>금액 비교 분석</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                <YAxis dataKey="name" type="category" width={100} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="#8884d8">
                  {barData.map((entry, index) => (
                    <Cell key={`bar-cell-${entry.name}-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm">
                <div className="font-semibold text-blue-900 mb-1">💡 이해하기</div>
                <div className="text-blue-700">
                  여유자금이 많을수록 안전합니다. 총 부담액이 시세의 80%를 넘으면 위험합니다.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 세부 항목 게이지 */}
      <Card>
        <CardHeader>
          <CardTitle>세부 권리 분석</CardTitle>
          <CardDescription>각 항목별 부동산 시세 대비 비율</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 근저당권 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">근저당권</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">집주인이 은행 등에서 대출받으면서 집을 담보로 잡힌 금액입니다</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Badge variant={mortgageRatio >= 60 ? "destructive" : mortgageRatio >= 40 ? "default" : "secondary"}>
                  {mortgageRatio.toFixed(1)}%
                </Badge>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(totalMortgage)}</span>
            </div>
            <Progress 
              value={mortgageRatio} 
              className="h-4"
              indicatorClassName={
                mortgageRatio >= 60 ? "bg-red-500" :
                mortgageRatio >= 40 ? "bg-yellow-500" :
                "bg-green-500"
              }
            />
            {data.mortgages.length > 0 && (
              <div className="mt-2 space-y-1">
                {data.mortgages.map((mortgage, index) => (
                  <div key={`mortgage-${mortgage.creditor}-${mortgage.date}-${index}`} className="text-xs text-gray-600 flex justify-between">
                    <span>{mortgage.creditor}</span>
                    <span>{formatCurrency(mortgage.amount)} ({mortgage.date})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 선순위 전세금 */}
          {data.previousDeposits > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">선순위 전세금</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">나보다 먼저 계약한 세입자의 보증금으로, 경매 시 우선적으로 배당받습니다</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Badge variant="default">
                    {((data.previousDeposits / data.propertyValue) * 100).toFixed(1)}%
                  </Badge>
                </div>
                <span className="text-sm font-semibold">{formatCurrency(data.previousDeposits)}</span>
              </div>
              <Progress 
                value={(data.previousDeposits / data.propertyValue) * 100} 
                className="h-4"
                indicatorClassName="bg-orange-500"
              />
            </div>
          )}

          {/* 내 보증금 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">내 보증금</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">이번에 계약하려는 전세 보증금입니다</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Badge variant="outline">
                  {depositRatio.toFixed(1)}%
                </Badge>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(data.deposit)}</span>
            </div>
            <Progress 
              value={depositRatio} 
              className="h-4"
              indicatorClassName="bg-blue-500"
            />
          </div>

          {/* 총 부담 비율 */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-lg">총 부담 비율</span>
              <span className="text-lg font-bold">{formatCurrency(totalBurden)}</span>
            </div>
            <Progress 
              value={burdenRatio} 
              className="h-6"
              indicatorClassName={
                burdenRatio >= 80 ? "bg-red-500" :
                burdenRatio >= 60 ? "bg-yellow-500" :
                "bg-green-500"
              }
            />
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>안전 (0-60%)</span>
              <span>주의 (60-80%)</span>
              <span>위험 (80%+)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 안전 가이드 */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-3 text-blue-900">💡 초보자를 위한 안전 가이드</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <span className="font-semibold">60% 미만 (안전)</span>: 비교적 안전한 수준입니다. 전세보증보험 가입을 권장합니다.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    !
                  </div>
                  <div>
                    <span className="font-semibold">60-80% (주의)</span>: 신중한 검토가 필요합니다. 전세보증보험 필수, 임대인 재정상태 확인 필수입니다.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    ✕
                  </div>
                  <div>
                    <span className="font-semibold">80% 이상 (위험)</span>: 계약을 재고하세요. 경매 시 보증금을 돌려받지 못할 위험이 매우 높습니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
