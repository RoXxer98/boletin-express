import { createContext, useContext, useMemo, useState, useEffect } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useAuth } from "../auth/AuthContext";

export type Grade = {
  id: string;
  subject: string;
  score: number; // 0-10
  comment?: string;
  createdAt: number;
  teacherUid?: string | null;
};

export type AttendanceStatus = "present" | "late" | "absent";

export type Attendance = {
  id: string;
  date: string; // "YYYY-MM-DD"
  status: AttendanceStatus;
  note?: string;
  createdAt: number;
  teacherUid?: string | null;
};

type AppData = {
  grades: Grade[];
  addGrade: (grade: Omit<Grade, "id" | "createdAt">) => Promise<void>;
  deleteGrade: (id: string) => Promise<void>;

  attendance: Attendance[];
  addAttendance: (item: Omit<Attendance, "id" | "createdAt">) => Promise<void>;
  deleteAttendance: (id: string) => Promise<void>;
};

const AppDataContext = createContext<AppData | null>(null);

// ✅ Helper: elimina keys con undefined (Firestore odia undefined)
function omitUndefined<T extends Record<string, any>>(obj: T) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out as T;
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { role, linkedTeacherUid } = useAuth();

  const [grades, setGrades] = useState<Grade[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  const uid = auth.currentUser?.uid ?? null;

  const effectiveTeacherUid =
    role === "teacher" ? uid : role === "parent" ? linkedTeacherUid : null;

  // ✅ GRADES realtime (Firestore) filtrado por teacherUid según rol
  useEffect(() => {
    if (!effectiveTeacherUid) {
      setGrades([]);
      return;
    }

    const qy = query(
      collection(db, "grades"),
      where("teacherUid", "==", effectiveTeacherUid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(qy, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as Grade[];
      setGrades(list);
    });

    return () => unsub();
  }, [effectiveTeacherUid]);

  // ✅ addGrade guarda teacherUid del usuario actual (profe)
  const addGrade: AppData["addGrade"] = async (grade) => {
    const teacherUid = auth.currentUser?.uid ?? null;

    const payload = omitUndefined({
      ...grade,
      teacherUid,
      createdAt: Date.now(),
    });

    await addDoc(collection(db, "grades"), payload);
  };

  const deleteGrade: AppData["deleteGrade"] = async (id) => {
    await deleteDoc(doc(db, "grades", id));
  };

  // ✅ ATTENDANCE realtime (Firestore) filtrado por teacherUid según rol
  useEffect(() => {
    if (!effectiveTeacherUid) {
      setAttendance([]);
      return;
    }

    const qy = query(
      collection(db, "attendance"),
      where("teacherUid", "==", effectiveTeacherUid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(qy, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as Attendance[];
      setAttendance(list);
    });

    return () => unsub();
  }, [effectiveTeacherUid]);

  // ✅ addAttendance guarda teacherUid del usuario actual (profe)
  const addAttendance: AppData["addAttendance"] = async (item) => {
    const teacherUid = auth.currentUser?.uid ?? null;

    const payload = omitUndefined({
      ...item,
      teacherUid,
      createdAt: Date.now(),
    });

    await addDoc(collection(db, "attendance"), payload);
  };

  const deleteAttendance: AppData["deleteAttendance"] = async (id) => {
    await deleteDoc(doc(db, "attendance", id));
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
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used inside AppDataProvider");
  return ctx;
}
