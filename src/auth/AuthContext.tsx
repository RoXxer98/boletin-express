import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";

export type Role = "teacher" | "parent";

type AuthState = {
  user: User | null;
  role: Role | null;
  linkedTeacherUid: string | null;

  teacherCode: string | null;
  refreshTeacherCode: () => Promise<void>;

  loading: boolean;
  logout: () => Promise<void>;

  setRoleForUser: (role: Role) => Promise<void>;
  linkToTeacher: (code: string) => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

function makeCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [linkedTeacherUid, setLinkedTeacherUid] = useState<string | null>(null);

  const [teacherCode, setTeacherCode] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const loadProfile = async (u: User) => {
    const ref = doc(db, "users", u.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data() as { role?: Role; linkedTeacherUid?: string; teacherCode?: string };
      setRole((data.role ?? null) as Role | null);
      setLinkedTeacherUid(data.linkedTeacherUid ?? null);
      setTeacherCode(data.teacherCode ?? null);
    } else {
      setRole(null);
      setLinkedTeacherUid(null);
      setTeacherCode(null);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (!u) {
        setRole(null);
        setLinkedTeacherUid(null);
        setTeacherCode(null);
        setLoading(false);
        return;
      }

      await loadProfile(u);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const setRoleForUser = async (newRole: Role) => {
    const u = auth.currentUser;
    if (!u) return;

    await setDoc(
      doc(db, "users", u.uid),
      { role: newRole, email: u.email ?? null, updatedAt: Date.now() },
      { merge: true }
    );

    setRole(newRole);

    // si es profe, asegúrate de tener código
    if (newRole === "teacher") {
      await refreshTeacherCode();
    }
  };

  const refreshTeacherCode = async () => {
    const u = auth.currentUser;
    if (!u) return;

    const ref = doc(db, "users", u.uid);
    const snap = await getDoc(ref);
    const data = snap.exists() ? (snap.data() as any) : {};

    if (data.teacherCode) {
      setTeacherCode(String(data.teacherCode));
      return;
    }

    const newCode = makeCode(6);
    await setDoc(ref, { teacherCode: newCode }, { merge: true });
    setTeacherCode(newCode);
  };

  // Si ya está logueado como teacher y no hay código en state, lo genera
  useEffect(() => {
    if (role === "teacher" && user && !teacherCode) {
      refreshTeacherCode();
    }
    if (role !== "teacher") {
      setTeacherCode(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, user]);

  const linkToTeacher = async (code: string) => {
    const u = auth.currentUser;
    if (!u) return;

    const clean = code.trim().toUpperCase();
    if (clean.length < 4) throw new Error("Código inválido");

    const q = query(collection(db, "users"), where("teacherCode", "==", clean));
    const snap = await getDocs(q);

    if (snap.empty) throw new Error("Código inválido");

    const teacherDoc = snap.docs[0];
    const teacherUid = teacherDoc.id;

    await setDoc(doc(db, "users", u.uid), { linkedTeacherUid: teacherUid, updatedAt: Date.now() }, { merge: true });
    setLinkedTeacherUid(teacherUid);

    // recargar perfil (por si el doc tiene más cosas)
    await loadProfile(u);
  };

  const value = useMemo(
    () => ({
      user,
      role,
      linkedTeacherUid,
      teacherCode,
      refreshTeacherCode,
      loading,
      logout,
      setRoleForUser,
      linkToTeacher,
    }),
    [user, role, linkedTeacherUid, teacherCode, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
