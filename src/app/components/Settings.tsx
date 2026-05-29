import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Bell,
  Bookmark,
  ChevronRight,
  Eye,
  EyeOff,
  Heart,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Settings as SettingsIcon,
  Shield,
  Trash2,
  User,
  UserCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { getDisplayErrorMessage } from "../lib/error-message";
import { MIN_PASSWORD_LENGTH, getPasswordMinLengthMessage } from "../lib/password-policy";
import {
  CATEGORY_CONFIG,
  getCommunityActivityStore,
  type CommunityInteractionRecord,
} from "../data/community";
import {
  getDistrictLabel,
  getDistrictOptions,
  getIncomeLabel,
  getIncomeOptionsForSelect,
  getRegionLabel,
  getResidenceSummary,
  getUniversityLabel,
  getUniversityOptions,
  REGION_OPTIONS,
} from "../data/profile";

type SettingsSection = "profile" | "activity" | "notifications" | "saved";

type NotificationPreferences = {
  push: boolean;
  comment: boolean;
  reply: boolean;
  like: boolean;
  marketing: boolean;
};

const NOTIFICATION_SETTINGS_STORAGE_KEY = "banguard_notification_settings";

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  push: true,
  comment: true,
  reply: true,
  like: true,
  marketing: false,
};

const SECTION_CONFIG: Array<{
  id: SettingsSection;
  title: string;
  description: string;
  icon: typeof User;
}> = [
  { id: "profile", title: "개인정보", description: "프로필, 보안, 연락처, 계정 관리", icon: User },
  { id: "activity", title: "내 활동", description: "좋아요와 저장 기록, 최근 반응", icon: Heart },
  { id: "notifications", title: "알림", description: "커뮤니티와 서비스 알림 제어", icon: Bell },
  { id: "saved", title: "저장됨", description: "북마크한 게시글 모아보기", icon: Bookmark },
];

function readNotificationSettingsMap(): Record<string, NotificationPreferences> {
  if (typeof window === "undefined") {
    return {};
  }

  const rawValue = window.localStorage.getItem(NOTIFICATION_SETTINGS_STORAGE_KEY);
  if (!rawValue) {
    return {};
  }

  try {
    return JSON.parse(rawValue) as Record<string, NotificationPreferences>;
  } catch {
    window.localStorage.removeItem(NOTIFICATION_SETTINGS_STORAGE_KEY);
    return {};
  }
}

function writeNotificationSettingsMap(settingsMap: Record<string, NotificationPreferences>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(NOTIFICATION_SETTINGS_STORAGE_KEY, JSON.stringify(settingsMap));
}

