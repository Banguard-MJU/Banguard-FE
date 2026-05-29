import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { BookOpen, Building2, ChevronRight, FileCheck, Landmark, Search, Shield, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import {
  POLICY_CATEGORY_OPTIONS,
  POLICY_RESOURCES,
  getCategoryLabel,
  type PolicyCategory,
  type PolicyResource,
} from "../data/policy";
import { getPolicies } from "../lib/policy-api";

const categoryIconMap: Record<PolicyCategory, typeof Shield> = {
  guarantee: Shield,
  support: Sparkles,
  finance: Landmark,
  checklist: FileCheck,
};

export function PolicyExplorer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const normalizedInitialCategory =
    initialCategory && POLICY_CATEGORY_OPTIONS.some((option) => option.value === initialCategory)
      ? (initialCategory as PolicyCategory | "all")
      : "all";

  const [activeCategory, setActiveCategory] = useState<PolicyCategory | "all">(normalizedInitialCategory);
  const [query, setQuery] = useState("");
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
  const [policies, setPolicies] = useState<PolicyResource[]>(POLICY_RESOURCES);

  const featuredPolicies = policies.filter((p) => p.featured);
  const filteredPolicies = policies.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    if (!matchesCategory) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [p.title, p.provider, p.summary, p.benefit, p.eligibility, p.recommendedFor, ...p.tags].some(
      (field) => field.toLowerCase().includes(q),
    );
  });
  const selectedPolicy = selectedPolicyId ? policies.find((p) => p.id === selectedPolicyId) ?? null : null;

  useEffect(() => {
    setActiveCategory(normalizedInitialCategory);
  }, [normalizedInitialCategory]);

  useEffect(() => {
    getPolicies()
      .then(setPolicies)
      .catch(() => {});
  }, []);

  const handleOpenPolicy = (policy: PolicyResource) => {
    setSelectedPolicyId(policy.id);
  };

  const handleAskChatbot = () => {
    navigate("/chatbot");
  };

  const handleExploreListings = () => {
    navigate("/listings");
  };

  const responsiveButtonClassName = "h-auto min-h-10 min-w-0 whitespace-normal rounded-xl px-4 py-2 text-center leading-5";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 py-12 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30">
      <div className="app-shell space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-4 py-2 text-sm font-medium text-blue-700 backdrop-blur-sm dark:border-blue-800 dark:text-blue-300">
            <BookOpen className="h-4 w-4" />
            정책 · 공공정보 탐색
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent dark:from-blue-400 dark:to-indigo-400">
            지금 상황에 맞는 주거 지원 정보를 찾아보세요
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            보증, 지원 제도, 금융 정보, 계약 체크리스트를 한 곳에서 살펴보고 필요하면 바로 AI 상담으로 이어갈 수 있습니다.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {featuredPolicies.map((policy, index) => {
            const Icon = categoryIconMap[policy.category];

            return (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                  <CardHeader className="pb-4">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200/60 dark:shadow-none">
                        <Icon className="h-7 w-7" />
                      </div>
                      <Badge className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-blue-200">
                        추천 정보
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl">{policy.title}</CardTitle>
                    <CardDescription className="text-base leading-7">
                      {policy.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
                      <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">이런 경우에 좋아요</div>
                      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{policy.recommendedFor}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {policy.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm dark:bg-gray-900/70 dark:text-gray-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Button className={`w-full gap-2 ${responsiveButtonClassName}`} onClick={() => handleOpenPolicy(policy)}>
                        자세히 보기
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" className={`w-full ${responsiveButtonClassName}`} onClick={handleExploreListings}>
                        매물 탐색으로 이어가기
                      </Button>
                    </div>
                    <div className="grid gap-3">
                      <Button variant="outline" className={`w-full ${responsiveButtonClassName}`} onClick={handleAskChatbot}>
                        AI 상담으로 이어가기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Card className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">정책 탐색</CardTitle>
            <CardDescription className="text-base">
              현재 상황과 비슷한 항목을 검색하거나 카테고리별로 살펴보세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="보증보험, 청년 월세, 확정일자처럼 검색해보세요"
                  className="h-12 rounded-2xl border-blue-100/80 bg-white/90 pl-11 shadow-sm dark:border-indigo-900/60 dark:bg-gray-900/80"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:flex">
                <Button variant="outline" className="h-auto min-h-12 whitespace-normal rounded-2xl px-5 py-2 leading-5" onClick={handleExploreListings}>
                  매물 탐색
                </Button>
                <Button variant="outline" className="h-auto min-h-12 whitespace-normal rounded-2xl px-5 py-2 leading-5" onClick={handleAskChatbot}>
                  AI 상담 열기
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {POLICY_CATEGORY_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={activeCategory === option.value ? "default" : "outline"}
                  className="rounded-full px-5"
                  onClick={() => setActiveCategory(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {filteredPolicies.map((policy) => {
                const Icon = categoryIconMap[policy.category];

                return (
                  <Card
                    key={policy.id}
                    className="rounded-3xl border border-blue-100/80 bg-gradient-to-br from-white to-blue-50/40 shadow-sm transition-shadow hover:shadow-lg dark:border-indigo-900/60 dark:from-gray-900 dark:to-indigo-950/20"
                  >
                    <CardContent className="space-y-4 pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{policy.title}</h3>
                              <Badge variant="outline" className="rounded-full">
                                {getCategoryLabel(policy.category)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Building2 className="h-4 w-4" />
                              {policy.provider}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{policy.summary}</p>

                      <div className="rounded-2xl border border-blue-100 bg-white/80 p-4 dark:border-indigo-900/60 dark:bg-gray-900/60">
                        <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">주요 혜택</div>
                        <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{policy.benefit}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {policy.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-indigo-950/50 dark:text-blue-200"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <Button className={`w-full ${responsiveButtonClassName}`} onClick={() => handleOpenPolicy(policy)}>
                          상세 보기
                        </Button>
                        <Button variant="outline" className={`w-full ${responsiveButtonClassName}`} onClick={handleExploreListings}>
                          매물 탐색
                        </Button>
                      </div>
                      <div className="grid gap-3">
                        <Button variant="outline" className={`w-full ${responsiveButtonClassName}`} onClick={handleAskChatbot}>
                          상담으로 이어가기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredPolicies.length === 0 && (
              <div className="rounded-3xl border border-dashed border-blue-200 bg-blue-50/40 px-6 py-12 text-center dark:border-indigo-900/60 dark:bg-indigo-950/10">
                <div className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">조건에 맞는 정책을 찾지 못했어요</div>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  검색어를 조금 바꾸거나 AI 상담에서 상황을 자세히 설명해보세요.
                </p>
                <Button className="rounded-xl" onClick={handleAskChatbot}>
                  AI 상담 열기
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={Boolean(selectedPolicy)} onOpenChange={(open) => !open && setSelectedPolicyId(null)}>
        {selectedPolicy && (
          <DialogContent className="max-h-[85vh] w-[calc(100vw-2rem)] max-w-3xl overflow-y-auto rounded-3xl border-0 bg-white/95 p-0 shadow-2xl dark:bg-gray-900/95">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-6 text-white sm:px-8 sm:py-8">
              <div className="mb-3 flex min-w-0 flex-wrap items-center gap-3">
                <Badge className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-white">
                  {getCategoryLabel(selectedPolicy.category)}
                </Badge>
                <span className="min-w-0 text-sm text-blue-100 [overflow-wrap:anywhere]">{selectedPolicy.provider}</span>
              </div>
              <DialogHeader className="text-left">
                <DialogTitle className="text-2xl font-bold leading-tight text-white [word-break:keep-all] sm:text-3xl">{selectedPolicy.title}</DialogTitle>
                <DialogDescription className="text-base leading-7 text-blue-100 [overflow-wrap:anywhere] [word-break:keep-all]">
                  {selectedPolicy.summary}
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 dark:border-blue-900/60 dark:bg-blue-950/20">
                  <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">혜택 요약</div>
                  <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{selectedPolicy.benefit}</p>
                </div>
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 dark:border-indigo-900/60 dark:bg-indigo-950/20">
                  <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">누구에게 추천하나요</div>
                  <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{selectedPolicy.recommendedFor}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 dark:border-gray-800 dark:bg-gray-950/50">
                <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">확인해야 할 조건</div>
                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{selectedPolicy.eligibility}</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 dark:border-gray-800 dark:bg-gray-950/50">
                <div className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">핵심 체크 포인트</div>
                <div className="space-y-3">
                  {selectedPolicy.keyPoints.map((point) => (
                    <div key={point} className="flex gap-3">
                      <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-300" />
                      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 dark:border-indigo-900/60 dark:from-blue-950/20 dark:to-indigo-950/20 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div className="min-w-0">
                  <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">정책을 봤다면 바로 이어서 점검해보세요</div>
                  <p className="text-sm leading-6 text-gray-600 dark:text-gray-300 [overflow-wrap:anywhere] [word-break:keep-all]">
                    조건에 맞는 매물을 먼저 좁혀보거나, AI 상담에서 계약 상황을 한 번 더 확인할 수 있습니다.
                  </p>
                </div>
                <div className="grid min-w-0 gap-3 sm:grid-cols-2 md:w-max">
                  <Button variant="outline" className={`w-full md:w-auto ${responsiveButtonClassName}`} onClick={handleExploreListings}>
                    매물 탐색
                  </Button>
                  <Button className={`w-full md:w-auto ${responsiveButtonClassName}`} onClick={handleAskChatbot}>
                    AI 상담으로 이어가기
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
