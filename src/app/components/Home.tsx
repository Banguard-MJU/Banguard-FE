import { Link, useNavigate } from "react-router";
import { Shield, FileText, MessageSquare, TrendingUp, AlertTriangle, CheckCircle, Users, Award, ChevronRight, Landmark, FileCheck, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { CarouselApi } from "./ui/carousel";

export function Home() {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setIsDragging(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const deltaX = Math.abs(e.clientX - dragStartPos.x);
    const deltaY = Math.abs(e.clientY - dragStartPos.y);
    if (deltaX > 5 || deltaY > 5) {
      setIsDragging(true);
    }
  };

  const handleCardClick = (path: string) => (e: React.MouseEvent) => {
    if (!isDragging) {
      navigate(path);
    }
  };

  const features = [
    {
      icon: FileText,
      title: "AI 계약서 분석",
      description: "OCR과 LLM 기술로 계약서의 위험 요소를 자동으로 탐지하고 분석합니다.",
      link: "/contract-analysis",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: MessageSquare,
      title: "RAG 챗봇 상담",
      description: "부동산 관련 궁금한 점을 AI 챗봇에게 물어보고 실시간 답변을 받으세요.",
      link: "/chatbot",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: TrendingUp,
      title: "분석 히스토리",
      description: "과거 분석 내역을 한눈에 확인하고 비교 분석할 수 있습니다.",
      link: "/dashboard",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Building2,
      title: "매물 탐색",
      description: "지역, 예산, 유형에 맞는 매물을 살펴보고 위험 신호와 다음 행동을 함께 확인합니다.",
      link: "/listings",
      color: "from-emerald-500 to-teal-600"
    }
  ];

  const stats = [
    { label: "분석 완료", value: "12,543", icon: CheckCircle },
    { label: "사기 예방", value: "1,847", icon: AlertTriangle },
    { label: "활성 사용자", value: "8,921", icon: Users },
    { label: "신뢰도", value: "98.5%", icon: Award }
  ];

  const heroCards = [
    {
      icon: FileText,
      title: "AI 계약서 분석",
      description:
        "OCR과 LLM 기술로 계약서의 위험 요소를 자동으로 탐지하고 분석합니다. 복잡한 권리관계를 신호등 색상으로 직관적으로 표시합니다.",
      action: "지금 분석하기",
      link: "/contract-analysis",
      color: "from-blue-500 to-blue-600",
      hoverBorder: "hover:border-blue-400 dark:hover:border-blue-600",
      actionColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: MessageSquare,
      title: "AI 상담 챗봇",
      description:
        "부동산 관련 궁금한 점을 AI 챗봇에게 물어보고 실시간 답변을 받으세요. RAG 기술로 정확하고 신뢰할 수 있는 정보를 제공합니다.",
      action: "상담 시작하기",
      link: "/chatbot",
      color: "from-indigo-500 to-indigo-600",
      hoverBorder: "hover:border-indigo-400 dark:hover:border-indigo-600",
      actionColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      icon: Users,
      title: "커뮤니티",
      description:
        "같은 고민을 가진 사용자들과 경험을 공유하고 서로 도와주세요. 부동산 관련 팁과 주의사항을 나눌 수 있습니다.",
      action: "커뮤니티 참여하기",
      link: "/community",
      color: "from-purple-500 to-purple-600",
      hoverBorder: "hover:border-purple-400 dark:hover:border-purple-600",
      actionColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30">
      {/* Hero Section */}
      <section className="section-py">
        <div className="app-shell text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 inline-flex max-w-full items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-5 py-2.5 text-blue-700 backdrop-blur-sm dark:border-blue-800 dark:text-blue-300">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">AI 기반 부동산 안전 플랫폼</span>
            </div>

            <h1 className="mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text font-bold text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1]">
              방가드로 안전하게
              <br />
              주거를 시작하세요
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed">
              부동산 지식이 부족한 대학생과 1인 가구를 위한 AI 기반 계약서 분석 및 전세 사기 예방 플랫폼
            </p>

            {/* Carousel Section */}
            <div className="relative mx-auto max-w-5xl">
              <Carousel
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4 items-stretch">
                  {heroCards.map((card) => (
                    <CarouselItem key={card.title} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <div
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onClick={handleCardClick(card.link)}
                        className={`home-hero-card group cursor-pointer select-none shadow-xl transition-all duration-300 hover:shadow-2xl dark:bg-gray-800 ${card.hoverBorder}`}
                      >
                        <div className={`home-hero-card-media relative bg-gradient-to-br ${card.color}`}>
                          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
                          <card.icon className="relative z-10 size-16 text-white transition-transform duration-300 group-hover:scale-110 md:size-20 lg:size-24" />
                        </div>
                        <div className="home-hero-card-body">
                          <h3 className="home-hero-card-title text-gray-900 dark:text-gray-100">
                            {card.title}
                          </h3>
                          <p className="home-hero-card-description text-gray-600 dark:text-gray-400">
                            {card.description}
                          </p>
                          <div className={`home-hero-card-action transition-transform duration-300 group-hover:translate-x-2 ${card.actionColor}`}>
                            <span>{card.action}</span>
                            <ChevronRight className="ml-1 h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-8">
                  {[0, 1, 2].map((index) => (
                    <button
                      key={index}
                      onClick={() => api?.scrollTo(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        current === index
                          ? "w-8 bg-blue-600 dark:bg-blue-400"
                          : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                      }`}
                      aria-label={`슬라이드 ${index + 1}로 이동`}
                    />
                  ))}
                </div>
              </Carousel>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-py-sm">
        <div className="app-shell">
          <div className="grid grid-cols-2 gap-4 md:gap-5 lg:gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="text-center border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl transition-all duration-300 rounded-2xl">
                  <CardContent className="py-6 md:py-8">
                    <div className="mx-auto mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 size-11 md:size-12 lg:size-14">
                      <stat.icon className="text-white size-5 md:size-6 lg:size-7" />
                    </div>
                    <div className="mb-2 font-bold text-gray-900 dark:text-gray-100 text-2xl md:text-3xl">{stat.value}</div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium text-sm md:text-base">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-py">
        <div className="app-shell">
          <div className="text-center mb-8 md:mb-12 lg:mb-14">
            <h2 className="mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text font-bold text-transparent dark:from-gray-100 dark:to-gray-300 text-3xl md:text-4xl">주요 기능</h2>
            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
              AI 기술로 안전한 주거 환경을 만들어갑니다
            </p>
          </div>

          <div className="grid gap-6 lg:gap-8 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden group">
                  <CardHeader className="pb-4">
                    <div className={`mb-5 flex items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} transition-transform duration-300 group-hover:scale-110 size-12 md:size-14`}>
                      <feature.icon className="text-white size-6 md:size-7" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="leading-relaxed text-sm md:text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full rounded-xl border-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-600 transition-all">
                      <Link to={feature.link}>시작하기</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            className="mt-10"
          >
            <Card className="overflow-hidden rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
              <CardContent className="grid p-5 md:p-6 lg:p-8 gap-5 md:gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-4 py-2 font-medium text-blue-700 dark:border-indigo-900/60 dark:bg-indigo-950/30 dark:text-blue-300 text-sm">
                    <Landmark className="h-4 w-4" />
                    정책 · 공공정보 둘러보기
                  </div>
                  <h3 className="mb-3 font-bold leading-tight text-gray-900 dark:text-gray-100 text-2xl lg:text-3xl">
                    보증, 지원 제도, 계약 체크리스트를 한 곳에서 확인하세요
                  </h3>
                  <p className="max-w-2xl text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                    상황에 맞는 주거 지원 정보와 계약 전 체크 포인트를 모아두었습니다. 필요한 항목을 먼저 살펴본 뒤 AI 상담으로 이어가도 좋습니다.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div className="mb-1 font-semibold text-gray-900 dark:text-gray-100">보증/지원 정보</div>
                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                      전세보증금 반환보증, 청년 월세 지원처럼 상황별 제도를 빠르게 찾을 수 있어요.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/20">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                      <FileCheck className="h-5 w-5" />
                    </div>
                    <div className="mb-1 font-semibold text-gray-900 dark:text-gray-100">계약 체크 가이드</div>
                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                      전입신고, 확정일자, 서류 확인 순서를 정리해 계약 직전에 다시 볼 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-start gap-3 sm:flex-row sm:flex-wrap lg:col-span-2">
                  <Button asChild className="rounded-2xl px-6">
                    <Link to="/policy">
                      정책/공공정보 보러가기
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-2xl px-6">
                    <Link to="/listings">
                      안전 매물 탐색하기
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative overflow-hidden section-py">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-indigo-100/30 to-purple-100/50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 -z-10"></div>
        <div className="app-shell">
          <div className="text-center mb-8 md:mb-12 lg:mb-14">
            <h2 className="mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text font-bold text-transparent dark:from-gray-100 dark:to-gray-300 text-3xl md:text-4xl">사용 방법</h2>
            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
              3단계로 간편하게 계약서를 분석하세요
            </p>
          </div>

          <div className="home-step-grid">
            {[
              {
                step: "01",
                title: "계약서 업로드",
                description: "PDF 또는 이미지 형태의 임대차 계약서를 업로드합니다."
              },
              {
                step: "02",
                title: "AI 자동 분석",
                description: "OCR과 LLM이 계약서를 읽고 위험 요소를 자동으로 분석합니다."
              },
              {
                step: "03",
                title: "결과 확인",
                description: "분석 결과와 권장사항을 확인하고 안전하게 계약하세요."
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="home-step-item"
              >
                <div className="home-step-card border border-blue-100 bg-white/70 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-blue-900 dark:bg-gray-800/70">
                  <div className="home-step-number bg-gradient-to-br from-blue-200 to-indigo-200 bg-clip-text text-4xl font-bold text-transparent dark:from-blue-600 dark:to-indigo-600 md:text-5xl">{step.step}</div>
                  <h3 className="home-step-title dark:text-gray-100">{step.title}</h3>
                  <p className="home-step-description text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-1 bg-gradient-to-r from-blue-300 to-indigo-300 dark:from-blue-700 dark:to-indigo-700 rounded-full" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-py">
        <div className="app-shell text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 border-0 text-white rounded-3xl shadow-2xl shadow-blue-500/25 overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
              <CardContent className="relative px-5 py-10 md:px-8 md:py-14 lg:py-16">
                <div className="mx-auto mb-8 flex items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm size-16 md:size-20">
                  <Shield className="size-8 md:size-10" />
                </div>
                <h2 className="mb-6 font-bold leading-tight text-2xl md:text-3xl lg:text-4xl">
                  지금 바로 계약서를 분석해보세요
                </h2>
                <p className="mx-auto mb-10 max-w-2xl text-blue-100 text-base md:text-lg leading-relaxed">
                  무료로 AI 기반 계약서 분석을 경험하고 전세 사기로부터 안전하게 보호받으세요
                </p>
                <Button asChild size="lg" variant="secondary" className="rounded-2xl shadow-xl transition-all hover:scale-105 hover:shadow-2xl h-12 px-8 text-base md:h-14 md:px-10 md:text-lg">
                  <Link to="/contract-analysis">
                    무료로 시작하기
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
