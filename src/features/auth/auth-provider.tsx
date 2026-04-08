"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

type AuthUser = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const USERS_KEY = "life-dashboard-users";
const TOKEN_KEY = "life-dashboard-token";
const USER_KEY = "life-dashboard-user";

const AuthContext = createContext<AuthContextType | null>(null);

function createMockToken(email: string) {
  return btoa(`${email}:${Date.now()}`);
}

type StoredUser = AuthUser & { password: string };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [boot] = useState(() => {
    if (typeof window === "undefined") {
      return { user: null as AuthUser | null, token: null as string | null };
    }
    const storedToken = sessionStorage.getItem(TOKEN_KEY);
    const storedUser = sessionStorage.getItem(USER_KEY);
    return {
      token: storedToken,
      user: storedUser ? (JSON.parse(storedUser) as AuthUser) : null,
    };
  });
  const [user, setUser] = useState<AuthUser | null>(boot.user);
  const [token, setToken] = useState<string | null>(boot.token);
  const initialized = true;
  const router = useRouter();

  const login = useCallback(async (email: string, password: string) => {
    const users = JSON.parse(
      localStorage.getItem(USERS_KEY) ?? "[]",
    ) as StoredUser[];
    const found = users.find((entry) => entry.email === email);
    if (!found || found.password !== password) {
      throw new Error("E-mail ou senha inválidos.");
    }

    const authUser = { name: found.name, email: found.email };
    const nextToken = createMockToken(email);

    sessionStorage.setItem(TOKEN_KEY, nextToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(authUser));
    setUser(authUser);
    setToken(nextToken);
    router.push("/");
  }, [router]);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const users = JSON.parse(
        localStorage.getItem(USERS_KEY) ?? "[]",
      ) as StoredUser[];
      if (users.some((entry) => entry.email === email)) {
        throw new Error("E-mail já cadastrado.");
      }

      users.push({ name, email, password });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      await login(email, password);
    },
    [login],
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({ user, token, initialized, login, register, logout }),
    [initialized, login, logout, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro do AuthProvider.");
  }
  return context;
}
