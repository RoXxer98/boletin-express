import { createContext, useContext, useMemo, useState } from "react";

export type Grade = {
  id: string;
  subject: string;
  score: number; // 0-10
  comment?: string;
  createdAt: number;
};

type AppData = {
  grades: Grade[];
  addGrade: (grade: Omit<Grade, "id" | "createdAt">) => void;
  deleteGrade: (id: string) => void;
};

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [grades, setGrades] = useState<Grade[]>([]);

  const addGrade: AppData["addGrade"] = (grade) => {
    const newGrade: Grade = {
      id: Math.random().toString(36).slice(2),
      createdAt: Date.now(),
      ...grade,
    };
    setGrades((prev) => [newGrade, ...prev]);
  };

  const deleteGrade: AppData["deleteGrade"] = (id) => {
    setGrades((prev) => prev.filter((g) => g.id !== id));
  };

  const value = useMemo(() => ({ grades, addGrade, deleteGrade }), [grades]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used inside AppDataProvider");
  return ctx;
}
