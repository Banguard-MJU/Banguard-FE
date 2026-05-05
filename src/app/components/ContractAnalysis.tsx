import { useState } from "react";
import { Upload, FileText, AlertTriangle, CheckCircle, XCircle, Info, Loader2, MessageSquare, Landmark, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { motion } from "motion/react";
import { RightsAnalysisVisual } from "./RightsAnalysisVisual";
import { SampleSelector } from "./SampleSelector";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import {
  type AnalysisResult,
  getSampleAnalysisResult,
} from "../data/contractAnalysis";
import { analyzeContractFile } from "../lib/analysis-api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";

export function ContractAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSampleSelect = async (sampleId: string) => {
    setAnalyzing(true);
    setProgress(0);
    setFile(null);

    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 400));
    setProgress(33);
    await new Promise(resolve => setTimeout(resolve, 400));
    setProgress(66);
    await new Promise(resolve => setTimeout(resolve, 400));
    setProgress(100);

    const sampleResult = getSampleAnalysisResult(sampleId);
    setResult(sampleResult);
    setAnalyzing(false);
    toast.success("샘플 계약서 분석이 완료되었습니다");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (
        fileType === "application/pdf" ||
        fileType.startsWith("image/")
      ) {
        setFile(selectedFile);
        setResult(null);
        toast.success("파일이 업로드되었습니다");
      } else {
        toast.error("PDF 또는 이미지 파일만 업로드 가능합니다");
      }
    }
  };

  const analyzeContract = async () => {
    if (!file) return;

    if (!user) {
      toast.error("계약서 분석은 로그인 후 사용할 수 있습니다");
      navigate("/login");
      return;
    }

    setAnalyzing(true);
    setProgress(0);

    try {
      setProgress(25);
      const analysisResult = await analyzeContractFile(file);
      setProgress(100);
      setResult(analysisResult);
      toast.success("계약서 분석이 완료되었습니다");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "계약서 분석에 실패했습니다");
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-600 bg-green-50 border-green-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "high": return "text-red-600 bg-red-50 border-red-200";
      default: return "";
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case "low": return "낮은 위험";
      case "medium": return "중간 위험";
      case "high": return "높은 위험";
      default: return "";
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "critical": return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "info": return <Info className="w-5 h-5 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30">
      <div className="app-shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full mb-4 backdrop-blur-sm">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">AI 계약서 분석</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            계약서 안전 분석
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            AI가 계약서를 분석하여 잠재적 위험을 찾아드립니다
          </p>
        </motion.div>

        {/* Upload Section */}
        <Card className="mb-8 border-0 shadow-2xl rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">계약서 업로드</CardTitle>
            <CardDescription className="text-base">
              PDF 파일 또는 이미지 파일(JPG, PNG)을 업로드해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/30 rounded-2xl p-12 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button asChild size="lg" className="rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all">
                  <span>파일 선택</span>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              {file && (
                <div className="mt-6 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">{file.name}</span>
                </div>
              )}
            </div>

            {file && !analyzing && !result && (
              <div className="mt-6 text-center">
                <Button onClick={analyzeContract} size="lg" className="w-full sm:w-auto rounded-xl h-12 px-8 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all">
                  <FileText className="w-5 h-5 mr-2" />
                  분석 시작하기
                </Button>
              </div>
            )}

            {analyzing && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-center gap-3 text-blue-600">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-lg font-medium">계약서를 분석하는 중입니다...</span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="text-center text-sm text-gray-600 font-medium">
                  {progress < 25 && "OCR로 문서를 스캔하는 중..."}
                  {progress >= 25 && progress < 50 && "텍스트를 추출하는 중..."}
                  {progress >= 50 && progress < 75 && "AI가 내용을 분석하는 중..."}
                  {progress >= 75 && "분석 결과를 생성하는 중..."}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sample Selector */}
        {!file && !analyzing && !result && (
          <SampleSelector onSelect={handleSampleSelect} />
        )}

        {/* Analysis Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Risk Score */}
            <Card className={`border-2 ${getRiskColor(result.riskLevel)}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">위험도 평가</div>
                    <div className="text-3xl font-bold">{getRiskLabel(result.riskLevel)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">위험 점수</div>
                    <div className="text-3xl font-bold">{result.riskScore}/100</div>
                  </div>
                </div>
                <Progress value={result.riskScore} className="mt-4 h-3" />
              </CardContent>
            </Card>

            {/* Tabs for detailed results */}
            <Tabs defaultValue="visual" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="visual">권리 분석</TabsTrigger>
                <TabsTrigger value="issues">발견된 문제</TabsTrigger>
                <TabsTrigger value="info">계약 정보</TabsTrigger>
                <TabsTrigger value="recommendations">권장사항</TabsTrigger>
              </TabsList>

              <TabsContent value="visual">
                <RightsAnalysisVisual data={result.rightsData} />
              </TabsContent>

              <TabsContent value="issues" className="space-y-4">
                {result.issues.map((issue, index) => (
                  <Alert key={index} className={
                    issue.type === "critical" ? "border-red-200 bg-red-50" :
                    issue.type === "warning" ? "border-yellow-200 bg-yellow-50" :
                    "border-blue-200 bg-blue-50"
                  }>
                    <div className="flex gap-3">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <AlertTitle className="mb-1">{issue.title}</AlertTitle>
                        <AlertDescription>{issue.description}</AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))}
              </TabsContent>

              <TabsContent value="info">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">계약 유형</div>
                          <div className="font-semibold">{result.contractInfo.type}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">보증금</div>
                          <div className="font-semibold">{result.contractInfo.deposit}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">월세</div>
                          <div className="font-semibold">{result.contractInfo.monthlyRent}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">계약기간</div>
                          <div className="font-semibold">{result.contractInfo.period}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">주소</div>
                        <div className="font-semibold">{result.contractInfo.address}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {result.recommendations.map((rec, index) => (
                        <div key={index} className="flex gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="rounded-3xl border-0 bg-white/85 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
              <CardContent className="grid gap-6 px-6 py-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-4 py-2 text-sm font-medium text-blue-700 dark:border-indigo-900/60 dark:bg-indigo-950/30 dark:text-blue-300">
                    <Landmark className="w-4 h-4" />
                    관련 정책 · 공공정보
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                    분석 결과와 함께 보증·체크리스트도 같이 확인해보세요
                  </h3>
                  <p className="text-base leading-7 text-gray-600 dark:text-gray-400">
                    위험 요소를 확인했다면 관련 보증 제도와 계약 체크리스트를 함께 보면 다음 행동을 정리하기 쉽습니다.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
                    <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">보증 제도 확인</div>
                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                      전세보증금 반환보증처럼 위험 완화에 도움이 되는 항목을 먼저 살펴볼 수 있어요.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/20">
                    <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">계약 절차 가이드</div>
                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                      전입신고, 확정일자, 특약 확인 순서를 다시 점검하며 놓친 부분을 줄일 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <Button variant="outline" className="gap-2 rounded-xl" onClick={() => navigate("/policy?category=guarantee")}>
                    정책/공공정보 화면 열기
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(true)}
                className="flex-1"
              >
                분석 결과 저장
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setFile(null);
                  setResult(null);
                }}
                className="flex-1"
              >
                새로운 계약서 분석
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="flex-1"
              >
                대시보드에서 이력 보기
              </Button>
              <Button 
                onClick={() => navigate("/chatbot", { state: { fromAnalysis: true } })}
                className="flex-1 gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                챗봇으로 질문하기
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Save Analysis Result Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>분석 결과 저장</DialogTitle>
            <DialogDescription>
              분석 결과를 저장하시겠습니까? 저장된 결과는 나중에 확인할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (!user) {
                  toast.error("로그인 후 저장할 수 있습니다");
                  navigate("/login");
                } else {
                  // Save analysis result to server
                  // This is a placeholder for actual save logic
                  toast.success("분석 결과가 저장되었습니다");
                }
                setIsDialogOpen(false);
              }}
            >
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
