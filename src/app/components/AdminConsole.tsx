import { useState } from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  BookOpen,
  ChevronRight,
  Clock3,
  FileStack,
  Shield,
  Sparkles,
  TrendingUp,
  Workflow,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  ADMIN_SECTION_OPTIONS,
  ADMIN_STATUS_LABELS,
  ADMIN_STATUS_STYLES,
  MOCK_ADMIN_CONTENT,
  MOCK_ADMIN_KNOWLEDGE,
  MOCK_ADMIN_KNOWLEDGE_HEALTH,
  MOCK_ADMIN_OVERVIEW_METRICS,
  MOCK_ADMIN_QUEUE_SNAPSHOTS,
  MOCK_ADMIN_RECENT_ACTIVITY,
  MOCK_ADMIN_REPORTS,
  type AdminSection,
  type AdminStatus,
} from "../data/admin";

function StatusBadge({ status }: { status: AdminStatus }) {
  return (
    <Badge className={`rounded-full border px-3 py-1 ${ADMIN_STATUS_STYLES[status]}`}>
      {ADMIN_STATUS_LABELS[status]}
    </Badge>
  );
}

const metricToneStyles = {
  amber: "from-amber-500/15 to-orange-500/10 text-amber-700 dark:text-amber-300",
  blue: "from-blue-500/15 to-indigo-500/10 text-blue-700 dark:text-blue-300",
  emerald: "from-emerald-500/15 to-teal-500/10 text-emerald-700 dark:text-emerald-300",
  violet: "from-violet-500/15 to-fuchsia-500/10 text-violet-700 dark:text-violet-300",
} as const;

const queueStatusStyles = {
  stable:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300",
  watch:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300",
  urgent:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300",
} as const;

const activityTypeStyles = {
  report: {
    icon: AlertTriangle,
    badge:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300",
    label: "신고",
  },
  content: {
    icon: FileStack,
    badge:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300",
    label: "콘텐츠",
  },
  knowledge: {
    icon: BookOpen,
    badge:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/30 dark:text-violet-300",
    label: "지식",
  },
} as const;

