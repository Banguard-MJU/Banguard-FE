import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import {
  Building2,
  ChevronRight,
  FileText,
  GraduationCap,
  MapPin,
  MessageSquare,
  Search,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { useAuth } from "../contexts/AuthContext";
import {
  getDistrictLabel,
  getDistrictOptions,
  getResidenceSummary,
  getRegionLabel,
  getUniversityLabel,
  getUniversityOptions,
  REGION_OPTIONS,
} from "../data/profile";
import {
  filterResidenceReviews,
  getHousingTypeLabel,
  HOUSING_TYPE_OPTIONS,
  RESIDENCE_REVIEWS,
  SATISFACTION_LABELS,
  SATISFACTION_OPTIONS,
  SATISFACTION_STYLES,
  type ResidenceHousingType,
  type ResidenceReview,
  type ResidenceSatisfaction,
} from "../data/reviews";
import { getResidenceReviews } from "../lib/community-api";

function SatisfactionBadge({ value }: { value: ResidenceSatisfaction }) {
  return (
    <Badge className={`rounded-full border px-3 py-1 ${SATISFACTION_STYLES[value]}`}>
      {SATISFACTION_LABELS[value]}
    </Badge>
  );
}

export function ResidenceReviews() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialRegion = searchParams.get("region") || user?.profile?.region || "all";
  const initialDistrict = searchParams.get("district") || user?.profile?.district || "";
  const initialUniversity = searchParams.get("university") || user?.profile?.university || "";

  const [query, setQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState(initialRegion);
  const [activeDistrict, setActiveDistrict] = useState(initialDistrict);
  const [activeUniversity, setActiveUniversity] = useState(initialUniversity);
  const [activeHousingType, setActiveHousingType] = useState<ResidenceHousingType | "all">("all");
  const [activeSatisfaction, setActiveSatisfaction] = useState<ResidenceSatisfaction | "all">("all");
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [backendReviews, setBackendReviews] = useState<ResidenceReview[]>([]);
  const [hasBackendReviewsLoaded, setHasBackendReviewsLoaded] = useState(false);

  const districtOptions = getDistrictOptions(activeRegion === "all" ? undefined : activeRegion);
  const universityOptions = getUniversityOptions(activeDistrict);

  useEffect(() => {
    setActiveRegion(initialRegion);
  }, [initialRegion]);

  useEffect(() => {
    let isMounted = true;

    getResidenceReviews()
      .then((reviews) => {
        if (isMounted) {
          setBackendReviews(reviews);
          setHasBackendReviewsLoaded(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setBackendReviews([]);
          setHasBackendReviewsLoaded(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredReviews = useMemo(
    () => {
      const localReviews = filterResidenceReviews({
        query,
        region: activeRegion,
        district: activeDistrict,
        university: activeUniversity,
        housingType: activeHousingType,
        satisfaction: activeSatisfaction,
      });

      const normalizedQuery = query.trim().toLowerCase();
      const matchingBackendReviews = backendReviews.filter((review) => {
        const matchesHousingType = activeHousingType === "all" || review.housingType === activeHousingType;
        const matchesSatisfaction = activeSatisfaction === "all" || review.satisfaction === activeSatisfaction;
        const matchesQuery =
          normalizedQuery === "" ||
          [review.title, review.neighborhood, review.summary, ...review.tags]
            .some((field) => field.toLowerCase().includes(normalizedQuery));

        return matchesHousingType && matchesSatisfaction && matchesQuery;
      });

      return hasBackendReviewsLoaded ? matchingBackendReviews : localReviews;
    },
    [activeDistrict, activeHousingType, activeRegion, activeSatisfaction, activeUniversity, backendReviews, hasBackendReviewsLoaded, query]
  );

  const featuredReviews = useMemo(() => {
    if (hasBackendReviewsLoaded) {
      return backendReviews.slice(0, 2);
    }

    if (user?.profile?.university) {
      const byUniversity = RESIDENCE_REVIEWS.filter((review) => review.nearbyUniversity === user.profile?.university);
      if (byUniversity.length > 0) {
        return byUniversity;
      }
    }

    if (user?.profile?.district) {
      const byDistrict = RESIDENCE_REVIEWS.filter((review) => review.district === user.profile?.district);
      if (byDistrict.length > 0) {
        return byDistrict;
      }
    }

    return RESIDENCE_REVIEWS.slice(0, 2);
  }, [backendReviews, hasBackendReviewsLoaded, user?.profile?.district, user?.profile?.university]);

  const selectedReview = selectedReviewId
    ? [...backendReviews, ...RESIDENCE_REVIEWS].find((review) => review.id === selectedReviewId) ?? null
    : null;

  const handleOpenReview = (review: ResidenceReview) => {
    setSelectedReviewId(review.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 py-12 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30">
      <div className="app-shell space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-4 py-2 text-sm font-medium text-blue-700 backdrop-blur-sm dark:border-blue-800 dark:text-blue-300">
            <Building2 className="h-4 w-4" />
            거주지 리뷰 · 실사용 후기
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent dark:from-blue-400 dark:to-indigo-400">
            토론과 분리된 실제 거주 후기를 따로 모았습니다
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            커뮤니티가 질문과 경고, 정보 공유를 다루는 공간이라면 여기는 실제로 살아본 사용자의 만족도, 비용감, 장단점을 정리해 둔 후기 전용 화면입니다.
          </p>
        </motion.div>

        {user?.profile?.region && (
          <Card className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
            <CardContent className="flex flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-2 text-sm font-semibold text-blue-700 dark:text-blue-300">내 설정 기준 후기</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{getResidenceSummary(user.profile)}</div>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  설정한 희망 지역과 대학교 근처 후기를 우선 보여주고 있습니다.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="outline" className="rounded-xl" onClick={() => navigate("/settings")}>
                  추천 기준 수정
                </Button>
                <Button className="rounded-xl" onClick={() => navigate("/listings")}>
                  매물 탐색으로 이동
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {featuredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                <CardHeader className="pb-4">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200/60 dark:shadow-none">
                      <Star className="h-7 w-7" />
                    </div>
                    <SatisfactionBadge value={review.satisfaction} />
                  </div>
                  <CardTitle className="text-2xl">{review.title}</CardTitle>
                  <CardDescription className="text-base leading-7">{review.summary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
                      <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">위치 / 학교</div>
                      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {review.neighborhood}
                        <br />
                        {review.nearbyUniversity
                          ? getUniversityLabel(review.district, review.nearbyUniversity)
                          : "학교 정보 없음"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/20">
                      <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">주거 정보</div>
                      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {getHousingTypeLabel(review.housingType)} · {review.monthlyCostText}
                        <br />
                        {review.stayDurationText}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {review.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm dark:bg-gray-900/70 dark:text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button className="flex-1 rounded-xl" onClick={() => handleOpenReview(review)}>
                      후기 자세히 보기
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={() =>
                        navigate(
                          `/listings?region=${review.region}&district=${review.district}${
                            review.nearbyUniversity ? `&university=${review.nearbyUniversity}` : ""
                          }`
                        )
                      }
                    >
                      이 지역 매물 보기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">조건별 후기 탐색</CardTitle>
            <CardDescription className="text-base">
              실제 거주 후기를 지역, 학교, 주거 형태, 만족도로 좁혀보세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="지역, 학교, 후기 키워드로 검색해보세요"
                  className="h-12 rounded-2xl border-blue-100/80 bg-white/90 pl-11 shadow-sm dark:border-indigo-900/60 dark:bg-gray-900/80"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="h-12 rounded-2xl px-5" onClick={() => navigate("/community")}>
                  커뮤니티 보기
                </Button>
                <Button variant="outline" className="h-12 rounded-2xl px-5" onClick={() => navigate("/chatbot")}>
                  AI 상담
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">시/도</div>
              <div className="flex flex-wrap gap-3">
                {[{ value: "all", label: "전체 지역" }, ...REGION_OPTIONS].map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={activeRegion === option.value ? "default" : "outline"}
                    className="rounded-full px-5"
                    onClick={() => {
                      setActiveRegion(option.value);
                      setActiveDistrict("");
                      setActiveUniversity("");
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">시/군/구</div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant={activeDistrict === "" ? "default" : "outline"}
                    className="rounded-full px-5"
                    onClick={() => {
                      setActiveDistrict("");
                      setActiveUniversity("");
                    }}
                  >
                    전체 시군구
                  </Button>
                  {districtOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={activeDistrict === option.value ? "default" : "outline"}
                      className="rounded-full px-5"
                      onClick={() => {
                        setActiveDistrict(option.value);
                        setActiveUniversity("");
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">대학교 인근</div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant={activeUniversity === "" ? "default" : "outline"}
                    className="rounded-full px-5"
                    onClick={() => setActiveUniversity("")}
                  >
                    전체 학교
                  </Button>
                  {universityOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={activeUniversity === option.value ? "default" : "outline"}
                      className="rounded-full px-5"
                      onClick={() => setActiveUniversity(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">주거 형태</div>
                <div className="flex flex-wrap gap-3">
                  {HOUSING_TYPE_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={activeHousingType === option.value ? "default" : "outline"}
                      className="rounded-full px-5"
                      onClick={() => setActiveHousingType(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">만족도</div>
                <div className="flex flex-wrap gap-3">
                  {SATISFACTION_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={activeSatisfaction === option.value ? "default" : "outline"}
                      className="rounded-full px-5"
                      onClick={() => setActiveSatisfaction(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {filteredReviews.map((review) => (
                <Card
                  key={review.id}
                  className="rounded-3xl border border-blue-100/80 bg-gradient-to-br from-white to-blue-50/40 shadow-sm transition-shadow hover:shadow-lg dark:border-indigo-900/60 dark:from-gray-900 dark:to-indigo-950/20"
                >
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{review.title}</h3>
                          <Badge variant="outline" className="rounded-full">
                            {getHousingTypeLabel(review.housingType)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4" />
                          {getRegionLabel(review.region)} · {getDistrictLabel(review.region, review.district)}
                        </div>
                      </div>
                      <SatisfactionBadge value={review.satisfaction} />
                    </div>

                    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
                      <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">후기 요약</div>
                      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{review.summary}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {review.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-indigo-950/50 dark:text-blue-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Button className="rounded-xl" onClick={() => handleOpenReview(review)}>
                        후기 자세히 보기
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() =>
                          navigate(
                            `/listings?region=${review.region}&district=${review.district}${
                              review.nearbyUniversity ? `&university=${review.nearbyUniversity}` : ""
                            }`
                          )
                        }
                      >
                        이 지역 매물 보기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="rounded-3xl border border-dashed border-blue-200 bg-blue-50/40 px-6 py-12 text-center dark:border-indigo-900/60 dark:bg-indigo-950/10">
                <div className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">조건에 맞는 후기를 찾지 못했어요</div>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  지역 범위를 넓히거나 커뮤니티에서 직접 질문을 남겨보세요.
                </p>
                <Button className="rounded-xl" onClick={() => navigate("/community")}>
                  커뮤니티로 이동
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={Boolean(selectedReview)} onOpenChange={(open) => !open && setSelectedReviewId(null)}>
        {selectedReview && (
          <DialogContent className="max-h-[88vh] max-w-4xl overflow-y-auto rounded-3xl border-0 bg-white/95 p-0 shadow-2xl dark:bg-gray-900/95">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-8 text-white">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <SatisfactionBadge value={selectedReview.satisfaction} />
                <Badge className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-white">
                  {getHousingTypeLabel(selectedReview.housingType)}
                </Badge>
                <span className="text-sm text-blue-100">{selectedReview.neighborhood}</span>
              </div>
              <DialogHeader className="text-left">
                <DialogTitle className="text-3xl font-bold text-white">{selectedReview.title}</DialogTitle>
                <DialogDescription className="text-base leading-7 text-blue-100">{selectedReview.summary}</DialogDescription>
              </DialogHeader>
            </div>

            <div className="space-y-6 px-8 py-8">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 dark:border-blue-900/60 dark:bg-blue-950/20">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    지역
                  </div>
                  <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {getRegionLabel(selectedReview.region)}
                    <br />
                    {getDistrictLabel(selectedReview.region, selectedReview.district)}
                  </p>
                </div>
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 dark:border-indigo-900/60 dark:bg-indigo-950/20">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                    주거 형태 / 비용
                  </div>
                  <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {getHousingTypeLabel(selectedReview.housingType)}
                    <br />
                    {selectedReview.monthlyCostText}
                  </p>
                </div>
                <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-5 dark:border-purple-900/60 dark:bg-purple-950/20">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                    대학교 / 거주 기간
                  </div>
                  <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {selectedReview.nearbyUniversity
                      ? getUniversityLabel(selectedReview.district, selectedReview.nearbyUniversity)
                      : "학교 정보 없음"}
                    <br />
                    {selectedReview.stayDurationText}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 dark:border-gray-800 dark:bg-gray-950/50">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    좋았던 점
                  </div>
                  <div className="space-y-3">
                    {selectedReview.pros.map((item) => (
                      <div key={item} className="flex gap-3">
                        <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-300" />
                        <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 dark:border-gray-800 dark:bg-gray-950/50">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    <MessageSquare className="h-4 w-4 text-amber-500" />
                    아쉬웠던 점
                  </div>
                  <div className="space-y-3">
                    {selectedReview.cons.map((item) => (
                      <div key={item} className="flex gap-3">
                        <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-amber-500" />
                        <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 dark:border-gray-800 dark:bg-gray-950/50">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                  거주 팁
                </div>
                <div className="space-y-3">
                  {selectedReview.tips.map((item) => (
                    <div key={item} className="flex gap-3">
                      <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-indigo-600 dark:text-indigo-300" />
                      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Button
                  className="rounded-xl"
                  onClick={() =>
                    navigate(
                      `/listings?region=${selectedReview.region}&district=${selectedReview.district}${
                        selectedReview.nearbyUniversity ? `&university=${selectedReview.nearbyUniversity}` : ""
                      }`
                    )
                  }
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  매물 탐색
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={() => navigate("/community")}>
                  <Users className="mr-2 h-4 w-4" />
                  커뮤니티
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={() => navigate("/contract-analysis")}>
                  <FileText className="mr-2 h-4 w-4" />
                  계약 분석
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
