import { useEffect, useRef, useState } from "react";
import { Upload, FileText, AlertTriangle, CheckCircle, XCircle, Info, MessageSquare, Landmark, ChevronRight, Camera } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { motion } from "motion/react";
import { BanggadiLoading } from "./BanggadiLoading";
import { RightsAnalysisVisual } from "./RightsAnalysisVisual";
import { useAuth } from "../contexts/AuthContext";
import { useAnalysisHistory } from "../contexts/AnalysisHistoryContext";
import { useNavigate } from "react-router";
import { type AnalysisResult } from "../data/contractAnalysis";
import { analyzeContractFile } from "../lib/analysis-api";
import { getDisplayErrorMessage } from "../lib/error-message";
import { generateId } from "../lib/uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";

function formatCurrency(value: number) {
  if (value >= 100000000) {
    const units = value / 100000000;
    return `${Number.isInteger(units) ? units : units.toFixed(1)}억원`;
  }

  if (value >= 10000) {
    return `${Math.round(value / 10000).toLocaleString("ko-KR")}만원`;
  }

  return `${value.toLocaleString("ko-KR")}원`;
}

export function ContractAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { user } = useAuth();
  const { addAnalysis } = useAnalysisHistory();
  const navigate = useNavigate();

  const stopMediaStream = (stream: MediaStream | null) => {
    stream?.getTracks().forEach((track) => track.stop());
  };

  useEffect(() => {
    return () => {
      stopMediaStream(cameraStream);
    };
  }, [cameraStream]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !cameraStream) {
      return;
    }

    video.srcObject = cameraStream;
    video.play().catch(() => {
      setCameraError("카메라 미리보기를 시작하지 못했습니다. 권한과 브라우저 설정을 확인해주세요.");
    });
  }, [cameraStream]);

  const isSupportedContractFile = (selectedFile: File) => {
    const fileType = selectedFile.type;
    const extension = selectedFile.name.split(".").pop()?.toLowerCase();
    const supportedExtensions = new Set(["pdf", "jpg", "jpeg", "png", "tif", "tiff", "heic", "heif"]);

    return fileType === "application/pdf" || fileType.startsWith("image/") || Boolean(extension && supportedExtensions.has(extension));
  };

  const handleSelectedFile = (selectedFile?: File) => {
    if (selectedFile) {
      if (isSupportedContractFile(selectedFile)) {
        setFile(selectedFile);
        setResult(null);
        toast.success("파일이 업로드되었습니다");
      } else {
        toast.error("PDF, JPG, PNG, TIFF, HEIC 파일만 업로드 가능합니다");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSelectedFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDraggingFile(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDraggingFile(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingFile(false);
    handleSelectedFile(event.dataTransfer.files[0]);
  };

  const closeCamera = () => {
    stopMediaStream(cameraStream);
    setCameraStream(null);
    setCameraError(null);
    setIsCameraOpen(false);
  };

  const openCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("현재 브라우저에서는 카메라 촬영을 지원하지 않습니다. 파일 선택으로 이미지를 업로드해주세요.");
      setIsCameraOpen(true);
      return;
    }

    setCameraError(null);
    setIsCameraOpen(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1600 },
          height: { ideal: 1200 }
        },
        audio: false
      });

      setCameraStream(stream);
    } catch {
      setCameraError("카메라 권한이 거부되었거나 사용할 수 없습니다. 브라우저 권한을 확인해주세요.");
    }
  };

  const captureCameraImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) {
      toast.error("카메라 화면을 아직 불러오지 못했습니다");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      toast.error("촬영 이미지를 생성하지 못했습니다");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error("촬영 이미지를 저장하지 못했습니다");
        return;
      }

      const capturedFile = new File([blob], `contract-camera-${Date.now()}.jpg`, {
        type: "image/jpeg"
      });
      handleSelectedFile(capturedFile);
      closeCamera();
    }, "image/jpeg", 0.92);
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
    let progressTimer: number | undefined;

    try {
      setProgress(25);
      progressTimer = window.setInterval(() => {
        setProgress((currentProgress) => Math.min(currentProgress + 7, 88));
      }, 450);
      const analysisResult = await analyzeContractFile(file);
      setProgress(100);
      setResult(analysisResult);
      addAnalysis({
        id: generateId(),
        fileName: file.name,
        date: new Date(),
        riskLevel: analysisResult.riskLevel,
        riskScore: analysisResult.riskScore,
        address: analysisResult.contractInfo.address,
        contractType: analysisResult.contractInfo.type,
      });
      toast.success("계약서 분석이 완료되었습니다");
    } catch (error) {
      toast.error(getDisplayErrorMessage(error, "계약서 분석에 실패했습니다"));
    } finally {
      if (progressTimer) {
        window.clearInterval(progressTimer);
      }
      setAnalyzing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-600 bg-green-50 border-green-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "critical": return "text-rose-700 bg-rose-50 border-rose-300";
      default: return "";
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case "low": return "낮은 위험";
      case "medium": return "중간 위험";
      case "high": return "높은 위험";
      case "critical": return "매우 높은 위험";
      default: return "";
    }
  };

  const getIssueIcon = (type: string) => {
    const iconClassName = "mt-0.5 h-5 w-5 flex-shrink-0";

    switch (type) {
      case "critical": return <XCircle className={`${iconClassName} text-red-500`} />;
      case "warning": return <AlertTriangle className={`${iconClassName} text-yellow-500`} />;
      case "info": return <Info className={`${iconClassName} text-blue-500`} />;
      default: return null;
    }
  };

  const getAnalysisProgressText = () => {
    if (progress < 25) return "OCR로 문서를 스캔하는 중...";
    if (progress < 50) return "텍스트를 추출하는 중...";
    if (progress < 75) return "AI가 내용을 분석하는 중...";
    return "분석 결과를 생성하는 중...";
  };

  const tabTriggerClassName = "h-auto min-h-9 whitespace-normal break-keep px-2 py-2 text-center leading-5";
  const resultTextClassName = "whitespace-normal leading-6 [line-break:loose] [overflow-wrap:anywhere] [word-break:keep-all]";
  const resultValueClassName = "min-w-0 font-semibold leading-6 [line-break:loose] [overflow-wrap:anywhere] [word-break:keep-all]";
  const resultActionButtonClassName = "min-h-10 h-auto flex-1 whitespace-normal px-3 py-2 text-center leading-5";
  const uploadActionButtonClassName = "h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 hover:text-white hover:shadow-xl hover:shadow-blue-500/30 sm:w-auto";

  return (
    <div className="min-h-dvh py-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30">
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
        {!analyzing && (
          <Card className="mb-8 border-0 shadow-2xl rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">계약서 업로드</CardTitle>
              <CardDescription className="text-base">
                PDF 파일이나 이미지 파일을 업로드하거나, 모바일에서 계약서를 직접 촬영해주세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`flex min-w-0 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all sm:p-12 ${
                  isDraggingFile
                    ? "border-blue-500 bg-blue-100/70 shadow-inner shadow-blue-200/70 dark:border-blue-400 dark:bg-blue-950/60 dark:shadow-none"
                    : "border-blue-200 bg-blue-50/30 hover:border-blue-400 hover:bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30 dark:hover:border-blue-600 dark:hover:bg-blue-950/40"
                }`}
                onDragEnter={handleDragOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <p className="mb-4 hidden text-center text-sm font-medium text-blue-700 dark:text-blue-300 sm:block">
                  파일을 이 영역에 끌어다 놓아도 업로드됩니다
                </p>
                <div className="flex w-full max-w-md flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button asChild size="lg" className={uploadActionButtonClassName}>
                      <span>
                        <FileText className="mr-2 h-5 w-5" />
                        파일 선택
                      </span>
                    </Button>
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.tif,.tiff,.heic,.heif,image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  <Button
                    type="button"
                    size="lg"
                    className={uploadActionButtonClassName}
                    onClick={openCamera}
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    카메라로 촬영
                  </Button>
                </div>
                {file && (
                  <div className="mt-6 flex max-w-full min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <FileText className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <span className="min-w-0 truncate font-medium">{file.name}</span>
                  </div>
                )}
              </div>

              {file && !result && (
                <div className="mt-6 text-center">
                  <Button onClick={analyzeContract} size="lg" className="w-full sm:w-auto rounded-xl h-12 px-8 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all">
                    <FileText className="w-5 h-5 mr-2" />
                    분석 시작하기
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {analyzing && (
          <div className="mb-8 min-w-0 overflow-hidden rounded-3xl border border-blue-100 bg-white/80 px-4 py-10 shadow-2xl shadow-blue-100/50 backdrop-blur-sm dark:border-blue-900/50 dark:bg-gray-900/70 dark:shadow-none sm:px-8">
            <BanggadiLoading progress={progress} text={getAnalysisProgressText()} />
          </div>
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
                  <div className="min-w-0">
                    <div className="text-sm text-gray-600 mb-1">위험도 평가</div>
                    <div className="text-2xl font-bold leading-tight sm:text-3xl">{getRiskLabel(result.riskLevel)}</div>
                  </div>
                  <div className="min-w-0 text-left sm:text-right">
                    <div className="text-sm text-gray-600 mb-1">위험 점수</div>
                    <div className="text-2xl font-bold leading-tight sm:text-3xl">{result.riskScore}/100</div>
                  </div>
                </div>
                <Progress value={result.riskScore} className="mt-4 h-3" />
              </CardContent>
            </Card>

            {/* Tabs for detailed results */}
            <Tabs defaultValue="visual" className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4">
                <TabsTrigger value="visual" className={tabTriggerClassName}>권리 분석</TabsTrigger>
                <TabsTrigger value="issues" className={tabTriggerClassName}>발견된 문제</TabsTrigger>
                <TabsTrigger value="info" className={tabTriggerClassName}>계약 정보</TabsTrigger>
                <TabsTrigger value="recommendations" className={tabTriggerClassName}>권장사항</TabsTrigger>
              </TabsList>

              <TabsContent value="visual">
                <RightsAnalysisVisual data={result.rightsData} />
              </TabsContent>

              <TabsContent value="issues" className="space-y-4">
                {result.issues.map((issue) => (
                  <div
                    key={`${issue.type}-${issue.title}-${issue.description}`}
                    role="alert"
                    className={`w-full rounded-lg border px-4 py-3 text-sm ${
                      issue.type === "critical" ? "border-red-200 bg-red-50" :
                      issue.type === "warning" ? "border-yellow-200 bg-yellow-50" :
                      "border-blue-200 bg-blue-50"
                    }`}
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      {getIssueIcon(issue.type)}
                      <div className="min-w-0 flex-1 text-left">
                        <h4 className={`mb-1 font-medium tracking-tight text-gray-900 dark:text-gray-100 ${resultTextClassName}`}>
                          {issue.title}
                        </h4>
                        <p className={`text-sm text-gray-700 dark:text-gray-300 ${resultTextClassName}`}>
                          {issue.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="info">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="min-w-0">
                          <div className="text-sm text-gray-600 mb-1">계약 유형</div>
                          <div className={resultValueClassName}>{result.contractInfo.type}</div>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm text-gray-600 mb-1">보증금</div>
                          <div className={resultValueClassName}>{result.contractInfo.deposit}</div>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm text-gray-600 mb-1">월세</div>
                          <div className={resultValueClassName}>{result.contractInfo.monthlyRent}</div>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm text-gray-600 mb-1">계약기간</div>
                          <div className={resultValueClassName}>{result.contractInfo.period}</div>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm text-gray-600 mb-1">주소</div>
                        <div className={resultValueClassName}>{result.contractInfo.address}</div>
                      </div>
                      {result.marketPriceInfo && (
                        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
                          <div className="mb-3 flex min-w-0 items-center gap-2">
                            <Landmark className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-300" />
                            <div className={`min-w-0 font-semibold text-gray-900 dark:text-gray-100 ${resultTextClassName}`}>
                              국토부 실거래가 기반 추정 시세
                            </div>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-3">
                            <div className="min-w-0">
                              <div className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">추정 매매가</div>
                              <div className={resultValueClassName}>
                                {result.marketPriceInfo.estimatedMarketPrice > 0
                                  ? formatCurrency(result.marketPriceInfo.estimatedMarketPrice)
                                  : "확인 불가"}
                              </div>
                            </div>
                            <div className="min-w-0">
                              <div className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">거래 표본</div>
                              <div className={resultValueClassName}>{result.marketPriceInfo.sampleCount.toLocaleString("ko-KR")}건</div>
                            </div>
                            <div className="min-w-0">
                              <div className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">조회 기간</div>
                              <div className={resultValueClassName}>{result.marketPriceInfo.period || "미확인"}</div>
                            </div>
                          </div>
                          <p className={`mt-3 text-sm text-gray-600 dark:text-gray-300 ${resultTextClassName}`}>
                            {result.marketPriceInfo.message}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {result.recommendations.map((rec) => (
                        <div key={rec} className="flex min-w-0 items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <p className={`min-w-0 text-gray-700 ${resultTextClassName}`}>
                            {rec}
                          </p>
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
                  <h3 className={`mb-2 text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl ${resultTextClassName}`}>
                    분석 결과와 함께 보증·체크리스트도 같이 확인해보세요
                  </h3>
                  <p className={`text-base leading-7 text-gray-600 dark:text-gray-400 ${resultTextClassName}`}>
                    위험 요소를 확인했다면 관련 보증 제도와 계약 체크리스트를 함께 보면 다음 행동을 정리하기 쉽습니다.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
                    <div className={`mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100 ${resultTextClassName}`}>보증 제도 확인</div>
                    <p className={`text-sm leading-6 text-gray-600 dark:text-gray-300 ${resultTextClassName}`}>
                      전세보증금 반환보증처럼 위험 완화에 도움이 되는 항목을 먼저 살펴볼 수 있어요.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/20">
                    <div className={`mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100 ${resultTextClassName}`}>계약 절차 가이드</div>
                    <p className={`text-sm leading-6 text-gray-600 dark:text-gray-300 ${resultTextClassName}`}>
                      전입신고, 확정일자, 특약 확인 순서를 다시 점검하며 놓친 부분을 줄일 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <Button variant="outline" className="h-auto min-h-10 w-full whitespace-normal rounded-xl px-4 py-2 leading-5 sm:w-auto" onClick={() => navigate("/policy?category=guarantee")}>
                    정책/공공정보 화면 열기
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(true)}
                className={resultActionButtonClassName}
              >
                분석 이력 확인
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setFile(null);
                  setResult(null);
                }}
                className={resultActionButtonClassName}
              >
                새로운 계약서 분석
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className={resultActionButtonClassName}
              >
                대시보드에서 이력 보기
              </Button>
              <Button 
                onClick={() => navigate("/chatbot", { state: { fromAnalysis: true } })}
                className={`${resultActionButtonClassName} gap-2`}
              >
                <MessageSquare className="w-4 h-4" />
                챗봇으로 질문하기
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <Dialog
        open={isCameraOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeCamera();
          }
        }}
      >
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>계약서 촬영</DialogTitle>
            <DialogDescription>
              계약서가 화면 안에 모두 들어오도록 맞춘 뒤 촬영해주세요. 카메라를 사용할 수 없으면 파일 선택으로 이미지를 업로드할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-blue-100 bg-gray-950">
              {cameraStream ? (
                <video
                  ref={videoRef}
                  className="aspect-[3/4] w-full bg-gray-950 object-contain sm:aspect-video"
                  muted
                  playsInline
                  autoPlay
                />
              ) : (
                <div className="flex aspect-[3/4] w-full items-center justify-center px-6 text-center text-sm text-gray-200 sm:aspect-video">
                  {cameraError ?? "카메라 권한을 요청하는 중입니다..."}
                </div>
              )}
            </div>

            {cameraError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                {cameraError}
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={closeCamera}>
              취소
            </Button>
            {cameraError && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  closeCamera();
                  fileInputRef.current?.click();
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                파일 선택으로 업로드
              </Button>
            )}
            <Button type="button" onClick={captureCameraImage} disabled={!cameraStream}>
              <Camera className="mr-2 h-4 w-4" />
              촬영해서 업로드
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Analysis Result Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>분석 이력 확인</DialogTitle>
            <DialogDescription>
              분석이 완료되면 현재 접속 세션의 대시보드 이력에 자동으로 추가됩니다. 서버 영구 저장은 아직 지원하지 않습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              닫기
            </Button>
            <Button
              type="button"
              onClick={() => {
                setIsDialogOpen(false);
                navigate("/dashboard");
              }}
            >
              대시보드에서 보기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
