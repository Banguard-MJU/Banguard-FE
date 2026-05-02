import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Shield, FileText, MessageSquare, BarChart3, LogOut, UserCircle, Users, Moon, Sun, Menu, Settings, BookOpen, Building2, Star } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "./ui/sheet";
import { toast } from "sonner";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logout();
    toast.success("로그아웃되었습니다");
    navigate("/");
  };

  // Don't show navigation on auth pages or the dedicated chatbot surface
  if (
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/profile-setup" ||
    location.pathname.startsWith("/chatbot")
  ) {
    return null;
  }

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const mobileNavItems = [
    { path: "/", label: "홈", icon: Shield },
    { path: "/contract-analysis", label: "분석", icon: FileText },
    { path: "/chatbot", label: "상담", icon: MessageSquare },
    { path: "/listings", label: "매물", icon: Building2 },
    { path: "/community", label: "커뮤니티", icon: Users },
  ];

  return (
    <>
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 shadow-sm">
        <div className="app-shell-wide">
          <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl w-9 h-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                      방가드
                    </span>
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    메인 내비게이션 메뉴
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-2">
                  <Button
                    onClick={() => handleMenuItemClick("/contract-analysis")}
                    variant={isActive("/contract-analysis") ? "default" : "ghost"}
                    className="w-full justify-start gap-3 rounded-xl h-12"
                  >
                    <FileText className="w-5 h-5" />
                    <span>계약서 분석</span>
                  </Button>

                  <Button
                    onClick={() => handleMenuItemClick("/chatbot")}
                    variant={isActive("/chatbot") ? "default" : "ghost"}
                    className="w-full justify-start gap-3 rounded-xl h-12"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>AI 상담</span>
                  </Button>

                  <Button
                    onClick={() => handleMenuItemClick("/listings")}
                    variant={isActive("/listings") ? "default" : "ghost"}
                    className="w-full justify-start gap-3 rounded-xl h-12"
                  >
                    <Building2 className="w-5 h-5" />
                    <span>매물 탐색</span>
                  </Button>

                  <Button
                    onClick={() => handleMenuItemClick("/reviews")}
                    variant={isActive("/reviews") ? "default" : "ghost"}
                    className="w-full justify-start gap-3 rounded-xl h-12"
                  >
                    <Star className="w-5 h-5" />
                    <span>거주지 리뷰</span>
                  </Button>

                  <Button
                    onClick={() => handleMenuItemClick("/community")}
                    variant={isActive("/community") ? "default" : "ghost"}
                    className="w-full justify-start gap-3 rounded-xl h-12"
                  >
                    <Users className="w-5 h-5" />
                    <span>커뮤니티</span>
                  </Button>

                  <Button
                    onClick={() => handleMenuItemClick("/policy")}
                    variant={isActive("/policy") ? "default" : "ghost"}
                    className="w-full justify-start gap-3 rounded-xl h-12"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>정책 정보</span>
                  </Button>

                  {isAuthenticated && (
                    <>
                      <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>

                      <Button
                        onClick={() => handleMenuItemClick("/dashboard")}
                        variant={isActive("/dashboard") ? "default" : "ghost"}
                        className="w-full justify-start gap-3 rounded-xl h-12"
                      >
                        <BarChart3 className="w-5 h-5" />
                        <span>대시보드</span>
                      </Button>

                      <Button
                        onClick={() => handleMenuItemClick("/settings")}
                        variant={isActive("/settings") ? "default" : "ghost"}
                        className="w-full justify-start gap-3 rounded-xl h-12"
                      >
                        <Settings className="w-5 h-5" />
                        <span>계정 설정</span>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                방가드
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">

            {/* Theme Toggle Button */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="rounded-xl w-9 h-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              title={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
            </Button>

            <div className="ml-1 pl-1 sm:ml-2 sm:pl-2 border-l border-gray-300 dark:border-gray-600">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 rounded-xl border-2 px-2 hover:border-blue-300 hover:bg-blue-50 transition-all sm:px-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <UserCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="hidden sm:inline">{user?.nickname || user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl border-2">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.nickname || user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard")} className="rounded-lg cursor-pointer">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      대시보드
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/policy")} className="rounded-lg cursor-pointer">
                      <BookOpen className="w-4 h-4 mr-2" />
                      정책 정보
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/listings")} className="rounded-lg cursor-pointer">
                      <Building2 className="w-4 h-4 mr-2" />
                      매물 탐색
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/reviews")} className="rounded-lg cursor-pointer">
                      <Star className="w-4 h-4 mr-2" />
                      거주지 리뷰
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")} className="rounded-lg cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      계정 설정
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/admin")} className="rounded-lg cursor-pointer">
                        <Shield className="w-4 h-4 mr-2" />
                        관리자 콘솔
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="rounded-lg cursor-pointer text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={() => navigate("/login")} 
                  variant="outline"
                  size="sm" 
                  className="rounded-xl h-8 px-4 text-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all"
                >
                  로그인
                </Button>
              )}
            </div>
          </div>
          </div>
        </div>
      </nav>

      <nav
        aria-label="모바일 주요 메뉴"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200/70 bg-white/92 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-gray-800/70 dark:bg-gray-950/92 md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-semibold transition ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-gray-500 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-blue-300"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="max-w-full truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
