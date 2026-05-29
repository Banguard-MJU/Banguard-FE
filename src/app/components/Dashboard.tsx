import { useEffect, useMemo, useState } from "react";
import { BarChart3, FileText, TrendingUp, Clock, AlertTriangle, CheckCircle, Calendar, MessageSquare, Users, ChevronRight, Landmark } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  type AnalysisHistory,
  type RecentChatActivity,
  type RecentCommunityActivity,
  buildRecommendedActions,
  buildDashboardStats,
  formatDashboardDate,
  formatTimeAgo,
  getRiskBadgeClass,
  getRiskLabel,
  normalizeRiskLevel,
} from "../data/dashboard";
import { getAnalysisHistory } from "../lib/analysis-api";
import { getChatbotSessions } from "../lib/chatbot-api";
import { getCommunityPosts } from "../lib/community-api";
import { getDisplayErrorMessage } from "../lib/error-message";
import { useAuth } from "../contexts/AuthContext";

export function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedHistory, setSelectedHistory] = useState<AnalysisHistory | null>(null);
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [recentChatActivity, setRecentChatActivity] = useState<RecentChatActivity[]>([]);
  const [recentCommunityActivity, setRecentCommunityActivity] = useState<RecentCommunityActivity[]>([]);
  const highRiskHistory = useMemo(
    () => history.filter((item) => normalizeRiskLevel(item.riskLevel) === "high"),
    [history],
  );
  const mediumRiskHistory = useMemo(
    () => history.filter((item) => normalizeRiskLevel(item.riskLevel) === "medium"),
    [history],
  );
  const lowRiskHistory = useMemo(
    () => history.filter((item) => normalizeRiskLevel(item.riskLevel) === "low"),
    [history],
  );
  const stats = buildDashboardStats(history).map((stat) => ({
    ...stat,
    icon:
      stat.label === "총 분석 건수"
        ? FileText
        : stat.label === "평균 위험도"
          ? TrendingUp
          : stat.label === "고위험 계약"
            ? AlertTriangle
            : CheckCircle,
  }));
  const recommendedActions = buildRecommendedActions(history);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setHistory([]);
      setHistoryError(null);
      setHistoryLoading(false);
      return;
    }

    let isMounted = true;
    setHistoryLoading(true);
    setHistoryError(null);

    getAnalysisHistory()
      .then((items) => {
        if (isMounted) {
          setHistory(items);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setHistory([]);
          setHistoryError(getDisplayErrorMessage(error, "분석 이력을 불러오지 못했습니다"));
        }
      })
      .finally(() => {
        if (isMounted) {
          setHistoryLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    let isMounted = true;

    getChatbotSessions()
      .then((sessions) => {
        if (!isMounted) return;
        const mapped: RecentChatActivity[] = sessions.slice(0, 2).map((s) => ({
          id: s.session_id,
          title: s.title || "AI 상담",
          summary: "대화를 이어서 확인하세요.",
          timestamp: s.last_active_at || s.created_at,
        }));
        setRecentChatActivity(mapped);
      })
      .catch(() => {});

    getCommunityPosts({ sort: "latest", size: 2 })
      .then((posts) => {
        if (!isMounted) return;
        const mapped: RecentCommunityActivity[] = posts.map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          summary: "",
          timestamp: p.timestamp,
          engagement: `댓글 ${p.comments} · 좋아요 ${p.likes}`,
        }));
        setRecentCommunityActivity(mapped);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [authLoading, isAuthenticated]);

  return (
    <div className="min-h-screen py-12">
      <div className="app-shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">분석 대시보드</h1>
              <p className="text-lg text-gray-600">
                최근 분석, 상담, 커뮤니티 흐름을 한 곳에서 확인하세요
              </p>
            </div>
            <Button onClick={() => navigate("/contract-analysis")}>
              <FileText className="w-4 h-4 mr-2" />
              새 계약서 분석
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">
                      {stat.value}{stat.suffix || ""}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] mb-8">
            <Card className="rounded-2xl border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  최근 활동
                </CardTitle>
                <CardDescription>
                  최근 상담과 커뮤니티 흐름을 빠르게 이어볼 수 있습니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">최근 AI 상담</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">최근 질문 흐름을 이어서 확인할 수 있어요</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate("/chatbot")}>
                      열기
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {recentChatActivity.map((activity) => (
                      <div key={activity.id} className="rounded-xl bg-white/80 px-4 py-3 dark:bg-gray-800/80">
                        <div className="mb-1 flex items-center justify-between gap-3">
                          <div className="font-medium text-gray-900 dark:text-gray-100">{activity.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(activity.timestamp)}</div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{activity.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/20">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">최근 커뮤니티 활동</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">참고하기 좋은 경험담과 경고 글을 모았습니다</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate("/community")}>
                      보기
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {recentCommunityActivity.map((activity) => (
                      <div key={activity.id} className="rounded-xl bg-white/80 px-4 py-3 dark:bg-gray-800/80">
                        <div className="mb-1 flex items-center justify-between gap-3">
                          <div className="font-medium text-gray-900 dark:text-gray-100">{activity.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(activity.timestamp)}</div>
                        </div>
                        <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">{activity.summary}</p>
                        <div className="text-xs text-indigo-600 dark:text-indigo-300">{activity.engagement}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  다음 행동 추천
                </CardTitle>
                <CardDescription>
                  최근 분석 결과를 바탕으로 이어서 할 수 있는 작업입니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendedActions.map((action) => {
                  const toneClass =
                    action.tone === "warning"
                      ? "border-red-200 bg-red-50/80 dark:border-red-900/60 dark:bg-red-950/20"
                      : action.tone === "primary"
                        ? "border-blue-200 bg-blue-50/80 dark:border-blue-900/60 dark:bg-blue-950/20"
                        : "border-gray-200 bg-gray-50/80 dark:border-gray-700 dark:bg-gray-900/60";

                  return (
                    <div key={action.id} className={`rounded-2xl border p-4 ${toneClass}`}>
                      <div className="mb-2 font-semibold text-gray-900 dark:text-gray-100">{action.title}</div>
                      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{action.description}</p>
                      <Button
                        variant={action.tone === "primary" || action.tone === "warning" ? "default" : "outline"}
                        size="sm"
                        className="gap-2"
                        onClick={() => navigate(action.href)}
                      >
                        {action.ctaLabel}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Analysis History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                분석 이력
              </CardTitle>
              <CardDescription>
                최근 분석한 계약서 목록입니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">전체</TabsTrigger>
                  <TabsTrigger value="high">고위험</TabsTrigger>
                  <TabsTrigger value="medium">중간위험</TabsTrigger>
                  <TabsTrigger value="low">저위험</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {historyLoading && (
                    <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm text-gray-500 dark:bg-gray-900/60 dark:text-gray-400">
                      분석 이력을 불러오는 중입니다
                    </div>
                  )}
                  {!historyLoading && historyError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
                      {historyError}
                    </div>
                  )}
                  {!historyLoading && !historyError && history.length === 0 && (
                    <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm text-gray-500 dark:bg-gray-900/60 dark:text-gray-400">
                      아직 저장된 분석 이력이 없습니다
                    </div>
                  )}
                  {!historyLoading && !historyError && history.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                <h3 className="font-semibold truncate">{item.fileName}</h3>
                              </div>
                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {formatDashboardDate(item.date)}
                                </div>
                                <div>주소: {item.address}</div>
                                <div>계약 유형: {item.contractType}</div>
                              </div>
                            </div>

                            <div className="text-right space-y-2">
                              <Badge className={getRiskBadgeClass(item.riskLevel)}>
                                위험도: {getRiskLabel(item.riskLevel)}
                              </Badge>
                              <div className="w-32">
                                <div className="text-sm text-gray-600 mb-1">
                                  위험 점수: {item.riskScore}/100
                                </div>
                                <Progress value={item.riskScore} className="h-2" />
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setSelectedHistory(item)}>
                              상세보기
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/contract-analysis")}>
                              다시 분석
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </TabsContent>

                <TabsContent value="high" className="space-y-4">
                  {highRiskHistory.map((item) => (
                    <Card key={item.id} className="border-red-200">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                              <h3 className="font-semibold">{item.fileName}</h3>
                            </div>
                            <div className="text-sm text-gray-600">
                              <div>{item.address}</div>
                              <div>{formatDashboardDate(item.date)}</div>
                            </div>
                          </div>
                          <Badge className={getRiskBadgeClass(item.riskLevel)}>
                            위험도: {getRiskLabel(item.riskLevel)} ({item.riskScore}/100)
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {!historyLoading && highRiskHistory.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      고위험 계약이 없습니다
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="medium" className="space-y-4">
                  {mediumRiskHistory.map((item) => (
                    <Card key={item.id} className="border-yellow-200">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-5 h-5 text-yellow-500" />
                              <h3 className="font-semibold">{item.fileName}</h3>
                            </div>
                            <div className="text-sm text-gray-600">
                              <div>{item.address}</div>
                              <div>{formatDashboardDate(item.date)}</div>
                            </div>
                          </div>
                          <Badge className={getRiskBadgeClass(item.riskLevel)}>
                            위험도: {getRiskLabel(item.riskLevel)} ({item.riskScore}/100)
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {!historyLoading && mediumRiskHistory.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      중간위험 계약이 없습니다
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="low" className="space-y-4">
                  {lowRiskHistory.map((item) => (
                    <Card key={item.id} className="border-green-200">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <h3 className="font-semibold">{item.fileName}</h3>
                            </div>
                            <div className="text-sm text-gray-600">
                              <div>{item.address}</div>
                              <div>{formatDashboardDate(item.date)}</div>
                            </div>
                          </div>
                          <Badge className={getRiskBadgeClass(item.riskLevel)}>
                            위험도: {getRiskLabel(item.riskLevel)} ({item.riskScore}/100)
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {!historyLoading && lowRiskHistory.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      저위험 계약이 없습니다
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={Boolean(selectedHistory)} onOpenChange={(open) => !open && setSelectedHistory(null)}>
        {selectedHistory && (
          <DialogContent className="max-w-xl rounded-3xl">
            <DialogHeader>
              <DialogTitle>{selectedHistory.fileName}</DialogTitle>
              <DialogDescription>
                최근 분석 이력의 핵심 정보를 다시 확인하고 다음 행동으로 이어갈 수 있습니다.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-gray-900/60">
                  <div className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                    계약 유형
                  </div>
                  <div className="text-base font-semibold text-gray-900 dark:text-gray-100">{selectedHistory.contractType}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-gray-900/60">
                  <div className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                    분석일
                  </div>
                  <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {formatDashboardDate(selectedHistory.date)}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 dark:border-gray-800">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">위험도 평가</div>
                    <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{getRiskLabel(selectedHistory.riskLevel)}</div>
                  </div>
                  <Badge className={getRiskBadgeClass(selectedHistory.riskLevel)}>
                    {selectedHistory.riskScore}/100
                  </Badge>
                </div>
                <Progress value={selectedHistory.riskScore} className="h-2.5" />
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-gray-900/60">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Landmark className="w-4 h-4" />
                  분석 대상 주소
                </div>
                <div className="text-sm leading-6 text-gray-600 dark:text-gray-400">{selectedHistory.address}</div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setSelectedHistory(null)}>
                닫기
              </Button>
              <Button variant="outline" onClick={() => navigate("/policy")}>
                정책 확인
              </Button>
              <Button onClick={() => navigate("/contract-analysis")}>
                다시 분석
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

export default Dashboard;
