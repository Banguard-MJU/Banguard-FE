import { Navigate, Outlet, useLocation } from "react-router";
import { Navigation } from "./Navigation";
import { NewPolicyPopup } from "./NewPolicyPopup";
import { useAuth } from "../contexts/AuthContext";

const ONBOARDING_SESSION_KEY = "banguard_onboarding_seen_session";

export function Root() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        로딩 중...
      </div>
    );
  }

  if (!isAuthenticated) {
    const hasSeenOnboardingThisSession = sessionStorage.getItem(ONBOARDING_SESSION_KEY);

    if (!hasSeenOnboardingThisSession) {
      return (
        <Navigate
          to="/onboarding"
          replace
          state={{ from: `${location.pathname}${location.search}${location.hash}` }}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30">
      <Navigation />
      <main className="app-bottom-safe">
        <Outlet />
      </main>
      {isAuthenticated && <NewPolicyPopup />}
    </div>
  );
}