function formatRecordedDate(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatJoinDate(date?: Date) {
  if (!date) {
    return "-";
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ActivityList({
  records,
  emptyTitle,
  emptyDescription,
  actionLabel,
  onAction,
}: {
  records: CommunityInteractionRecord[];
  emptyTitle: string;
  emptyDescription: string;
  actionLabel: string;
  onAction: () => void;
}) {
  if (records.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-900/40">
        <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{emptyTitle}</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{emptyDescription}</p>
        <Button variant="outline" className="mt-4 rounded-full" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record) => {
        const category = CATEGORY_CONFIG[record.category];

        return (
          <Card
            key={`${record.postId}-${record.recordedAt}`}
            className="rounded-3xl border-0 bg-white/85 shadow-sm shadow-slate-200/40 ring-1 ring-slate-200/70 dark:bg-gray-900/70 dark:ring-gray-800"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={`rounded-full bg-gradient-to-r ${category.color} text-white shadow-none`}>
                      {category.label}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatRecordedDate(record.recordedAt)}</span>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{record.title}</p>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">{record.content}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{record.author}</span>
                    {record.tags?.slice(0, 3).map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="rounded-full shrink-0" onClick={onAction}>
                  커뮤니티
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function Settings() {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();

  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [age, setAge] = useState("");
  const [income, setIncome] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [university, setUniversity] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [notificationSettings, setNotificationSettings] = useState<NotificationPreferences>(
    DEFAULT_NOTIFICATION_PREFERENCES
  );

  useEffect(() => {
    setNickname(user?.nickname || "");
    if (user?.profile) {
      setAge(user.profile.age?.toString() || "");
      setIncome(user.profile.income || "");
      setRegion(user.profile.region || "");
      setDistrict(user.profile.district || "");
      setUniversity(user.profile.university || "");
      return;
    }

    setAge("");
    setIncome("");
    setRegion("");
    setDistrict("");
    setUniversity("");
  }, [user]);

  useEffect(() => {
    if (!user?.id) {
      setNotificationSettings(DEFAULT_NOTIFICATION_PREFERENCES);
      return;
    }

    const settingsMap = readNotificationSettingsMap();
    setNotificationSettings(settingsMap[user.id] ?? DEFAULT_NOTIFICATION_PREFERENCES);
  }, [user?.id]);

  const communityActivity = useMemo(() => getCommunityActivityStore(user?.id), [user?.id]);
  const incomeOptions = useMemo(() => getIncomeOptionsForSelect(income), [income]);
  const districtOptions = useMemo(() => getDistrictOptions(region), [region]);
  const universityOptions = useMemo(() => getUniversityOptions(district), [district]);
  const likedPosts = communityActivity.likedPosts;
  const bookmarkedPosts = communityActivity.bookmarkedPosts;

  const activityHighlights = useMemo(
    () => [
      {
        label: "좋아요한 글",
        value: likedPosts.length,
        icon: Heart,
        accent: "from-rose-500/15 to-orange-500/10 text-rose-600 dark:text-rose-300",
      },
      {
        label: "저장한 글",
        value: bookmarkedPosts.length,
        icon: Bookmark,
        accent: "from-indigo-500/15 to-sky-500/10 text-indigo-600 dark:text-indigo-300",
      },
      {
        label: "활동 요약",
        value: likedPosts.length + bookmarkedPosts.length,
        icon: MessageSquare,
        accent: "from-emerald-500/15 to-teal-500/10 text-emerald-600 dark:text-emerald-300",
      },
    ],
    [bookmarkedPosts.length, likedPosts.length]
  );

  const handleNotificationChange = (type: keyof NotificationPreferences, value: boolean) => {
    const nextSettings = {
      ...notificationSettings,
      [type]: value,
    };

    setNotificationSettings(nextSettings);

    if (user?.id) {
      const settingsMap = readNotificationSettingsMap();
      settingsMap[user.id] = nextSettings;
      writeNotificationSettingsMap(settingsMap);
    }

    const labels: Record<keyof NotificationPreferences, string> = {
      push: "푸시 알림",
      comment: "댓글 알림",
      reply: "답글 알림",
      like: "좋아요 알림",
      marketing: "마케팅/이벤트 알림",
    };
    toast.success(value ? `${labels[type]}이 활성화되었습니다` : `${labels[type]}이 비활성화되었습니다`);
  };

  const handleProfileUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!nickname.trim()) {
      toast.error("닉네임을 입력해주세요");
      return;
    }

    if (!age || !income || !region) {
      toast.error("이름, 나이, 소득, 시/도 정보를 입력해주세요");
      return;
    }

    setProfileLoading(true);

    try {
      await updateProfile({
        nickname: nickname.trim(),
        age: parseInt(age, 10),
        income,
        region: region as import("../data/profile").RegionCode,
        district: district || undefined,
        university: university || undefined,
      });
      toast.success("프로필이 성공적으로 수정되었습니다");
    } catch {
      toast.error("프로필 수정에 실패했습니다");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("모든 항목을 입력해주세요");
      return;
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      toast.error(getPasswordMinLengthMessage("새 비밀번호"));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("새 비밀번호가 일치하지 않습니다");
      return;
    }

    setPasswordLoading(true);

    try {
      await changePassword(newPassword);
      toast.success("비밀번호가 성공적으로 변경되었습니다");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(getDisplayErrorMessage(error, "비밀번호 변경에 실패했습니다"));
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSendEmailCode = () => {
    if (!newEmail.trim()) {
      toast.error("이메일을 입력해주세요");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error("유효한 이메일 주소를 입력해주세요");
      return;
    }

    setEmailLoading(true);

    setTimeout(() => {
      setEmailCodeSent(true);
      toast.success("인증코드가 전송되었습니다");
      setEmailLoading(false);
    }, 1000);
  };

  const handleEmailChange = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!emailVerificationCode) {
      toast.error("인증코드를 입력해주세요");
      return;
    }

    setEmailLoading(true);

    setTimeout(() => {
      toast.success("이메일이 성공적으로 변경되었습니다");
      setNewEmail("");
      setEmailVerificationCode("");
      setEmailCodeSent(false);
      setEmailLoading(false);
    }, 1000);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "탈퇴하기") {
      toast.error("'탈퇴하기'를 정확히 입력해주세요");
      return;
    }

    try {
      await deleteAccount();
      toast.success("계정이 성공적으로 탈퇴되었습니다");
      navigate("/");
    } catch (error) {
      toast.error(getDisplayErrorMessage(error, "계정 탈퇴에 실패했습니다"));
    }
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <Card className="rounded-[28px] border-0 bg-white/85 shadow-sm shadow-slate-200/50 ring-1 ring-slate-200/70 dark:bg-gray-900/75 dark:ring-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <User className="w-5 h-5 text-indigo-500" />
            프로필 정보
          </CardTitle>
          <CardDescription>기본 정보와 주거 선호를 관리해 분석 정확도를 높여보세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="닉네임을 입력하세요"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  disabled={profileLoading}
                  className="rounded-2xl"
                />
              </div>
              <div className="space-y-2">
                <Label>이메일</Label>
                <Input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="rounded-2xl bg-slate-100 dark:bg-gray-800"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="age">나이</Label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="age"
                    type="number"
                    placeholder="만 나이"
                    value={age}
                    onChange={(event) => setAge(event.target.value)}
                    className="rounded-2xl pl-11"
                    min="19"
                    max="100"
                    disabled={profileLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>월 소득</Label>
                <Select value={income} onValueChange={setIncome} disabled={profileLoading}>
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue placeholder="월 소득 구간" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>거주 희망 시/도</Label>
                <Select
                  value={region}
                  onValueChange={(value) => {
                    setRegion(value);
                    setDistrict("");
                    setUniversity("");
                  }}
                  disabled={profileLoading}
                >
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue placeholder="시/도 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>거주 희망 시/군/구</Label>
                <Select
                  value={district}
                  onValueChange={(value) => {
                    setDistrict(value);
                    setUniversity("");
                  }}
                  disabled={profileLoading || districtOptions.length === 0}
                >
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue placeholder="시/도를 먼저 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {districtOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>관심 대학교</Label>
                <Select value={university} onValueChange={setUniversity} disabled={profileLoading || universityOptions.length === 0}>
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue placeholder="선택 사항" />
                  </SelectTrigger>
                  <SelectContent>
                    {universityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-200 bg-blue-50/80 px-5 py-4 text-sm text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300">
              이 정보는 계약서 분석 결과와 정책 추천을 더 개인화하는 데 사용됩니다.
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  setNickname(user?.nickname || "");
                  setAge(user?.profile?.age?.toString() || "");
                  setIncome(user?.profile?.income || "");
                  setRegion(user?.profile?.region || "");
                  setDistrict(user?.profile?.district || "");
                  setUniversity(user?.profile?.university || "");
                }}
                disabled={profileLoading}
              >
                되돌리기
              </Button>
              <Button type="submit" className="rounded-full" disabled={profileLoading}>
                {profileLoading ? "저장 중..." : "변경사항 저장"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-[28px] border-0 bg-white/85 shadow-sm shadow-slate-200/50 ring-1 ring-slate-200/70 dark:bg-gray-900/75 dark:ring-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="w-5 h-5 text-indigo-500" />
              로그인 및 보안
            </CardTitle>
            <CardDescription>비밀번호를 주기적으로 변경해 계정을 안전하게 유지하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">현재 비밀번호</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="현재 비밀번호"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    disabled={passwordLoading}
                    className="rounded-2xl pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">새 비밀번호</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder={`최소 ${MIN_PASSWORD_LENGTH}자 이상`}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    disabled={passwordLoading}
                    className="rounded-2xl pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="새 비밀번호 다시 입력"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    disabled={passwordLoading}
                    className="rounded-2xl pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="rounded-full" disabled={passwordLoading}>
                  {passwordLoading ? "변경 중..." : "비밀번호 변경"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-0 bg-white/85 shadow-sm shadow-slate-200/50 ring-1 ring-slate-200/70 dark:bg-gray-900/75 dark:ring-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="w-5 h-5 text-indigo-500" />
              연락처 및 로그인 수단
            </CardTitle>
            <CardDescription>로그인에 사용하는 이메일을 최신 상태로 유지하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleEmailChange} className="space-y-3">
              <Label htmlFor="new-email">새 이메일</Label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  id="new-email"
                  type="email"
                  placeholder="새 이메일 주소"
                  value={newEmail}
                  onChange={(event) => setNewEmail(event.target.value)}
                  disabled={emailLoading}
                  className="rounded-2xl"
                />
                <Button type="button" variant="outline" className="rounded-full" onClick={handleSendEmailCode} disabled={emailLoading}>
                  {emailLoading ? "전송 중..." : "인증코드 전송"}
                </Button>
              </div>
              {emailCodeSent && (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    placeholder="인증코드 입력"
                    value={emailVerificationCode}
                    onChange={(event) => setEmailVerificationCode(event.target.value)}
                    className="rounded-2xl"
                  />
                  <Button type="submit" className="rounded-full" disabled={emailLoading}>
                    변경 완료
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[28px] border border-red-200/70 bg-red-50/70 shadow-sm shadow-red-100/40 dark:border-red-900/50 dark:bg-red-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-red-700 dark:text-red-300">
            <Shield className="w-5 h-5" />
            계정 관리
          </CardTitle>
          <CardDescription>민감한 작업은 되돌릴 수 없으니 신중하게 진행하세요.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">회원 탈퇴</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              탈퇴하면 저장한 활동 기록과 계정 정보가 모두 사라집니다.
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="rounded-full">
                <Trash2 className="w-4 h-4 mr-2" />
                계정 탈퇴
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle>정말로 탈퇴하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  이 작업은 되돌릴 수 없습니다. 확인을 위해 아래에 <strong>탈퇴하기</strong>를 입력해주세요.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Input
                placeholder="탈퇴하기"
                value={deleteConfirmText}
                onChange={(event) => setDeleteConfirmText(event.target.value)}
                className="rounded-2xl"
              />
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-full">취소</AlertDialogCancel>
                <AlertDialogAction className="rounded-full bg-red-600 hover:bg-red-700" onClick={handleDeleteAccount}>
                  탈퇴 진행
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );

  const renderActivitySection = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {activityHighlights.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.label}
              className={`rounded-[28px] border-0 bg-gradient-to-br ${item.accent} shadow-sm shadow-slate-200/40 ring-1 ring-white/60 dark:ring-white/5`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="mt-2 text-3xl font-semibold">{item.value}</p>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-3 dark:bg-gray-900/40">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-[28px] border-0 bg-white/85 shadow-sm shadow-slate-200/50 ring-1 ring-slate-200/70 dark:bg-gray-900/75 dark:ring-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Heart className="w-5 h-5 text-rose-500" />
            최근 좋아요 활동
          </CardTitle>
          <CardDescription>커뮤니티에서 반응한 게시글을 다시 확인할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityList
            records={likedPosts.slice(0, 5)}
            emptyTitle="아직 좋아요한 글이 없습니다"
            emptyDescription="커뮤니티에서 유용한 글에 반응하면 여기에 기록이 쌓입니다."
            actionLabel="커뮤니티 보러가기"
            onAction={() => navigate("/community")}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <Card className="rounded-[28px] border-0 bg-white/85 shadow-sm shadow-slate-200/50 ring-1 ring-slate-200/70 dark:bg-gray-900/75 dark:ring-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Bell className="w-5 h-5 text-indigo-500" />
            알림 기본 설정
          </CardTitle>
          <CardDescription>받고 싶은 알림만 남기고 방해되는 알림은 줄여보세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              key: "push" as const,
              title: "푸시 알림",
              description: "앱 전체 알림 허용 여부를 제어합니다.",
            },
            {
              key: "comment" as const,
              title: "댓글 알림",
              description: "내 게시글에 새 댓글이 달리면 알려줍니다.",
            },
            {
              key: "reply" as const,
              title: "답글 알림",
              description: "내 댓글에 답글이 달리면 알려줍니다.",
            },
            {
              key: "like" as const,
              title: "좋아요 알림",
              description: "내 게시글에 반응이 생기면 알려줍니다.",
            },
            {
              key: "marketing" as const,
              title: "마케팅 및 이벤트",
              description: "새 정책, 이벤트, 캠페인 안내를 받습니다.",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50/80 px-5 py-4 dark:border-gray-800 dark:bg-gray-900/50"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{item.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
              <Switch
                checked={notificationSettings[item.key]}
                onCheckedChange={(checked) => handleNotificationChange(item.key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderSavedSection = () => (
    <div className="space-y-6">
      <Card className="rounded-[28px] border-0 bg-white/85 shadow-sm shadow-slate-200/50 ring-1 ring-slate-200/70 dark:bg-gray-900/75 dark:ring-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Bookmark className="w-5 h-5 text-indigo-500" />
            저장된 게시글
          </CardTitle>
          <CardDescription>커뮤니티에서 북마크한 글을 한곳에 모았습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityList
            records={bookmarkedPosts}
            emptyTitle="저장된 게시글이 없습니다"
            emptyDescription="커뮤니티에서 북마크 버튼을 누르면 여기에 정리됩니다."
            actionLabel="커뮤니티 둘러보기"
            onAction={() => navigate("/community")}
          />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/60 py-10 dark:from-gray-950 dark:via-gray-950 dark:to-indigo-950/30">
      <div className="app-shell">
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
            <Card className="overflow-hidden rounded-[32px] border-0 bg-white/88 shadow-lg shadow-slate-200/60 ring-1 ring-slate-200/70 dark:bg-gray-900/82 dark:ring-gray-800">
              <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 px-6 py-7 text-white">
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
                    <SettingsIcon className="w-6 h-6" />
                  </div>
                  <Badge className="rounded-full border-0 bg-white/15 text-white backdrop-blur-sm">
                    계정 허브
                  </Badge>
                </div>
                <div className="mt-6">
                  <p className="text-2xl font-semibold">{user?.nickname || user?.name || "사용자"}</p>
                  <p className="mt-1 text-sm text-white/80">{user?.email || "이메일 정보 없음"}</p>
                </div>
              </div>

              <CardContent className="space-y-5 p-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-3xl bg-slate-50 px-4 py-4 dark:bg-gray-800/70">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">가입일</p>
                    <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{formatJoinDate(user?.createdAt)}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 px-4 py-4 dark:bg-gray-800/70">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">관심 지역</p>
                    <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{getResidenceSummary(user?.profile)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {SECTION_CONFIG.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;

                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSection(section.id)}
                        className={`flex w-full items-center justify-between rounded-3xl px-4 py-4 text-left transition ${
                          isActive
                            ? "bg-slate-900 text-white shadow-md shadow-slate-200/40 dark:bg-white dark:text-gray-900"
                            : "bg-slate-50 text-gray-700 hover:bg-slate-100 dark:bg-gray-800/70 dark:text-gray-200 dark:hover:bg-gray-800"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`rounded-2xl p-2 ${isActive ? "bg-white/15 dark:bg-gray-900/10" : "bg-white dark:bg-gray-900/40"}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium">{section.title}</p>
                            <p className={`mt-1 text-xs ${isActive ? "text-white/75 dark:text-gray-700" : "text-gray-500 dark:text-gray-400"}`}>
                              {section.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50/80 px-4 py-4 dark:border-gray-800 dark:bg-gray-800/60">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">현재 프로필 요약</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getIncomeLabel(user?.profile?.income)} · {getResidenceSummary(user?.profile)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          <main className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-950 dark:text-gray-50">
                {SECTION_CONFIG.find((section) => section.id === activeSection)?.title}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {activeSection === "profile" && "프로필과 보안 정보를 정돈된 카드 단위로 관리할 수 있습니다."}
                {activeSection === "activity" && "커뮤니티에서 남긴 좋아요와 저장 기록을 한눈에 확인하세요."}
                {activeSection === "notifications" && "받고 싶은 알림만 남겨서 더 조용한 앱 경험을 만들 수 있습니다."}
                {activeSection === "saved" && "다시 보고 싶은 커뮤니티 글을 저장함에서 빠르게 이어보세요."}
              </p>
            </div>

            {activeSection === "profile" && renderProfileSection()}
            {activeSection === "activity" && renderActivitySection()}
            {activeSection === "notifications" && renderNotificationsSection()}
            {activeSection === "saved" && renderSavedSection()}
          </main>
        </div>
      </div>
    </div>
  );
}
