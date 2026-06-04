import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Mail, Lock, UserCircle, Loader2, ShieldCheck, Shield, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { sendEmailVerification, resendEmailVerification } from "../lib/auth-api";
import { getDisplayErrorMessage } from "../lib/error-message";
import { MIN_PASSWORD_LENGTH, getPasswordMinLengthMessage } from "../lib/password-policy";

type CheckStatus = "idle" | "checking" | "available" | "unavailable";
type EmailVerificationStatus = "idle" | "sending" | "sent" | "verified" | "failed";
const REQUIRE_EMAIL_VERIFICATION = import.meta.env.VITE_REQUIRE_EMAIL_VERIFICATION === "true";

export function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [emailCheckStatus, setEmailCheckStatus] = useState<CheckStatus>("idle");
  const [nicknameCheckStatus, setNicknameCheckStatus] = useState<CheckStatus>("idle");
  const [emailCheckMessage, setEmailCheckMessage] = useState("");
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState("");
  const [lastCheckedEmail, setLastCheckedEmail] = useState("");
  const [lastCheckedNickname, setLastCheckedNickname] = useState("");
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<EmailVerificationStatus>("idle");
  const [emailVerificationMessage, setEmailVerificationMessage] = useState("");
  const [lastVerificationEmail, setLastVerificationEmail] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToMarketing, setAgreedToMarketing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [marketingDialogOpen, setMarketingDialogOpen] = useState(false);
  
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nicknameRegex = /^[A-Za-z0-9가-힣_]{2,12}$/;

  const resetEmailCheck = (value: string) => {
    setEmail(value);
    setEmailCheckStatus("idle");
    setEmailCheckMessage("");
    setLastCheckedEmail("");
    setEmailVerificationStatus("idle");
    setEmailVerificationMessage("");
    setLastVerificationEmail("");
  };

  const resetNicknameCheck = (value: string) => {
    setNickname(value);
    setNicknameCheckStatus("idle");
    setNicknameCheckMessage("");
    setLastCheckedNickname("");
  };

  const handleCheckEmail = async () => {
    if (!emailRegex.test(email)) {
      setEmailCheckStatus("unavailable");
      setEmailCheckMessage("올바른 이메일 형식을 입력해주세요");
      return;
    }

    setEmailCheckStatus("available");
    setLastCheckedEmail(email);
    setEmailCheckMessage("이메일 형식이 확인되었습니다. 중복 여부는 가입 시 서버에서 검증됩니다.");
  };

  const handleCheckNickname = async () => {
    if (!nicknameRegex.test(nickname)) {
      setNicknameCheckStatus("unavailable");
      setNicknameCheckMessage("닉네임은 2~12자의 한글, 영문, 숫자, 밑줄만 사용할 수 있습니다");
      return;
    }

    setNicknameCheckStatus("available");
    setLastCheckedNickname(nickname);
    setNicknameCheckMessage("닉네임 형식이 확인되었습니다. 중복 여부는 가입 시 서버에서 검증됩니다.");
  };

  const handleSendEmailVerification = async () => {
    if (!emailRegex.test(email)) {
      setEmailVerificationStatus("failed");
      setEmailVerificationMessage("올바른 이메일 형식을 입력해주세요");
      return;
    }

    setEmailVerificationStatus("sending");
    setEmailVerificationMessage("");

    try {
      const response =
        emailVerificationStatus === "sent" && lastVerificationEmail === email
          ? await resendEmailVerification(email)
          : await sendEmailVerification(email);

      setLastVerificationEmail(email);
      setEmailVerificationStatus("sent");
      setEmailVerificationMessage(response.message || response.detail || "인증 메일을 보냈습니다. 메일함에서 인증 링크를 확인해주세요.");
      toast.success("인증 메일을 보냈습니다");
    } catch (error) {
      setEmailVerificationStatus("failed");
      setEmailVerificationMessage(getDisplayErrorMessage(error, "인증 메일 전송에 실패했습니다"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name.trim()) {
      setError("이름을 입력해주세요");
      setIsLoading(false);
      return;
    }

    if (!nicknameRegex.test(nickname)) {
      setError("닉네임은 2~12자의 한글, 영문, 숫자, 밑줄만 사용할 수 있습니다");
      setIsLoading(false);
      return;
    }

    if (!emailRegex.test(email)) {
      setError("올바른 이메일 형식을 입력해주세요");
      setIsLoading(false);
      return;
    }

    if (REQUIRE_EMAIL_VERIFICATION && (emailVerificationStatus !== "sent" || lastVerificationEmail !== email)) {
      setError("회원가입 전에 이메일 인증 메일을 먼저 발송해주세요");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다");
      setIsLoading(false);
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(getPasswordMinLengthMessage());
      setIsLoading(false);
      return;
    }

    const result = await signup(email, password, name.trim(), nickname.trim());

    if (result.success) {
      setIsLoading(false);
      toast.success("회원가입이 완료되었습니다!");
      navigate("/profile-setup");
    } else {
      setError(getDisplayErrorMessage(result.error, "회원가입에 실패했습니다"));
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setIsGoogleLoading(true);

    const result = await loginWithGoogle();

    if (result.success) {
      toast.success("Google 계정으로 가입되었습니다!");
      navigate("/profile-setup");
    } else {
      setError(getDisplayErrorMessage(result.error, "Google 회원가입에 실패했습니다"));
    }

    setIsGoogleLoading(false);
  };

  const handleAgreeAll = (checked: boolean) => {
    setAgreedToTerms(checked);
    setAgreedToPrivacy(checked);
    setAgreedToMarketing(checked);
  };

  const allAgreed = agreedToTerms && agreedToPrivacy && agreedToMarketing;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 px-4 py-8 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30 sm:py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="mb-6 text-center sm:mb-8">
          <div className="mb-3 inline-flex items-center gap-3 sm:mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-500/25 sm:h-14 sm:w-14">
              <Shield className="h-6 w-6 text-white sm:h-7 sm:w-7" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-indigo-400 sm:text-3xl">
              방가드
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            안전한 주거를 위한 동반자
          </p>
        </div>

        <Card className="rounded-2xl border-0 bg-white/80 shadow-2xl backdrop-blur-sm dark:bg-gray-800/80 sm:rounded-3xl">
          <CardHeader className="pb-4 text-center sm:pb-6">
            <CardTitle className="text-2xl">회원가입</CardTitle>
            <CardDescription>
              간단한 정보를 입력하고 시작하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="rounded-xl">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">이름</Label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-11 h-12 rounded-xl border-2 focus:border-blue-300 transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-sm font-medium">닉네임</Label>
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="relative flex-1">
                    <UserCircle className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <Input
                      id="nickname"
                      type="text"
                      placeholder="커뮤니티에서 사용할 닉네임"
                      value={nickname}
                      onChange={(e) => resetNicknameCheck(e.target.value)}
                      className="pl-11 h-12 rounded-xl border-2 focus:border-blue-300 transition-all"
                      required
                      disabled={isLoading || nicknameCheckStatus === "checking"}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-xl px-4"
                    onClick={handleCheckNickname}
                    disabled={isLoading || nicknameCheckStatus === "checking"}
                  >
                    {nicknameCheckStatus === "checking" ? <Loader2 className="w-4 h-4 animate-spin" /> : "중복확인"}
                  </Button>
                </div>
                {nicknameCheckMessage && (
                  <p className={`text-xs ${nicknameCheckStatus === "available" ? "text-green-600" : "text-red-500"}`}>
                    {nicknameCheckMessage}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">이메일</Label>
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => resetEmailCheck(e.target.value)}
                      className="pl-11 h-12 rounded-xl border-2 focus:border-blue-300 transition-all"
                      required
                      disabled={isLoading || emailCheckStatus === "checking"}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-xl px-4"
                    onClick={handleCheckEmail}
                    disabled={isLoading || emailCheckStatus === "checking"}
                  >
                    {emailCheckStatus === "checking" ? <Loader2 className="w-4 h-4 animate-spin" /> : "중복확인"}
                  </Button>
                </div>
                {emailCheckMessage && (
                  <p className={`text-xs ${emailCheckStatus === "available" ? "text-green-600" : "text-red-500"}`}>
                    {emailCheckMessage}
                  </p>
                )}
                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 dark:border-blue-900/50 dark:bg-blue-950/20">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-2">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">이메일 인증</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {REQUIRE_EMAIL_VERIFICATION
                            ? "가입 전 메일함에서 인증 링크를 확인할 수 있도록 인증 메일을 발송합니다."
                            : "Gmail SMTP 연동 후 필수 인증으로 전환됩니다. 지금은 인증 메일 발송만 준비되어 있습니다."}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 shrink-0 rounded-xl px-3"
                      onClick={handleSendEmailVerification}
                      disabled={isLoading || emailVerificationStatus === "sending" || !emailRegex.test(email)}
                    >
                      {emailVerificationStatus === "sending" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : emailVerificationStatus === "sent" && lastVerificationEmail === email ? (
                        "재발송"
                      ) : (
                        "인증메일 발송"
                      )}
                    </Button>
                  </div>
                  {emailVerificationMessage && (
                    <p
                      className={`mt-2 text-xs ${
                        emailVerificationStatus === "sent" ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {emailVerificationMessage}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={`${MIN_PASSWORD_LENGTH}자 이상`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 h-12 rounded-xl border-2 focus:border-blue-300 transition-all"
                    required
                    disabled={isLoading}
                    minLength={MIN_PASSWORD_LENGTH}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  비밀번호는 {MIN_PASSWORD_LENGTH}자 이상 입력해야 합니다.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">비밀번호 확인</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="비밀번호 다시 입력"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-11 h-12 rounded-xl border-2 focus:border-blue-300 transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-2 p-3 bg-blue-50/50 rounded-xl">
                  <Checkbox
                    id="agreeAll"
                    checked={allAgreed}
                    onCheckedChange={handleAgreeAll}
                    disabled={isLoading}
                  />
                  <Label htmlFor="agreeAll" className="cursor-pointer font-medium">
                    전체 동의
                  </Label>
                </div>

                <div className="flex items-center space-x-2 pl-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="terms" className="cursor-pointer text-sm flex-1">
                    <span className="text-red-500">*</span> 이용약관 동의 (필수)
                  </Label>
                  <button
                    type="button"
                    onClick={() => setTermsDialogOpen(true)}
                    className="text-xs text-gray-500 hover:text-blue-600 underline flex items-center gap-0.5"
                  >
                    보기
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center space-x-2 pl-3">
                  <Checkbox
                    id="privacy"
                    checked={agreedToPrivacy}
                    onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="privacy" className="cursor-pointer text-sm flex-1">
                    <span className="text-red-500">*</span> 개인정보 처리방침 및 수집·이용 동의 (필수)
                  </Label>
                  <button
                    type="button"
                    onClick={() => setPrivacyDialogOpen(true)}
                    className="text-xs text-gray-500 hover:text-blue-600 underline flex items-center gap-0.5"
                  >
                    보기
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center space-x-2 pl-3">
                  <Checkbox
                    id="marketing"
                    checked={agreedToMarketing}
                    onCheckedChange={(checked) => setAgreedToMarketing(checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="marketing" className="cursor-pointer text-sm flex-1">
                    마케팅 정보 수신 동의 (선택)
                  </Label>
                  <button
                    type="button"
                    onClick={() => setMarketingDialogOpen(true)}
                    className="text-xs text-gray-500 hover:text-blue-600 underline flex items-center gap-0.5"
                  >
                    보기
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                disabled={
                  isLoading ||
                  !agreedToTerms ||
                  !agreedToPrivacy ||
                  emailCheckStatus !== "available" ||
                  (REQUIRE_EMAIL_VERIFICATION && emailVerificationStatus !== "sent") ||
                  nicknameCheckStatus !== "available" ||
                  lastCheckedEmail !== email ||
                  (REQUIRE_EMAIL_VERIFICATION && lastVerificationEmail !== email) ||
                  lastCheckedNickname !== nickname
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    회원가입 중...
                  </>
                ) : (
                  "회원가입"
                )}
              </Button>

              <Button
                type="button"
                className="w-full h-12 rounded-xl text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                disabled={isGoogleLoading}
                onClick={handleGoogleSignup}
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Google 계정으로 가입 중...
                  </>
                ) : (
                  "Google 계정으로 가입"
                )}
              </Button>

              <div className="text-center text-sm pt-2">
                <span className="text-gray-600">이미 계정이 있으신가요? </span>
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                  로그인
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Terms of Service Dialog */}
        <Dialog open={termsDialogOpen} onOpenChange={setTermsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] rounded-3xl dark:bg-gray-800/95">
            <DialogHeader>
              <DialogTitle className="text-2xl">이용약관</DialogTitle>
              <DialogDescription>
                방가드 서비스 이용약관을 확인하세요
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4 text-sm leading-relaxed pb-6">
                <section>
                  <h3 className="font-bold text-base mb-2">제1조 (목적)</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    이 약관은 방가드(이하 "회사")가 제공하는 부동산 안전 플랫폼 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">제2조 (용어의 정의)</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    이 약관에서 사용하는 용어의 정의는 다음과 같습니다:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>"서비스"란 회사가 제공하는 계약서 분석, AI 챗봇 상담, 커뮤니티 등 모든 부동산 안전 관련 서비스를 의미합니다.</li>
                    <li>"회원"이란 회사와 서비스 이용계약을 체결하고 서비스를 이용하는 자를 말합니다.</li>
                    <li>"계약서 분석"이란 회원이 업로드한 부동산 계약서를 OCR 및 AI 기술로 분석하여 위험도를 평가하는 서비스를 말합니다.</li>
                    <li>"커뮤니티"란 회원 간 정보 공유 및 소통을 위한 게시판 서비스를 말합니다.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">제3조 (약관의 효력 및 변경)</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    1. 이 약관은 서비스를 이용하고자 하는 모든 회원에게 그 효력이 발생합니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 이 약관을 변경할 수 있습니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    3. 변경된 약관은 서비스 내 공지사항을 통해 공지하며, 공지 후 7일이 경과한 시점부터 효력이 발생합니다.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">제4조 (서비스의 제공)</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    회사는 회원에게 다음과 같은 서비스를 제공합니다:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>부동산 계약서 OCR 인식 및 AI 기반 위험도 분석</li>
                    <li>전세 계약 관련 권리 분석 및 시각화</li>
                    <li>RAG 기반 AI 챗봇을 통한 부동산 상담</li>
                    <li>회원 간 정보 공유 커뮤니티</li>
                    <li>부동산 안전 교육 콘텐츠</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">제5조 (회원의 의무)</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    1. 회원은 다음 행위를 하여서는 안 됩니다:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>허위 정보 등록 또는 타인의 정보 도용</li>
                    <li>회사의 서비스 운영을 방해하는 행위</li>
                    <li>타인의 명예를 훼손하거나 불이익을 주는 행위</li>
                    <li>법령 또는 이 약관이 금지하는 행위</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">제6조 (서비스의 중단)</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    회사는 컴퓨터 등 정보통신설비의 보수점검, 교체, 고장, 통신두절 등의 사유가 발생한 경우 서비스의 제공을 일시적으로 중단할 수 있습니다.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">제7조 (면책조항)</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    1. 회사가 제공하는 계약서 분석 및 AI 상담 서비스는 참고용 정보이며, 법적 자문이 아닙니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    2. 최종 계약 결정은 회원 본인의 판단과 책임 하에 이루어져야 하며, 회사는 이에 대한 법적 책임을 지지 않습니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    3. 회사는 천재지변, 전쟁, 불가항력적인 사유로 인한 서비스 제공 불가에 대하여 책임을 지지 않습니다.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">제8조 (분쟁해결)</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    회사와 회원 간 발생한 분쟁에 관한 소송은 대한민국 법령을 준거법으로 하며, 회사의 본사 소재지를 관할하는 법원을 전속 관할 법원으로 합니다.
                  </p>
                </section>

                <section className="pt-4 border-t dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    시행일: 2024년 1월 1일
                  </p>
                </section>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Privacy Policy Dialog */}
        <Dialog open={privacyDialogOpen} onOpenChange={setPrivacyDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] rounded-3xl dark:bg-gray-800/95">
            <DialogHeader>
              <DialogTitle className="text-2xl">개인정보 처리방침 및 수집·이용 동의</DialogTitle>
              <DialogDescription>
                방가드 개인정보처리방침 기준으로 개인정보 처리 내용을 안내합니다
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4 text-sm leading-relaxed pb-6">
                <section>
                  <h3 className="font-bold text-base mb-2">1. 개인정보 처리 목적과 원칙</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    방가드는 개인정보보호법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령을 준수하며, 서비스 제공과 이용자 보호에 필요한 범위에서 개인정보를 처리합니다.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>회사 운영에 필요한 공지사항 전달</li>
                    <li>이용문의 회신, 불만 처리 등 서비스 개선</li>
                    <li>계약서 분석, AI 상담, 커뮤니티 등 회사 서비스 제공</li>
                    <li>약관·법령 위반 및 부정 이용 방지와 제재</li>
                    <li>이벤트 및 행사 안내 등 마케팅 활용</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">2. 수집하는 개인정보 항목</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">회원가입 필수 항목:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                        <li>이메일 주소, 비밀번호, 이름, 닉네임, 휴대폰 번호</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">회원가입 선택 항목:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                        <li>대학교명</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">본인인증 및 이용 확인 항목:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                        <li>본인인증: 휴대폰 번호, 이메일 주소, 이름, 생년월일</li>
                        <li>서비스 이용 및 부정 이용 확인: 서비스 이용기록, 쿠키</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">3. 개인정보 수집 방법</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    회사는 다음 방식으로 개인정보를 수집합니다.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>이용자가 홈페이지 또는 앱 등 회사 서비스에 직접 입력하는 방식</li>
                    <li>회사가 발송한 이메일을 통해 이용자가 입력하는 방식</li>
                    <li>고객센터 상담, 게시판 활동 등 서비스 이용 과정에서 입력하는 방식</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">4. 개인정보의 제3자 제공</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 이용자가 사전에 공개하거나 제3자 제공에 동의한 경우 관련 법령 내에서 최소한으로 제공할 수 있으며, 법령에 의해 적법하게 강제되는 경우에는 동의 없이 제공될 수 있습니다.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">5. 개인정보의 보유 및 이용기간</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    회사는 개인정보 수집·이용 목적 달성을 위한 기간 동안 개인정보를 보유 및 이용합니다. 내부 방침에 따라 서비스 부정이용기록은 부정 가입 및 이용 방지를 위해 회원 탈퇴 시점으로부터 최대 1년간 보관할 수 있습니다.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                    <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                    <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                    <li>표시·광고에 관한 기록: 6개월</li>
                    <li>웹사이트 로그 기록 자료: 3개월</li>
                    <li>전자금융거래에 관한 기록: 5년</li>
                    <li>개인위치정보에 관한 기록: 6개월</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">6. 개인정보의 파기</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    개인정보 처리 목적 달성, 보유·이용기간 경과 등 개인정보가 필요하지 않게 된 경우 지체 없이 파기합니다. 전자적 파일은 재생할 수 없는 기술적 방법으로 삭제하고, 종이 문서는 분쇄 또는 소각합니다.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">7. 정보주체의 권리와 동의 철회</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    이용자 및 법정대리인은 언제든지 자신의 개인정보를 조회·수정하거나 개인정보 수집 동의 철회를 요청할 수 있습니다. 개인정보보호책임자 또는 담당자에게 서면, 전화, 전자우편으로 연락하면 회사는 지체 없이 조치합니다.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>개인정보 열람 요구</li>
                    <li>오류 등이 있을 경우 정정 요구 및 정정 완료 전 이용·제공 중지</li>
                    <li>삭제 요구</li>
                    <li>처리정지 요구</li>
                    <li>개인정보 수집 동의 철회</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">8. 광고성 정보 전송</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    회사는 영리목적의 광고성 정보를 전송하는 경우 이용자의 명시적인 사전 동의를 받습니다. 수신자가 수신거부 또는 동의 철회 의사를 표시한 경우 광고성 정보를 전송하지 않으며 처리 결과를 알립니다.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>광고성 정보에는 회사명, 연락처, 수신 거부 또는 동의 철회 방법을 표시합니다.</li>
                    <li>오후 9시부터 다음 날 오전 8시 사이 광고성 정보를 전송하는 경우 별도 사전 동의를 받습니다.</li>
                    <li>수신거부 회피·방해, 연락처 자동 생성·등록, 전송자 신원 은폐 등은 하지 않습니다.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">9. 아동의 개인정보 보호</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    회사는 만 14세 이상의 이용자에 한하여 회원가입을 허용합니다. 만 14세 미만 아동의 개인정보 수집·이용·제공이 필요한 경우 법정대리인의 동의를 받습니다.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">10. 쿠키의 설치·운영 및 거부</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    회사는 맞춤서비스 제공을 위해 쿠키를 사용할 수 있습니다. 이용자는 브라우저 설정을 통해 쿠키 허용, 확인, 차단을 선택할 수 있으며, 쿠키 저장을 거부할 경우 로그인이 필요한 일부 서비스 이용에 어려움이 있을 수 있습니다.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>Edge: 설정 &gt; 쿠키 및 사이트 권한 &gt; 쿠키 및 사이트 데이터 관리 및 삭제</li>
                    <li>Chrome: 설정 &gt; 개인정보 및 보안 &gt; 쿠키 및 기타 사이트 데이터</li>
                    <li>Whale: 설정 &gt; 개인정보 보호 &gt; 쿠키 및 기타 사이트 데이터</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">11. 개인정보 보호책임자</h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300">
                      성명: 홍길동<br />
                      직책: CTO<br />
                      전화번호: 000-0000-0000<br />
                      이메일: hello@banguard.com
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">12. 권익침해 구제방법</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>개인정보분쟁조정위원회: 1833-6972, www.kopico.go.kr</li>
                    <li>개인정보침해신고센터: 118, privacy.kisa.or.kr</li>
                    <li>대검찰청: 1301, www.spo.go.kr</li>
                    <li>경찰청: 182, ecrm.cyber.go.kr</li>
                    <li>중앙행정심판위원회: 110, www.simpan.go.kr</li>
                  </ul>
                </section>

                <section className="pt-4 border-t dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    시행일: 2026년 3월 16일
                  </p>
                </section>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Marketing Consent Dialog */}
        <Dialog open={marketingDialogOpen} onOpenChange={setMarketingDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] rounded-3xl dark:bg-gray-800/95">
            <DialogHeader>
              <DialogTitle className="text-2xl">마케팅 정보 수신 동의</DialogTitle>
              <DialogDescription>
                방가드의 다양한 혜택과 소식을 받아보세요 (선택)
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4 text-sm leading-relaxed pb-6">
                <section>
                  <h3 className="font-bold text-base mb-2">1. 광고성 정보 전송 동의</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    회사는 전자적 전송매체를 이용하여 영리목적의 광고성 정보를 전송하는 경우 이용자의 명시적인 사전 동의를 받습니다. 동의한 경우 다음과 같은 정보를 받을 수 있습니다:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>신규 서비스 및 기능 출시 안내</li>
                    <li>이벤트, 프로모션, 할인 혜택 정보</li>
                    <li>부동산 안전 관련 교육 콘텐츠</li>
                    <li>커뮤니티 인기 게시글 및 유용한 정보</li>
                    <li>서비스 개선을 위한 설문조사 및 의견 수렴</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">2. 수신 방법</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    마케팅 정보는 다음의 방법으로 제공될 수 있으며, 광고성 정보에는 회사명, 연락처, 수신 거부 또는 수신 동의 철회 방법을 표시합니다:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>이메일 (가입 시 등록한 이메일 주소)</li>
                    <li>앱 푸시 알림</li>
                    <li>서비스 내 공지사항</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">3. 수신 동의 철회</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    마케팅 정보 수신에 동의한 후에도 언제든지 수신을 거부하거나 동의를 철회할 수 있습니다. 회사는 수신거부 또는 동의 철회 의사가 표시된 경우 영리목적의 광고성 정보를 전송하지 않으며 처리 결과를 알립니다.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>마이페이지 &gt; 알림 설정에서 수신 거부</li>
                    <li>수신한 이메일 하단의 '수신거부' 링크 클릭</li>
                    <li>고객센터를 통한 수신 거부 요청</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    ※ 수신 동의 철회 시에도 회원 가입, 거래 관련 등 필수 정보는 계속 제공됩니다.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">4. 야간 광고성 정보 전송</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    오후 9시부터 그다음 날 오전 8시까지의 시간에 전자적 전송매체로 영리목적의 광고성 정보를 전송하는 경우 별도의 사전 동의를 받습니다.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">5. 개인정보 이용</h3>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg space-y-2">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">수집 항목:</span> 이메일 주소, 이름, 서비스 이용 기록
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">이용 목적:</span> 맞춤형 마케팅 정보 제공, 이벤트 안내
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">보유 기간:</span> 수신 동의 철회 시 또는 회원 탈퇴 시까지
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">6. 금지되는 전송 조치</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>수신거부 또는 수신동의 철회를 회피·방해하는 조치</li>
                    <li>수신자의 연락처를 자동 생성하거나 자동 등록하는 조치</li>
                    <li>광고 전송자의 신원이나 광고 전송 출처를 감추는 조치</li>
                    <li>수신자를 기망하여 회신을 유도하는 조치</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">7. 동의하지 않을 권리</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    마케팅 정보 수신은 선택사항입니다. 동의하지 않으셔도 서비스 이용에는 제한이 없으며, 다만 각종 이벤트 및 혜택 정보를 받으실 수 없습니다.
                  </p>
                </section>

                <section className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">💡 이런 혜택을 놓치지 마세요!</h4>
                  <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-300 ml-4 text-sm">
                    <li>신규 회원 전용 이벤트 및 쿠폰</li>
                    <li>부동산 전문가 무료 상담 기회</li>
                    <li>월간 부동산 안전 뉴스레터</li>
                    <li>조기 종료 가능한 한정 이벤트 안내</li>
                  </ul>
                </section>

                <section className="pt-4 border-t dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    개인정보처리방침 시행일: 2026년 3월 16일
                  </p>
                </section>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
