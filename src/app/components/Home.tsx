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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30">
      {/* Hero Section */}
      <section className="py-10 sm:py-16 lg:py-24">
        <div className="app-shell text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-4 py-2 text-blue-700 backdrop-blur-sm dark:border-blue-800 dark:text-blue-300 sm:mb-8 sm:px-5 sm:py-2.5">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">AI 기반 부동산 안전 플랫폼</span>
            </div>
            
            <h1 className="mb-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-[2.55rem] font-bold leading-[1.12] text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 sm:mb-8 sm:text-6xl lg:text-7xl">
              방가드로 안전하게
              <br />
              주거를 시작하세요
            </h1>
            
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-400 sm:mb-10 sm:text-xl sm:leading-relaxed">
              부동산 지식이 부족한 대학생과 1인 가구를 위한 AI 기반 계약서 분석 및 전세 사기 예방 플랫폼
            </p>

            {/* Carousel Section */}
            <div className="relative max-w-5xl mx-auto">
              <Carousel
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {/* Slide 1 - Contract Analysis */}
                  <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onClick={handleCardClick("/contract-analysis")}
                      className="group flex h-auto min-h-[360px] cursor-pointer select-none flex-col overflow-hidden rounded-2xl border-2 border-transparent bg-white shadow-xl transition-all duration-300 hover:border-blue-400 hover:shadow-2xl dark:bg-gray-800 dark:hover:border-blue-600 sm:h-[400px] sm:rounded-3xl"
                    >
                      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 sm:h-52">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
                        <FileText className="relative z-10 h-16 w-16 text-white transition-transform duration-300 group-hover:scale-110 sm:h-24 sm:w-24" />
                      </div>
                      <div className="flex flex-1 flex-col p-5 sm:p-8">
                        <div className="sm:min-h-[4rem]">
                          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100 sm:mb-3 sm:text-2xl">AI 계약서 분석</h3>
                        </div>
                        <p className="mb-4 min-h-0 text-sm leading-6 text-gray-600 dark:text-gray-400 sm:mb-5 sm:min-h-[6.5rem] sm:text-base sm:leading-relaxed">
                          OCR과 LLM 기술로 계약서의 위험 요소를 자동으로 탐지하고 분석합니다. 복잡한 권리관계를 신호등 색상으로 직관적으로 표시합니다.
                        </p>
                        <div className="mt-auto flex min-h-[1.75rem] items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                          <span>지금 분석하기</span>
                          <ChevronRight className="w-5 h-5 ml-1" />
                        </div>
                      </div>
                    </div>
                  </CarouselItem>

                  {/* Slide 2 - AI Chatbot */}
                  <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onClick={handleCardClick("/chatbot")}
                      className="group flex h-auto min-h-[360px] cursor-pointer select-none flex-col overflow-hidden rounded-2xl border-2 border-transparent bg-white shadow-xl transition-all duration-300 hover:border-indigo-400 hover:shadow-2xl dark:bg-gray-800 dark:hover:border-indigo-600 sm:h-[400px] sm:rounded-3xl"
                    >
                      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 sm:h-52">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
                        <MessageSquare className="relative z-10 h-16 w-16 text-white transition-transform duration-300 group-hover:scale-110 sm:h-24 sm:w-24" />
                      </div>
                      <div className="flex flex-1 flex-col p-5 sm:p-8">
                        <div className="sm:min-h-[4rem]">
                          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100 sm:mb-3 sm:text-2xl">AI 상담 챗봇</h3>
                        </div>
                        <p className="mb-4 min-h-0 text-sm leading-6 text-gray-600 dark:text-gray-400 sm:mb-5 sm:min-h-[6.5rem] sm:text-base sm:leading-relaxed">
                          부동산 관련 궁금한 점을 AI 챗봇에게 물어보고 실시간 답변을 받으세요. RAG 기술로 정확하고 신뢰할 수 있는 정보를 제공합니다.
                        </p>
                        <div className="mt-auto flex min-h-[1.75rem] items-center text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                          <span>상담 시작하기</span>
                          <ChevronRight className="w-5 h-5 ml-1" />
                        </div>
                      </div>
                    </div>
                  </CarouselItem>

                  {/* Slide 3 - Community */}
                  <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onClick={handleCardClick("/community")}
                      className="group flex h-auto min-h-[360px] cursor-pointer select-none flex-col overflow-hidden rounded-2xl border-2 border-transparent bg-white shadow-xl transition-all duration-300 hover:border-purple-400 hover:shadow-2xl dark:bg-gray-800 dark:hover:border-purple-600 sm:h-[400px] sm:rounded-3xl"
                    >
                      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 sm:h-52">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
                        <Users className="relative z-10 h-16 w-16 text-white transition-transform duration-300 group-hover:scale-110 sm:h-24 sm:w-24" />
                      </div>
                      <div className="flex flex-1 flex-col p-5 sm:p-8">
                        <div className="sm:min-h-[4rem]">
                          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100 sm:mb-3 sm:text-2xl">커뮤니티</h3>
                        </div>
                        <p className="mb-4 min-h-0 text-sm leading-6 text-gray-600 dark:text-gray-400 sm:mb-5 sm:min-h-[6.5rem] sm:text-base sm:leading-relaxed">
                          같은 고민을 가진 사용자들과 경험을 공유하고 서로 도와주세요. 부동산 관련 팁과 주의사항을 나눌 수 있습니다.
                        </p>
                        <div className="mt-auto flex min-h-[1.75rem] items-center text-purple-600 dark:text-purple-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                          <span>커뮤니티 참여하기</span>
                          <ChevronRight className="w-5 h-5 ml-1" />
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
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
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="app-shell">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="text-center border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl transition-all duration-300 rounded-2xl">
                  <CardContent className="py-8">
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 sm:mb-4 sm:h-14 sm:w-14">
                      <stat.icon className="h-5 w-5 text-white sm:h-7 sm:w-7" />
                    </div>
                    <div className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100 sm:mb-2 sm:text-4xl">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-16 lg:py-24">
        <div className="app-shell">
          <div className="mb-8 text-center sm:mb-16">
            <h2 className="mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-3xl font-bold text-transparent dark:from-gray-100 dark:to-gray-300 sm:mb-6 sm:text-5xl">주요 기능</h2>
            <p className="text-base text-gray-600 dark:text-gray-400 sm:text-xl">
              AI 기술로 안전한 주거 환경을 만들어갑니다
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden group">
                  <CardHeader className="pb-4">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} transition-transform duration-300 group-hover:scale-110 sm:mb-6 sm:h-16 sm:w-16`}>
                      <feature.icon className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
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
              <CardContent className="grid gap-5 px-5 py-6 sm:gap-6 sm:px-8 sm:py-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-4 py-2 text-sm font-medium text-blue-700 dark:border-indigo-900/60 dark:bg-indigo-950/30 dark:text-blue-300">
                    <Landmark className="h-4 w-4" />
                    정책 · 공공정보 둘러보기
                  </div>
                  <h3 className="mb-3 text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
                    보증, 지원 제도, 계약 체크리스트를 한 곳에서 확인하세요
                  </h3>
                  <p className="max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-400">
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
      <section className="relative overflow-hidden py-10 sm:py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-indigo-100/30 to-purple-100/50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 -z-10"></div>
        <div className="app-shell">
          <div className="mb-8 text-center sm:mb-16">
            <h2 className="mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-3xl font-bold text-transparent dark:from-gray-100 dark:to-gray-300 sm:mb-6 sm:text-5xl">사용 방법</h2>
            <p className="text-base text-gray-600 dark:text-gray-400 sm:text-xl">
              3단계로 간편하게 계약서를 분석하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
                className="relative"
              >
                <div className="rounded-2xl border border-blue-100 bg-white/70 p-5 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-blue-900 dark:bg-gray-800/70 sm:rounded-3xl sm:p-8">
                  <div className="mb-4 bg-gradient-to-br from-blue-200 to-indigo-200 bg-clip-text text-4xl font-bold text-transparent dark:from-blue-600 dark:to-indigo-600 sm:mb-6 sm:text-6xl">{step.step}</div>
                  <h3 className="mb-3 text-xl font-bold dark:text-gray-100 sm:text-2xl">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
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
      <section className="py-10 sm:py-16 lg:py-24">
        <div className="app-shell text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 border-0 text-white rounded-3xl shadow-2xl shadow-blue-500/25 overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
              <CardContent className="relative px-5 py-10 sm:px-8 sm:py-16">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm sm:mb-8 sm:h-20 sm:w-20">
                  <Shield className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
                <h2 className="mb-4 text-2xl font-bold leading-tight sm:mb-6 sm:text-4xl">
                  지금 바로 계약서를 분석해보세요
                </h2>
                <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-blue-100 sm:mb-10 sm:text-xl sm:leading-relaxed">
                  무료로 AI 기반 계약서 분석을 경험하고 전세 사기로부터 안전하게 보호받으세요
                </p>
                <Button asChild size="lg" variant="secondary" className="h-12 rounded-2xl px-8 text-base shadow-xl transition-all hover:scale-105 hover:shadow-2xl sm:h-14 sm:px-10 sm:text-lg">
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
