import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { Root } from "./components/Root";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AnalysisHistoryProvider } from "./contexts/AnalysisHistoryContext";
import { Outlet } from "react-router";

const Home = lazy(() => import("./components/Home").then((module) => ({ default: module.Home })));
const ContractAnalysis = lazy(() => import("./components/ContractAnalysis").then((module) => ({ default: module.ContractAnalysis })));
const Chatbot = lazy(() => import("./components/Chatbot").then((module) => ({ default: module.Chatbot })));
const Dashboard = lazy(() => import("./components/Dashboard"));
const PolicyExplorer = lazy(() => import("./components/PolicyExplorer").then((module) => ({ default: module.PolicyExplorer })));
const ListingsExplorer = lazy(() => import("./components/ListingsExplorer").then((module) => ({ default: module.ListingsExplorer })));
const ResidenceReviews = lazy(() => import("./components/ResidenceReviews").then((module) => ({ default: module.ResidenceReviews })));
const Community = lazy(() => import("./components/Community").then((module) => ({ default: module.Community })));
const Login = lazy(() => import("./components/Login").then((module) => ({ default: module.Login })));
const Signup = lazy(() => import("./components/Signup").then((module) => ({ default: module.Signup })));
const GoogleOAuthCallback = lazy(() => import("./components/GoogleOAuthCallback").then((module) => ({ default: module.GoogleOAuthCallback })));
const Onboarding = lazy(() => import("./components/Onboarding").then((module) => ({ default: module.Onboarding })));
const ProfileSetup = lazy(() => import("./components/ProfileSetup").then((module) => ({ default: module.ProfileSetup })));
const Settings = lazy(() => import("./components/Settings").then((module) => ({ default: module.Settings })));
const AdminConsole = lazy(() => import("./components/AdminConsole").then((module) => ({ default: module.AdminConsole })));

function withSuspense(element: ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex items-center justify-center text-sm text-gray-500">
          로딩 중...
        </div>
      }
    >
      {element}
    </Suspense>
  );
}

function AuthLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AnalysisHistoryProvider>
          <Outlet />
        </AnalysisHistoryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AdminRoute() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center text-sm text-gray-500">
        로딩 중...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <AdminConsole />;
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/onboarding",
        element: withSuspense(<Onboarding />),
      },
      {
        path: "/",
        element: <Root />,
        children: [
          { index: true, element: withSuspense(<Home />) },
          { path: "contract-analysis", element: withSuspense(<ContractAnalysis />) },
          { path: "chatbot", element: withSuspense(<Chatbot />) },
          { path: "dashboard", element: withSuspense(<Dashboard />) },
          { path: "policy", element: withSuspense(<PolicyExplorer />) },
          { path: "listings", element: withSuspense(<ListingsExplorer />) },
          { path: "reviews", element: withSuspense(<ResidenceReviews />) },
          { path: "community", element: withSuspense(<Community />) },
          { path: "community/:postId", element: withSuspense(<Community />) },
          { path: "login", element: withSuspense(<Login />) },
          { path: "signup", element: withSuspense(<Signup />) },
          { path: "auth/google/callback", element: withSuspense(<GoogleOAuthCallback />) },
          { path: "profile-setup", element: withSuspense(<ProfileSetup />) },
          { path: "profile", element: <Navigate to="/settings" replace /> },
          { path: "settings", element: withSuspense(<Settings />) },
          { path: "admin", element: withSuspense(<AdminRoute />) },
        ],
      },
    ],
  },
]);
