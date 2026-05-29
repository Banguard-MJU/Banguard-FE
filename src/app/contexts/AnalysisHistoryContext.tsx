import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { AnalysisHistory } from "../data/dashboard";

interface AnalysisHistoryContextType {
  history: AnalysisHistory[];
  addAnalysis: (item: AnalysisHistory) => void;
  removeAnalysis: (id: string) => void;
  clearHistory: () => void;
}

const AnalysisHistoryContext = createContext<AnalysisHistoryContextType | undefined>(undefined);

export function AnalysisHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<AnalysisHistory[]>([]);

  const addAnalysis = useCallback((item: AnalysisHistory) => {
    setHistory((prev) => [item, ...prev]);
  }, []);

  const removeAnalysis = useCallback((id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return (
    <AnalysisHistoryContext.Provider value={{ history, addAnalysis, removeAnalysis, clearHistory }}>
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
