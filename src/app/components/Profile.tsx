import { useNavigate } from "react-router";
import { Calendar, DollarSign, GraduationCap, Mail, MapPin, Settings, UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useAuth } from "../contexts/AuthContext";
import { getIncomeLabel, getResidenceSummary, getUniversityLabel } from "../data/profile";

export function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-12">
      <div className="app-shell">
        <div className="mb-8">
          <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent dark:from-blue-400 dark:to-indigo-400">
            내 프로필
          </h1>
          <p className="text-gray-600 dark:text-gray-400">개인정보와 설정을 관리하세요</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-2xl border-2 shadow-lg md:col-span-1">
            <CardHeader className="pb-4 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-500/25">
                <UserCircle className="h-16 w-16 text-white" />
              </div>
              <CardTitle className="text-xl">{user?.nickname || user?.name}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-1">
                <Mail className="h-3 w-3" />
                {user?.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-950/30">
                <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">회원 유형</div>
                <div className="font-semibold text-blue-700 dark:text-blue-400">정회원</div>
              </div>
              <div className="rounded-xl bg-green-50 p-3 dark:bg-green-950/30">
                <div className="mb-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3" />
                  가입일
                </div>
                <div className="font-semibold text-green-700 dark:text-green-400">
                  {user?.createdAt ? user.createdAt.toLocaleDateString("ko-KR") : "-"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-2 shadow-lg md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>기본 정보</CardTitle>
                  <CardDescription>맞춤형 추천에 쓰이는 사용자 기준입니다.</CardDescription>
                </div>
                <Button onClick={() => navigate("/settings")} variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  설정
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user?.profile ? (
                  <>
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900/50">
                      <div className="mb-2 flex items-center gap-3">
                        <UserCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">나이</span>
                      </div>
                      <div className="text-lg font-semibold">{user.profile.age}세</div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900/50">
                      <div className="mb-2 flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">월 소득</span>
                      </div>
                      <div className="text-lg font-semibold">{getIncomeLabel(user.profile.income)}</div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900/50">
                      <div className="mb-2 flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">거주 희망 지역</span>
                      </div>
                      <div className="text-lg font-semibold">{getResidenceSummary(user.profile)}</div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900/50">
                      <div className="mb-2 flex items-center gap-3">
                        <GraduationCap className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">관심 대학교</span>
                      </div>
                      <div className="text-lg font-semibold">
                        {getUniversityLabel(user.profile.district, user.profile.university)}
                      </div>
                    </div>
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        이 정보는 매물 추천을 더 세밀하게 맞추고, 대학 인근 추천과 정책 제안에도 활용됩니다.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <UserCircle className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                    <p className="mb-4 text-gray-500">아직 프로필 정보가 없습니다</p>
                    <Button onClick={() => navigate("/settings")}>프로필 설정하기</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
