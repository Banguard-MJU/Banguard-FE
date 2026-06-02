import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useAuth } from "../contexts/AuthContext";
import { getDisplayErrorMessage } from "../lib/error-message";

function readOAuthParams() {
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));

  return {
    accessToken: search.get("access_token") || hash.get("access_token"),
    refreshToken: search.get("refresh_token") || hash.get("refresh_token"),
    tokenType: search.get("token_type") || hash.get("token_type") || "bearer",
    isNewUser: (search.get("is_new_user") || hash.get("is_new_user")) === "true",
    error: search.get("error") || hash.get("error"),
  };
}

export function GoogleOAuthCallback() {
  const navigate = useNavigate();
  const { completeGoogleLogin } = useAuth();
  const params = useMemo(readOAuthParams, []);
  const [error, setError] = useState(params.error || "");

  useEffect(() => {
    let isMounted = true;

    async function completeLogin() {
      if (params.error) {
        return;
      }

      if (!params.accessToken) {
        setError("Google 로그인 토큰을 확인할 수 없습니다.");
        return;
      }

      try {
        await completeGoogleLogin({
          access_token: params.accessToken,
          refresh_token: params.refreshToken,
          token_type: params.tokenType,
        });

        if (!isMounted) {
          return;
        }

        toast.success("Google 계정으로 로그인되었습니다.");
        navigate(params.isNewUser ? "/profile-setup" : "/", { replace: true });
      } catch (loginError) {
        if (isMounted) {
          setError(getDisplayErrorMessage(loginError, "Google 로그인 처리에 실패했습니다."));
        }
      }
    }

    completeLogin();

    return () => {
      isMounted = false;
    };
  }, [completeGoogleLogin, navigate, params]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 px-4 py-8 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30">
      <Card className="w-full max-w-md rounded-2xl border-0 bg-white/85 shadow-2xl backdrop-blur-sm dark:bg-gray-800/85">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-500/25">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <CardTitle>Google 로그인</CardTitle>
          <CardDescription>
            {error ? "로그인을 완료하지 못했습니다." : "Google 계정 정보를 확인하고 있습니다."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <>
              <Alert variant="destructive" className="rounded-xl">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Button className="h-12 w-full rounded-xl" onClick={() => navigate("/login", { replace: true })}>
                로그인으로 돌아가기
              </Button>
            </>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
              <Loader2 className="h-4 w-4 animate-spin" />
              로그인 처리 중...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
