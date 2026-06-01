import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { AnalysisHistory } from "../data/dashboard";
import { useAuth } from "./AuthContext";

const MAX_HISTORY_ENTRIES = 50;

interface AnalysisHistoryContextType {
  history: AnalysisHistory[];
  addAnalysis: (item: AnalysisHistory) => void;
  removeAnalysis: (id: string) => void;
}

const AnalysisHistoryContext = createContext<AnalysisHistoryContextType | undefined>(undefined);

export function AnalysisHistoryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [history, setHistory] = useState<AnalysisHistory[]>([]);

  // 사용자 전환(로그아웃/로그인) 시 이전 사용자의 분석 이력이 새 사용자에게 노출되지 않도록 비움.
  useEffect(() => {
    setHistory([]);
  }, [userId]);

  const addAnalysis = useCallback((item: AnalysisHistory) => {
    setHistory((prev) => [item, ...prev].slice(0, MAX_HISTORY_ENTRIES));
  }, []);

  const removeAnalysis = useCallback((id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  return (
    <AnalysisHistoryContext.Provider value={{ history, addAnalysis, removeAnalysis }}>
      {children}
    </AnalysisHistoryContext.Provider>
  );
}

export function useAnalysisHistory() {
  const ctx = useContext(AnalysisHistoryContext);
  if (!ctx) {
    throw new Error("useAnalysisHistory must be used within an AnalysisHistoryProvider");
  }
  return ctx;
}
