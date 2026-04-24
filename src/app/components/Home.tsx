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
      <section className="py-24">
        <div className="app-shell text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-5 py-2.5 rounded-full mb-8 backdrop-blur-sm">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">AI 기반 부동산 안전 플랫폼</span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
              방가드로 안전하게
              <br />
              주거를 시작하세요
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
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
                      className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-600 h-[400px] flex flex-col select-none"
                    >
                      <div className="h-52 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
                        <FileText className="w-24 h-24 text-white group-hover:scale-110 transition-transform duration-300 relative z-10" />
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="min-h-[4rem]">
                          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">AI 계약서 분석</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-5 leading-relaxed min-h-[6.5rem]">
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
                      className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group border-2 border-transparent hover:border-indigo-400 dark:hover:border-indigo-600 h-[400px] flex flex-col select-none"
                    >
                      <div className="h-52 bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
                        <MessageSquare className="w-24 h-24 text-white group-hover:scale-110 transition-transform duration-300 relative z-10" />
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="min-h-[4rem]">
                          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">AI 상담 챗봇</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-5 leading-relaxed min-h-[6.5rem]">
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
                      className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group border-2 border-transparent hover:border-purple-400 dark:hover:border-purple-600 h-[400px] flex flex-col select-none"
                    >
                      <div className="h-52 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
                        <Users className="w-24 h-24 text-white group-hover:scale-110 transition-transform duration-300 relative z-10" />
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="min-h-[4rem]">
                          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">커뮤니티</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-5 leading-relaxed min-h-[6.5rem]">
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
      <section className="py-16">
        <div className="app-shell">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="text-center border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl transition-all duration-300 rounded-2xl">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="app-shell">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">주요 기능</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
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
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
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
              <CardContent className="grid gap-6 px-8 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-4 py-2 text-sm font-medium text-blue-700 dark:border-indigo-900/60 dark:bg-indigo-950/30 dark:text-blue-300">
                    <Landmark className="h-4 w-4" />
                    정책 · 공공정보 둘러보기
                  </div>
                  <h3 className="mb-3 text-3xl font-bold text-gray-900 dark:text-gray-100">
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

                <div className="lg:col-span-2 flex flex-wrap justify-start gap-3">
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
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-indigo-100/30 to-purple-100/50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 -z-10"></div>
        <div className="app-shell">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">사용 방법</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
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
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-100 dark:border-blue-900">
                  <div className="text-6xl font-bold bg-gradient-to-br from-blue-200 to-indigo-200 dark:from-blue-600 dark:to-indigo-600 bg-clip-text text-transparent mb-6">{step.step}</div>
                  <h3 className="text-2xl font-bold mb-3 dark:text-gray-100">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-1 bg-gradient-to-r from-blue-300 to-indigo-300 dark:from-blue-700 dark:to-indigo-700 rounded-full" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="app-shell text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 border-0 text-white rounded-3xl shadow-2xl shadow-blue-500/25 overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
              <CardContent className="pt-16 pb-16 relative">
                <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Shield className="w-10 h-10" />
                </div>
                <h2 className="text-4xl font-bold mb-6">
                  지금 바로 계약서를 분석해보세요
                </h2>
                <p className="text-blue-100 mb-10 text-xl leading-relaxed max-w-2xl mx-auto">
                  무료로 AI 기반 계약서 분석을 경험하고 전세 사기로부터 안전하게 보호받으세요
                </p>
                <Button asChild size="lg" variant="secondary" className="text-lg h-14 px-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105">
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
