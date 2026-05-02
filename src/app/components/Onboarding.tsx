import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { 
  Shield, 
  FileText, 
  MessageSquare, 
  ArrowRight,
  ChevronLeft
} from "lucide-react";
import { Button } from "./ui/button";

const ONBOARDING_SESSION_KEY = "banguard_onboarding_seen_session";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export function Onboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);

  const redirectTarget =
    typeof (location.state as { from?: unknown } | null)?.from === "string" &&
    (location.state as { from?: string }).from !== "/onboarding" &&
    (location.state as { from?: string }).from !== "/"
      ? (location.state as { from?: string }).from
      : null;

  const markOnboardingSeen = () => {
    sessionStorage.setItem(ONBOARDING_SESSION_KEY, "true");
  };

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "전세 사기 걱정 끝!",
      description: "방가드는 AI 기반으로 계약서를 분석하여\n대학생과 1인 가구의 안전한 주거를 지킵니다",
      icon: <Shield className="w-20 h-20" />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: 2,
      title: "10초 계약서 분석",
      description: "사진만 찍으면 AI가 즉시 분석\n신호등 색상으로 위험도를 한눈에 확인하세요",
      icon: <FileText className="w-20 h-20" />,
      color: "from-green-500 to-emerald-600",
    },
    {
      id: 3,
      title: "24시간 AI 상담",
      description: "궁금한 점은 언제든 물어보세요\n부동산 전문가 수준의 답변을 실시간으로",
      icon: <MessageSquare className="w-20 h-20" />,
      color: "from-purple-500 to-violet-600",
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      markOnboardingSeen();
      navigate(redirectTarget || "/login", { replace: true });
    }
  };

  const handleSkip = () => {
    markOnboardingSeen();
    navigate(redirectTarget || "/login", { replace: true });
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="app-shell-wide h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              방가드
            </span>
          </div>
          <Button variant="ghost" onClick={handleSkip} className="rounded-xl">
            건너뛰기
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-4 pb-28 pt-20 sm:px-6">
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div className={`mb-6 inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br ${steps[currentStep].color} text-white shadow-2xl sm:mb-8 sm:h-32 sm:w-32 [&_svg]:h-14 [&_svg]:w-14 sm:[&_svg]:h-20 sm:[&_svg]:w-20`}>
            {steps[currentStep].icon}
          </div>

          {/* Title */}
          <h1 className="mb-3 text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100 sm:mb-4 sm:text-4xl">
            {steps[currentStep].title}
          </h1>

          {/* Description */}
          <p className="mb-9 whitespace-pre-line text-base leading-7 text-gray-600 dark:text-gray-400 sm:mb-12 sm:text-lg sm:leading-relaxed">
            {steps[currentStep].description}
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? "w-8 bg-blue-600" 
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 dark:border-gray-700 dark:bg-gray-900 sm:px-6 sm:py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Button 
            onClick={handleBack}
            variant="ghost"
            size="lg"
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            이전
          </Button>

          <div className="text-sm text-gray-500 font-medium">
            {currentStep + 1} / {steps.length}
          </div>

          <Button 
            onClick={handleNext}
            size="lg"
            className="gap-2"
          >
            {currentStep < steps.length - 1 ? "다음" : "시작하기"}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
