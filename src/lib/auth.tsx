"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseClients } from "./firebase";

export type AppUser = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  role: "citizen" | "officer" | "admin";
  subscriptionActive?: boolean;
};

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { auth, db } = getFirebaseClients();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      async (firebaseUser: User | null) => {
        if (!firebaseUser) {
          setUser(null);
          setLoading(false);
          return;
        }
        try {
          const ref = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(ref);
          const data = snap.exists() ? snap.data() : {};
          const role = (data?.role as AppUser["role"]) || "citizen";
          const subscriptionActive = Boolean(data?.subscriptionActive);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role,
            subscriptionActive,
          });
        } catch (e) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: "citizen",
            subscriptionActive: false,
          });
        } finally {
          setLoading(false);
        }
      }
    );
    return () => unsub();
  }, [auth, db]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signOutUser: () => signOut(auth),
    }),
    [user, loading, auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
