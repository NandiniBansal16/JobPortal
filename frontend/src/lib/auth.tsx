import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "candidate" | "employer";

export type User = {
  name: string;
  email: string;
  role: Role;
  company?: string | undefined;
};

type AuthContextValue = {
  user: User | null;
  isCandidate: boolean;
  isEmployer: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const STORAGE_KEY = "jobportal.user";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Read after mount so SSR and hydration agree.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isCandidate: user?.role === "candidate",
      isEmployer: user?.role === "employer",
      login: (token: string, next: User) => {
        setUser(next);
        try {
          window.localStorage.setItem("jobportal.access_token", token);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
      },
      logout: () => {
        setUser(null);
        try {
          window.localStorage.removeItem("jobportal.access_token");
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export const NAV_LINKS: Record<"guest" | Role, { to: string; label: string }[]> = {
  guest: [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Browse jobs" },
  ],
  candidate: [
    { to: "/jobs", label: "Browse jobs" },
    { to: "/matched", label: "Matched for you" },
    { to: "/saved", label: "Saved jobs" },
    { to: "/dashboard", label: "My applications" },
    { to: "/profile", label: "Profile" },
  ],
  employer: [
    { to: "/jobs", label: "All jobs" },
    { to: "/jobs/new", label: "Post a job" },
    { to: "/dashboard", label: "My postings" },
    { to: "/company", label: "Company" },
  ],
};
