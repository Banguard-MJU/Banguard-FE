import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCurrentUserFromBackend, loginWithBackend, signupWithBackend } from "../lib/auth-api";
import { clearAuthTokens, getAccessToken } from "../lib/api";
import type { UserProfile } from "../data/profile";

const USER_STORAGE_KEY = "banguard_user";
const USERS_STORAGE_KEY = "banguard_users";

interface User {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  isAdmin?: boolean;
  createdAt: Date;
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, nickname: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (profile: {
    nickname?: string;
    age: number;
    income: string;
    region: UserProfile["region"];
    district?: string;
    university?: string;
  }) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toUserSession(userData: {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  isAdmin?: boolean;
  createdAt: string | Date;
  profile?: User["profile"];
}): User {
  return {
    id: userData.id,
    email: userData.email,
    name: userData.name,
    nickname: userData.nickname,
    isAdmin: userData.isAdmin,
    createdAt: new Date(userData.createdAt),
    profile: userData.profile,
  };
}

type StoredUserRecord = {
  id: string;
  email: string;
  password?: string;
  name: string;
  nickname?: string;
  isAdmin?: boolean;
  createdAt: string;
  profile?: User["profile"];
};

function readUsers(): Record<string, StoredUserRecord> {
  const usersData = localStorage.getItem(USERS_STORAGE_KEY);
  return usersData ? JSON.parse(usersData) : {};
}

function writeUsers(users: Record<string, StoredUserRecord>) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function persistSession(userData: User | null) {
  if (!userData) {
    localStorage.removeItem(USER_STORAGE_KEY);
    return;
  }

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const users = readUsers();
    let didSeedUsers = false;

    if (!users["demo@banguard.com"]) {
      users["demo@banguard.com"] = {
        id: "demo-user-001",
        email: "demo@banguard.com",
        password: "demo123",
        name: "데모 사용자",
        nickname: "방가드데모",
        isAdmin: false,
        createdAt: new Date().toISOString()
      };
      didSeedUsers = true;
    }

    if (!users["admin@banguard.com"]) {
      users["admin@banguard.com"] = {
        id: "admin-user-001",
        email: "admin@banguard.com",
        password: "admin123",
        name: "운영 관리자",
        nickname: "방가드운영",
        isAdmin: true,
        createdAt: new Date().toISOString()
      };
      didSeedUsers = true;
    }

    if (didSeedUsers) {
      writeUsers(users);
    }

    let isMounted = true;

    const restoreSession = async () => {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);

      if (getAccessToken()) {
        try {
          const backendUser = await getCurrentUserFromBackend();
          const savedUserData = savedUser ? toUserSession(JSON.parse(savedUser)) : null;
          const userData = toUserSession({
            ...backendUser,
            profile: savedUserData?.email === backendUser.email ? savedUserData.profile : undefined,
          });

          if (isMounted) {
            setUser(userData);
            persistSession(userData);
          }
          return;
        } catch (error) {
          clearAuthTokens();
        }
      }

      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          if (isMounted) {
            setUser(toUserSession(userData));
          }
        } catch (error) {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
    };

    restoreSession().finally(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await loginWithBackend(email, password);
      const userData = toUserSession(result.user);

      setUser(userData);
      persistSession(userData);

      return { success: true };
    } catch (error) {
      const backendError = error instanceof Error ? error.message : "로그인에 실패했습니다";

      // Keep locally seeded demo/admin accounts usable until backend seed data or OAuth exists.
      const localResult = loginWithLocalUser(email, password);
      if (localResult.success) {
        return localResult;
      }

      return { success: false, error: backendError };
    }
  };

  const loginWithLocalUser = (email: string, password: string): { success: boolean; error?: string } => {
    const users = readUsers();

    if (!users[email]) {
      return { success: false, error: "등록되지 않은 이메일입니다" };
    }

    if (users[email].password !== password) {
      return { success: false, error: "비밀번호가 일치하지 않습니다" };
    }

    const userData = toUserSession({
      id: users[email].id,
      email,
      name: users[email].name,
      nickname: users[email].nickname,
      isAdmin: users[email].isAdmin,
      createdAt: users[email].createdAt,
      profile: users[email].profile,
    });

    setUser(userData);
    persistSession(userData);

    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const googleUser: StoredUserRecord = {
      id: "google-user-001",
      email: "google@banguard.com",
      name: "Google 사용자",
      nickname: "google_user",
      isAdmin: false,
      createdAt: new Date().toISOString()
    };

    const users = readUsers();
    users[googleUser.email] = {
      ...users[googleUser.email],
      ...googleUser,
    };
    writeUsers(users);

    const userData = toUserSession(googleUser);
    setUser(userData);
    persistSession(userData);

    return { success: true };
  };

  const signup = async (email: string, password: string, name: string, nickname: string): Promise<{ success: boolean; error?: string }> => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "올바른 이메일 형식이 아닙니다" };
    }

    // Password validation
    if (password.length < 6) {
      return { success: false, error: "비밀번호는 6자 이상이어야 합니다" };
    }

    // Name validation
    if (name.length < 2) {
      return { success: false, error: "이름은 2자 이상이어야 합니다" };
    }

    if (nickname.trim().length < 2) {
      return { success: false, error: "닉네임은 2자 이상이어야 합니다" };
    }

    try {
      const result = await signupWithBackend({
        email,
        password,
        name,
        nickname,
      });

      if (result.success === false) {
        return { success: false, error: result.message || "회원가입에 실패했습니다" };
      }

      const newUser = {
        id: result.user?.id || Date.now().toString(),
        email: result.user?.email || email,
        password,
        name: result.user?.name || name,
        nickname: result.user?.nickname || nickname,
        isAdmin: false,
        createdAt: result.user?.createdAt || new Date().toISOString(),
      };

      const users = readUsers();
      users[newUser.email] = newUser;
      writeUsers(users);

      const userData = toUserSession(newUser);
      setUser(userData);
      persistSession(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "회원가입에 실패했습니다",
      };
    }
  };

  const logout = () => {
    clearAuthTokens();
    setUser(null);
    persistSession(null);
  };

  const updateProfile = async (profile: {
    nickname?: string;
    age: number;
    income: string;
    region: UserProfile["region"];
    district?: string;
    university?: string;
  }) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!user) {
      throw new Error("No user logged in");
    }

    const nextNickname = profile.nickname?.trim() || user.nickname;
    const updatedUser = {
      ...user,
      nickname: nextNickname,
      profile: {
        age: profile.age,
        income: profile.income,
        region: profile.region,
        district: profile.district,
        university: profile.university,
        profileCompleted: true,
      },
    };

    // Update localStorage users data
    const users = readUsers();
    
    if (users[user.email]) {
      users[user.email] = {
        ...users[user.email],
        nickname: nextNickname,
        profile: updatedUser.profile,
      };
      writeUsers(users);
    }

    // Update current session
    setUser(updatedUser);
    persistSession(updatedUser);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: !!user?.isAdmin,
    login,
    loginWithGoogle,
    signup,
    logout,
    updateProfile,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
