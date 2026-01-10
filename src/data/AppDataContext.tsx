import { createContext, useContext, useMemo, useState } from "react";

export type Grade = {
  id: string;
  subject: string;
  score: number; // 0-10
  comment?: string;
  createdAt: number;
};

export type AttendanceStatus = "present" | "late" | "absent";

export type Attendance = {
  id: string;
  date: string; // "YYYY-MM-DD"
  status: AttendanceStatus;
  note?: string;
  createdAt: number;
};

type AppData = {
  grades: Grade[];
  addGrade: (grade: Omit<Grade, "id" | "createdAt">) => void;
  deleteGrade: (id: string) => void;

  attendance: Attendance[];
  addAttendance: (item: Omit<Attendance, "id" | "createdAt">) => void;
  deleteAttendance: (id: string) => void;
};

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

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

  const addAttendance: AppData["addAttendance"] = (item) => {
    const newItem: Attendance = {
      id: Math.random().toString(36).slice(2),
      createdAt: Date.now(),
      ...item,
    };
    setAttendance((prev) => [newItem, ...prev]);
  };

  const deleteAttendance: AppData["deleteAttendance"] = (id) => {
    setAttendance((prev) => prev.filter((a) => a.id !== id));
  };

  const value = useMemo(
    () => ({
      grades,
      addGrade,
      deleteGrade,
      attendance,
      addAttendance,
      deleteAttendance,
    }),
    [grades, attendance]
  );

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used inside AppDataProvider");
  return ctx;
}
