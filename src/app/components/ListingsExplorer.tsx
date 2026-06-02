import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import {
  AlertTriangle,
  Building2,
  ChevronRight,
  FileText,
  Landmark,
  MapPin,
  MessageSquare,
  Search,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { useAuth } from "../contexts/AuthContext";
import {
  filterListings,
  getFeaturedListings,
  getListingById,
  getListingTypeLabel,
  LISTING_BUDGET_OPTIONS,
  LISTING_RISK_LABELS,
  LISTING_RISK_STYLES,
  LISTING_TYPE_OPTIONS,
  type Listing,
  type ListingBudgetRange,
  type ListingType,
} from "../data/listings";
import { getProperties } from "../lib/community-api";
import {
  getDistrictLabel,
  getDistrictOptions,
  getRegionLabel,
  getResidenceSummary,
  getUniversityLabel,
  getUniversityOptions,
  REGION_OPTIONS,
} from "../data/profile";

const POLICY_CATEGORY_LABELS = {
  guarantee: "보증 정책 보기",
  support: "지원 제도 보기",
  finance: "금융 정보 보기",
  checklist: "계약 체크리스트 보기",
} as const;

const POLICY_CATEGORY_DESCRIPTIONS = {
  guarantee: "보증보험 가능 여부와 보증금 반환 리스크를 먼저 확인해보세요.",
  support: "월세 부담을 낮출 수 있는 지원 제도부터 함께 보는 흐름이 좋습니다.",
  finance: "대출 한도와 실제 부담을 먼저 계산하면 무리한 계약을 줄일 수 있습니다.",
  checklist: "오피스텔과 복합 구조는 체크리스트를 보며 특약과 사용 조건을 확인하는 편이 안전합니다.",
} as const;

function ListingRiskBadge({ riskLevel }: { riskLevel: Listing["riskLevel"] }) {
  return (
    <Badge className={`rounded-full border px-3 py-1 ${LISTING_RISK_STYLES[riskLevel]}`}>
      {LISTING_RISK_LABELS[riskLevel]}
    </Badge>
  );
}

export function ListingsExplorer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type");
  const initialRegion = searchParams.get("region");
  const initialDistrict = searchParams.get("district");
  const initialUniversity = searchParams.get("university");

  const normalizedInitialType =
    initialType && LISTING_TYPE_OPTIONS.some((option) => option.value === initialType)
      ? (initialType as ListingType | "all")
      : "all";
  const normalizedInitialRegion =
    initialRegion && REGION_OPTIONS.some((option) => option.value === initialRegion)
      ? initialRegion
      : user?.profile?.region || "all";

  const [query, setQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState(normalizedInitialRegion);
  const [activeType, setActiveType] = useState<ListingType | "all">(normalizedInitialType);
  const [activeBudget, setActiveBudget] = useState<ListingBudgetRange>("all");
  const [activeDistrict, setActiveDistrict] = useState(initialDistrict || user?.profile?.district || "");
  const [activeUniversity, setActiveUniversity] = useState(initialUniversity || user?.profile?.university || "");
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [backendListings, setBackendListings] = useState<Listing[]>([]);
  const [hasBackendListingsLoaded, setHasBackendListingsLoaded] = useState(false);

  const districtOptions = getDistrictOptions(activeRegion === "all" ? undefined : activeRegion);
  const universityOptions = getUniversityOptions(activeDistrict);

  useEffect(() => {
    setActiveType(normalizedInitialType);
  }, [normalizedInitialType]);

  useEffect(() => {
    setActiveRegion(normalizedInitialRegion);
  }, [normalizedInitialRegion]);

  useEffect(() => {
    if (initialDistrict) {
      setActiveDistrict(initialDistrict);
    }
  }, [initialDistrict]);

  useEffect(() => {
    if (initialUniversity) {
      setActiveUniversity(initialUniversity);
    }
  }, [initialUniversity]);

  useEffect(() => {
    let isMounted = true;

    getProperties()
      .then((listings) => {
        if (isMounted) {
          setBackendListings(listings);
          setHasBackendListingsLoaded(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setBackendListings([]);
          setHasBackendListingsLoaded(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const personalizedFeaturedListings = getFeaturedListings().filter((listing) => {
    if (user?.profile?.university) {
      return listing.nearbyUniversities.includes(user.profile.university);
    }

    if (user?.profile?.district) {
      return listing.district === user.profile.district;
    }

    if (user?.profile?.region) {
      return listing.region === user.profile.region;
    }

    return true;
  });
  const featuredListings = hasBackendListingsLoaded
    ? backendListings.slice(0, 2)
    : personalizedFeaturedListings.length > 0
      ? personalizedFeaturedListings
      : getFeaturedListings();
  const filteredListings = useMemo(
    () => {
      const localListings = filterListings({
        query,
        region: activeRegion,
        district: activeDistrict,
        university: activeUniversity,
        type: activeType,
        budget: activeBudget,
      });

      const normalizedQuery = query.trim().toLowerCase();
      const matchingBackendListings = backendListings.filter((listing) => {
        const matchesType = activeType === "all" || listing.type === activeType;
        const matchesBudget =
          activeBudget === "all" ||
          (activeBudget === "under-100m" && listing.priceValue < 100000000) ||
          (activeBudget === "100m-300m" && listing.priceValue >= 100000000 && listing.priceValue < 300000000) ||
          (activeBudget === "300m-plus" && listing.priceValue >= 300000000);
        const matchesQuery =
          normalizedQuery === "" ||
          [listing.title, listing.address, listing.neighborhood, listing.depositText, listing.monthlyRentText]
            .some((field) => field.toLowerCase().includes(normalizedQuery));

        return matchesType && matchesBudget && matchesQuery;
      });

      return hasBackendListingsLoaded ? matchingBackendListings : localListings;
    },
    [activeBudget, activeDistrict, activeRegion, activeType, activeUniversity, backendListings, hasBackendListingsLoaded, query]
  );
  const selectedListing = selectedListingId
    ? backendListings.find((listing) => listing.id === selectedListingId) ?? getListingById(selectedListingId)
    : null;

  const handleOpenListing = (listing: Listing) => {
    setSelectedListingId(listing.id);
  };

  const handleOpenPolicy = (listing: Listing) => {
    navigate(`/policy?category=${listing.recommendedPolicyCategory}`);
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 py-12 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30">
      <div className="app-shell space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-4 py-2 text-sm font-medium text-blue-700 backdrop-blur-sm dark:border-blue-800 dark:text-blue-300">
            <Building2 className="h-4 w-4" />
            매물 탐색 · 안전도 프리뷰
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent dark:from-blue-400 dark:to-indigo-400">
            매물을 고르기 전에 위험 신호부터 함께 보세요
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            위치와 예산에 맞는 매물을 먼저 좁히고, 각 매물별로 계약 분석, 정책 탐색, AI 상담, 커뮤니티 후기로 자연스럽게 이어질 수 있게 구성했습니다.
          </p>
        </motion.div>

        {user?.profile?.region && (
          <Card className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
            <CardContent className="flex flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-2 text-sm font-semibold text-blue-700 dark:text-blue-300">내 설정 기준 추천</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{getResidenceSummary(user.profile)}</div>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  설정한 희망 거주지와 대학교 인근 조건을 우선 반영해 매물을 먼저 보여주고 있습니다.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() =>
                    navigate(
                      `/reviews?region=${user.profile?.region || ""}&district=${user.profile?.district || ""}${
                        user.profile?.university ? `&university=${user.profile.university}` : ""
                      }`
                    )
                  }
                >
                  관련 후기 보기
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={() => navigate("/settings")}>
                  추천 기준 수정
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {featuredListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                <CardHeader className="pb-4">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200/60 dark:shadow-none">
                      <Shield className="h-7 w-7" />
                    </div>
                    <ListingRiskBadge riskLevel={listing.riskLevel} />
                  </div>
                  <CardTitle className="text-2xl">{listing.title}</CardTitle>
                  <CardDescription className="text-base leading-7">
                    {listing.riskSummary}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
                      <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">가격 / 유형</div>
                      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {listing.depositText} · {listing.monthlyRentText}
                        <br />
                        {getListingTypeLabel(listing.type)} · {listing.areaText}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/20">
                      <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">지역 / 이동</div>
                      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {getRegionLabel(listing.region)} · {getDistrictLabel(listing.region, listing.district)}
                        <br />
                        {listing.commuteText}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {listing.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm dark:bg-gray-900/70 dark:text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button className="flex-1 gap-2 rounded-xl" onClick={() => handleOpenListing(listing)}>
                      매물 자세히 보기
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-xl" onClick={() => handleOpenPolicy(listing)}>
                      관련 정책 보기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">조건별 매물 탐색</CardTitle>
            <CardDescription className="text-base">
              지역, 유형, 가격 범위를 먼저 좁혀본 뒤 각 매물의 위험 포인트와 다음 행동을 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="지역, 보증금, 특징, 위험 포인트로 검색해보세요"
                  className="h-12 rounded-2xl border-blue-100/80 bg-white/90 pl-11 shadow-sm dark:border-indigo-900/60 dark:bg-gray-900/80"
                />
              </div>
              <Button variant="outline" className="h-12 rounded-2xl px-5" onClick={() => navigate("/community")}>
                후기 먼저 보기
              </Button>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">지역</div>
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
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">유형</div>
                <div className="flex flex-wrap gap-3">
                  {LISTING_TYPE_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={activeType === option.value ? "default" : "outline"}
                      className="rounded-full px-5"
                      onClick={() => setActiveType(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">가격 범위</div>
                <div className="flex flex-wrap gap-3">
                  {LISTING_BUDGET_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={activeBudget === option.value ? "default" : "outline"}
                      className="rounded-full px-5"
                      onClick={() => setActiveBudget(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {filteredListings.map((listing) => (
                <Card
                  key={listing.id}
                  className="rounded-3xl border border-blue-100/80 bg-gradient-to-br from-white to-blue-50/40 shadow-sm transition-shadow hover:shadow-lg dark:border-indigo-900/60 dark:from-gray-900 dark:to-indigo-950/20"
                >
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{listing.title}</h3>
                          <Badge variant="outline" className="rounded-full">
                            {getListingTypeLabel(listing.type)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4" />
                          {listing.neighborhood} · {listing.commuteText}
                        </div>
                      </div>
                      <ListingRiskBadge riskLevel={listing.riskLevel} />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-blue-100 bg-white/80 p-4 dark:border-indigo-900/60 dark:bg-gray-900/60">
                        <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">가격</div>
                        <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                          {listing.depositText}
                          <br />
                          {listing.monthlyRentText}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-blue-100 bg-white/80 p-4 dark:border-indigo-900/60 dark:bg-gray-900/60">
                        <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">조건</div>
                        <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                          {listing.areaText} · {listing.floorText}
                          <br />
                          {listing.landlordType}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
                      <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">한눈에 보는 판단 포인트</div>
                      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{listing.riskSummary}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {listing.highlights.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-indigo-950/50 dark:text-blue-200"
                        >
                          {item}
                        </span>
                      ))}
                      {listing.nearbyUniversities.map((universityCode) => (
                        <span
                          key={universityCode}
                          className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-950/50 dark:text-violet-200"
                        >
                          {getUniversityLabel(listing.district, universityCode)} 인근
                        </span>
                      ))}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Button className="rounded-xl" onClick={() => handleOpenListing(listing)}>
                        상세 보기
                      </Button>
                      <Button variant="outline" className="rounded-xl" onClick={() => navigate("/contract-analysis")}>
                        계약 분석으로 이어가기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="rounded-3xl border border-dashed border-blue-200 bg-blue-50/40 px-6 py-12 text-center dark:border-indigo-900/60 dark:bg-indigo-950/10">
                <div className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">조건에 맞는 매물을 찾지 못했어요</div>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  지역이나 가격 범위를 넓혀 보거나, AI 상담에서 예산과 우선순위를 먼저 정리해보세요.
                </p>
                <Button className="rounded-xl" onClick={() => navigate("/chatbot")}>
                  AI 상담 열기
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={Boolean(selectedListing)} onOpenChange={(open) => !open && setSelectedListingId(null)}>
        {selectedListing && (
          <DialogContent className="max-h-[88vh] max-w-4xl overflow-y-auto rounded-3xl border-0 bg-white/95 p-0 shadow-2xl dark:bg-gray-900/95">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-8 text-white">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <ListingRiskBadge riskLevel={selectedListing.riskLevel} />
                <Badge className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-white">
                  {getListingTypeLabel(selectedListing.type)}
                </Badge>
                <span className="text-sm text-blue-100">{selectedListing.neighborhood}</span>
              </div>
              <DialogHeader className="text-left">
                <DialogTitle className="text-3xl font-bold text-white">{selectedListing.title}</DialogTitle>
                <DialogDescription className="text-base leading-7 text-blue-100">
                  {selectedListing.riskSummary}
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="space-y-6 px-8 py-8">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 dark:border-blue-900/60 dark:bg-blue-950/20">
                  <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">가격</div>
                  <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {selectedListing.depositText}
                    <br />
                    {selectedListing.monthlyRentText}
                  </p>
                </div>
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 dark:border-indigo-900/60 dark:bg-indigo-950/20">
                  <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">면적 / 층수</div>
                  <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {selectedListing.areaText}
                    <br />
                    {selectedListing.floorText}
                  </p>
                </div>
                <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-5 dark:border-purple-900/60 dark:bg-purple-950/20">
                  <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">위치 / 이동</div>
                  <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {selectedListing.address}
                    <br />
                    {selectedListing.commuteText}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 dark:border-gray-800 dark:bg-gray-950/50">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    매물 장점
                  </div>
                  <div className="space-y-3">
                    {selectedListing.highlights.map((item) => (
                      <div key={item} className="flex gap-3">
                        <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-300" />
                        <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 dark:border-gray-800 dark:bg-gray-950/50">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    추가 확인 포인트
                  </div>
                  <div className="space-y-3">
                    {selectedListing.cautionPoints.map((item) => (
                      <div key={item} className="flex gap-3">
                        <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-amber-500" />
                        <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 dark:border-indigo-900/60 dark:from-blue-950/20 dark:to-indigo-950/20">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <Landmark className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                  함께 보면 좋은 정책
                </div>
                <div className="mb-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                  {POLICY_CATEGORY_LABELS[selectedListing.recommendedPolicyCategory]}
                </div>
                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {POLICY_CATEGORY_DESCRIPTIONS[selectedListing.recommendedPolicyCategory]}
                </p>
                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  추천 기준 지역: {getRegionLabel(selectedListing.region)} · {getDistrictLabel(selectedListing.region, selectedListing.district)}
                  {selectedListing.nearbyUniversities.length > 0 &&
                    ` · ${selectedListing.nearbyUniversities
                      .map((universityCode) => getUniversityLabel(selectedListing.district, universityCode))
                      .join(", ")}`}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 dark:border-gray-800 dark:bg-gray-950/50">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  다음 행동 추천
                </div>
                <div className="space-y-3">
                  {selectedListing.recommendedActions.map((action) => (
                    <div key={action} className="flex gap-3">
                      <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-300" />
                      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{action}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <Button className="rounded-xl" onClick={() => navigate("/contract-analysis")}>
                  <FileText className="mr-2 h-4 w-4" />
                  계약 분석
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={() => navigate("/chatbot")}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  AI 상담
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={() => navigate("/community")}>
                  <Users className="mr-2 h-4 w-4" />
                  커뮤니티 후기
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() =>
                    navigate(
                      `/reviews?region=${selectedListing.region}&district=${selectedListing.district}${
                        selectedListing.nearbyUniversities[0] ? `&university=${selectedListing.nearbyUniversities[0]}` : ""
                      }`
                    )
                  }
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  거주지 리뷰
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={() => handleOpenPolicy(selectedListing)}>
                  <Landmark className="mr-2 h-4 w-4" />
                  정책 정보
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