export function AdminConsole() {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");

  const renderOverviewSection = () => (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-3xl border border-blue-100/80 bg-gradient-to-br from-white to-blue-50/40 shadow-sm dark:border-indigo-900/60 dark:from-gray-900 dark:to-indigo-950/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">운영 대기열 상태</CardTitle>
            <CardDescription>지금 바로 우선순위를 잡아야 하는 항목들을 요약합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_ADMIN_QUEUE_SNAPSHOTS.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4 dark:border-gray-800 dark:bg-gray-900/60"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.label}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.helper}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`rounded-full border px-3 py-1 ${queueStatusStyles[item.status]}`}>
                    {item.status === "urgent" ? "긴급" : item.status === "watch" ? "주의" : "안정"}
                  </Badge>
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.value}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-blue-100/80 bg-gradient-to-br from-white to-blue-50/40 shadow-sm dark:border-indigo-900/60 dark:from-gray-900 dark:to-indigo-950/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">지식베이스 상태</CardTitle>
            <CardDescription>상담과 정책 화면에 반영되는 문서 최신성을 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">게시 중</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {MOCK_ADMIN_KNOWLEDGE_HEALTH.publishedCount}
                </p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">검토 필요</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {MOCK_ADMIN_KNOWLEDGE_HEALTH.needsReviewCount}
                </p>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4 dark:border-rose-900/60 dark:bg-rose-950/20">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">오래된 문서</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {MOCK_ADMIN_KNOWLEDGE_HEALTH.staleCount}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4 dark:border-gray-800 dark:bg-gray-900/60">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Clock3 className="h-4 w-4" />
                마지막 동기화
              </div>
              <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {MOCK_ADMIN_KNOWLEDGE_HEALTH.lastSyncedAt}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-3xl border border-blue-100/80 bg-gradient-to-br from-white to-blue-50/40 shadow-sm dark:border-indigo-900/60 dark:from-gray-900 dark:to-indigo-950/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">최근 활동</CardTitle>
            <CardDescription>신고, 콘텐츠, 지식 관련 최근 운영 이력을 모았습니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_ADMIN_RECENT_ACTIVITY.map((activity) => {
              const config = activityTypeStyles[activity.type];
              const Icon = config.icon;

              return (
                <div
                  key={activity.id}
                  className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-gray-800 dark:bg-gray-900/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-slate-100 p-2 text-slate-700 dark:bg-gray-800 dark:text-gray-200">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Badge className={`rounded-full border px-3 py-1 ${config.badge}`}>
                            {config.label}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{activity.occurredAt}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{activity.title}</p>
                        <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{activity.description}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{activity.actor}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-blue-100/80 bg-gradient-to-br from-white to-blue-50/40 shadow-sm dark:border-indigo-900/60 dark:from-gray-900 dark:to-indigo-950/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">오늘의 운영 포커스</CardTitle>
            <CardDescription>첫 진입 시 빠르게 읽고 다음 행동을 정할 수 있도록 배치했습니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 dark:border-gray-800 dark:bg-gray-900/60">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                <Workflow className="h-4 w-4" />
                검토 우선순위
              </div>
              <p className="text-sm leading-7 text-gray-600 dark:text-gray-400">
                관악구 주의 매물 신고와 개인정보 노출 댓글을 먼저 정리하면 신고 대기열의 핵심 위험 항목이 대부분 해소됩니다.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 dark:border-gray-800 dark:bg-gray-900/60">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                <TrendingUp className="h-4 w-4" />
                KPI 메모
              </div>
              <p className="text-sm leading-7 text-gray-600 dark:text-gray-400">
                평균 1차 응답 시간은 개선 중이지만, 신고 적체가 다시 늘면 속도 개선이 바로 꺾일 수 있어 오전 모니터링이 중요합니다.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 dark:border-gray-800 dark:bg-gray-900/60 md:col-span-2">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                <BookOpen className="h-4 w-4" />
                지식 업데이트 메모
              </div>
              <p className="text-sm leading-7 text-gray-600 dark:text-gray-400">
                전세보증금 반환보증 가이드는 최신 상태지만, 대출 FAQ와 전입신고 체크리스트는 아직 검토가 남아 있어 챗봇 답변 신뢰도에 영향을 줄 수 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderReportsSection = () => (
    <div className="space-y-4">
      {MOCK_ADMIN_REPORTS.map((report) => (
        <Card
          key={report.id}
          className="rounded-3xl border border-blue-100/80 bg-gradient-to-br from-white to-blue-50/40 shadow-sm dark:border-indigo-900/60 dark:from-gray-900 dark:to-indigo-950/20"
        >
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-full">
                    {report.targetType === "post" ? "게시글" : "댓글"}
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{report.reportedAt}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{report.targetTitle}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {report.category} · 최근 사유: {report.latestReason} · 신고 {report.reporterCount}건
                </p>
              </div>
              <StatusBadge status={report.status} />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="rounded-xl">검토 시작</Button>
              <Button variant="outline" className="rounded-xl">
                숨김 처리
              </Button>
              <Button variant="outline" className="rounded-xl">
                신고 내역 보기
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderContentSection = () => (
    <div className="space-y-4">
      {MOCK_ADMIN_CONTENT.map((item) => (
        <Card
          key={item.id}
          className="rounded-3xl border border-blue-100/80 bg-gradient-to-br from-white to-blue-50/40 shadow-sm dark:border-indigo-900/60 dark:from-gray-900 dark:to-indigo-950/20"
        >
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-full">
                    {item.type === "community" ? "커뮤니티" : item.type === "review" ? "거주지 리뷰" : "정책 정보"}
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">수정 {item.updatedAt}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">작성자: {item.owner}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="rounded-xl">상세 보기</Button>
              <Button variant="outline" className="rounded-xl">
                상태 변경
              </Button>
              <Button variant="outline" className="rounded-xl">
                보관 처리
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderKnowledgeSection = () => (
    <div className="space-y-4">
      {MOCK_ADMIN_KNOWLEDGE.map((item) => (
        <Card
          key={item.id}
          className="rounded-3xl border border-blue-100/80 bg-gradient-to-br from-white to-blue-50/40 shadow-sm dark:border-indigo-900/60 dark:from-gray-900 dark:to-indigo-950/20"
        >
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-full">
                    {item.source}
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">업데이트 {item.updatedAt}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{item.summary}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="rounded-xl">문서 열기</Button>
              <Button variant="outline" className="rounded-xl">
                버전 갱신
              </Button>
              <Button variant="outline" className="rounded-xl">
                게시 상태 변경
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

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
            <Shield className="h-4 w-4" />
            관리자 콘솔 · 운영 대시보드
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent dark:from-blue-400 dark:to-indigo-400">
            운영 상태를 한눈에 보고 바로 조치할 수 있게 정리했습니다
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            신고 검토, 콘텐츠 상태, 지식베이스 최신성, 최근 활동까지 첫 화면에서 읽을 수 있게 구성했습니다. 실제 권한과 백엔드 연결 전 단계의 프론트 운영 허브입니다.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {MOCK_ADMIN_OVERVIEW_METRICS.map((item) => {
            const Icon =
              item.id === "pending-reports"
                ? AlertTriangle
                : item.id === "review-sla"
                  ? Clock3
                  : item.id === "healthy-content"
                    ? FileStack
                    : BookOpen;

            return (
              <Card
                key={item.label}
                className={`rounded-[28px] border-0 bg-gradient-to-br ${metricToneStyles[item.tone]} shadow-sm shadow-slate-200/40 ring-1 ring-white/60 dark:ring-white/5`}
              >
                <CardContent className="flex h-full flex-col justify-between gap-4 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="mt-2 text-3xl font-semibold">{item.value}</p>
                    </div>
                    <div className="rounded-2xl bg-white/70 p-3 dark:bg-gray-900/40">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.trend}</p>
                    <p className="mt-1 text-sm leading-6 text-current/80">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="rounded-[32px] border-0 bg-white/88 shadow-lg shadow-slate-200/60 ring-1 ring-slate-200/70 dark:bg-gray-900/82 dark:ring-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">운영 영역</CardTitle>
            <CardDescription>관리자 화면은 일반 사용자 화면과 분리된 전용 라우트에서만 접근합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 lg:grid-cols-4">
              {ADMIN_SECTION_OPTIONS.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`rounded-3xl border px-5 py-5 text-left transition ${
                    activeSection === section.id
                      ? "border-slate-900 bg-slate-900 text-white shadow-md dark:border-white dark:bg-white dark:text-gray-900"
                      : "border-slate-200 bg-slate-50 text-gray-700 hover:bg-slate-100 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-200 dark:hover:bg-gray-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{section.label}</p>
                      <p
                        className={`mt-2 text-sm leading-6 ${
                          activeSection === section.id
                            ? "text-white/80 dark:text-gray-700"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {section.description}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  </div>
                </button>
              ))}
            </div>

            {activeSection === "overview" && renderOverviewSection()}
            {activeSection === "reports" && renderReportsSection()}
            {activeSection === "content" && renderContentSection()}
            {activeSection === "knowledge" && renderKnowledgeSection()}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
          <CardContent className="flex flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 text-sm font-semibold text-blue-700 dark:text-blue-300">다음 단계</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">운영 대시보드와 세부 관리 탭이 한 흐름으로 연결되었습니다</div>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                첫 진입에서는 요약 대시보드로 상태를 파악하고, 이어서 신고·콘텐츠·지식 탭으로 바로 내려갈 수 있게 구성했습니다.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-4 py-2 text-sm font-medium text-blue-700 dark:border-indigo-900/60 dark:bg-indigo-950/30 dark:text-blue-300">
              <Sparkles className="h-4 w-4" />
              T8 운영 현황 대시보드 반영 완료
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
