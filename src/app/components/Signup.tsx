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
import { checkEmailAvailability, checkNicknameAvailability } from "../lib/auth-api";

type CheckStatus = "idle" | "checking" | "available" | "unavailable";

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

    setEmailCheckStatus("checking");
    setEmailCheckMessage("");

    try {
      const result = await checkEmailAvailability(email);
      setEmailCheckStatus(result.available ? "available" : "unavailable");
      setEmailCheckMessage(
        result.message || (result.available ? "사용 가능한 이메일입니다" : "이미 사용 중인 이메일입니다")
      );
      setLastCheckedEmail(result.available ? email : "");
    } catch (error) {
      setEmailCheckStatus("unavailable");
      setEmailCheckMessage(error instanceof Error ? error.message : "이메일 중복확인에 실패했습니다");
      setLastCheckedEmail("");
    }
  };

  const handleCheckNickname = async () => {
    if (!nicknameRegex.test(nickname)) {
      setNicknameCheckStatus("unavailable");
      setNicknameCheckMessage("닉네임은 2~12자의 한글, 영문, 숫자, 밑줄만 사용할 수 있습니다");
      return;
    }

    setNicknameCheckStatus("checking");
    setNicknameCheckMessage("");

    try {
      const result = await checkNicknameAvailability(nickname);
      setNicknameCheckStatus(result.available ? "available" : "unavailable");
      setNicknameCheckMessage(
        result.message || (result.available ? "사용 가능한 닉네임입니다" : "이미 사용 중인 닉네임입니다")
      );
      setLastCheckedNickname(result.available ? nickname : "");
    } catch (error) {
      setNicknameCheckStatus("unavailable");
      setNicknameCheckMessage(error instanceof Error ? error.message : "닉네임 중복확인에 실패했습니다");
      setLastCheckedNickname("");
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

    if (lastCheckedEmail !== email || emailCheckStatus !== "available") {
      setError("이메일 중복확인을 완료해주세요");
      setIsLoading(false);
      return;
    }

    if (lastCheckedNickname !== nickname || nicknameCheckStatus !== "available") {
      setError("닉네임 중복확인을 완료해주세요");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다");
      setIsLoading(false);
      return;
    }

    const result = await signup(email, password, name.trim(), nickname.trim());

    if (result.success) {
      setIsLoading(false);
      toast.success("회원가입이 완료되었습니다!");
      navigate("/profile-setup");
    } else {
      setError(result.error || "회원가입에 실패했습니다");
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
      setError(result.error || "Google 회원가입에 실패했습니다");
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              방가드
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            안전한 주거를 위한 동반자
          </p>
        </div>

        <Card className="border-0 shadow-2xl rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
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
                <div className="flex gap-2">
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
                <div className="flex gap-2">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="6자 이상"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 h-12 rounded-xl border-2 focus:border-blue-300 transition-all"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>
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
                    <span className="text-red-500">*</span> 개인정보 수집 및 이용동의 (필수)
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
                  nicknameCheckStatus !== "available" ||
                  lastCheckedEmail !== email ||
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
              <DialogTitle className="text-2xl">개인정보 수집 및 이용동의</DialogTitle>
              <DialogDescription>
                방가드의 개인정보 수집 및 이용에 대한 안내입니다
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4 text-sm leading-relaxed pb-6">
                <section>
                  <h3 className="font-bold text-base mb-2">1. 개인정보의 수집 및 이용 목적</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>회원 가입 및 관리: 회원 자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지</li>
                    <li>서비스 제공: 계약서 분석, AI 챗봇 상담, 커뮤니티 서비스 제공</li>
                    <li>마케팅 및 광고 활용: 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">2. 수집하는 개인정보 항목</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">필수 항목:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                        <li>이름, 이메일 주소, 비밀번호</li>
                        <li>서비스 이용 기록, IP 주소, 쿠키, 접속 로그</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">선택 항목:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                        <li>나이, 거주 지역, 관심사</li>
                        <li>업로드한 계약서 파일 (OCR 분석용)</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">3. 개인정보의 보유 및 이용기간</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>회원 탈퇴 시까지 (단, 관계 법령에 따라 보존 필요 시 해당 기간까지 보관)</li>
                    <li>계약서 분석 데이터: 분석 완료 후 30일</li>
                    <li>부정 이용 방지를 위한 기록: 6개월</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">4. 개인정보의 제3자 제공</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>이용자가 사전에 동의한 경우</li>
                    <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">5. 개인정보 처리의 위탁</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    회사는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300">
                      수탁업체: AWS (Amazon Web Services)<br />
                      위탁업무: 클라우드 서버 호스팅, 데이터 저장
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">6. 정보주체의 권리·의무 및 행사방법</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    정보주체는 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>개인정보 열람 요구</li>
                    <li>오류 등이 있을 경우 정정 요구</li>
                    <li>삭제 요구</li>
                    <li>처리정지 요구</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">7. 개인정보의 안전성 확보조치</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                    <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육</li>
                    <li>기술적 조치: 개인정보처리시스템 접근권한 관리, 접속기록 보관, 암호화, 보안프로그램 설치</li>
                    <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-base mb-2">8. 개인정보 보호책임자</h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300">
                      성명: 방가드 개인정보보호팀<br />
                      이메일: privacy@banguard.com<br />
                      전화: 02-1234-5678
                    </p>
                  </div>
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
                  <h3 className="font-bold text-base mb-2">1. 마케팅 정보 수신 목적</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    회사는 고객에게 더 나은 서비스와 혜택을 제공하기 위해 다음과 같은 마케팅 정보를 전송합니다:
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
                    마케팅 정보는 다음의 방법으로 제공됩니다:
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
                    마케팅 정보 수신에 동의하신 후에도 언제든지 다음의 방법으로 수신을 거부하실 수 있습니다:
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
                  <h3 className="font-bold text-base mb-2">4. 개인정보 이용</h3>
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
                  <h3 className="font-bold text-base mb-2">5. 동의하지 않을 권리</h3>
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
                    시행일: 2024년 1월 1일
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
