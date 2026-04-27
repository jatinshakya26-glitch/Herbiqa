import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, type AuthUser } from "./api";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signin: (email: string, password: string) => Promise<AuthUser>;
  signup: (email: string, password: string, name: string) => Promise<AuthUser>;
  signout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const { user } = await api.me();
      setUser(user);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  async function signin(email: string, password: string): Promise<AuthUser> {
    const { user } = await api.login({ email, password });
    setUser(user);
    return user;
  }

  async function signup(
    email: string,
    password: string,
    name: string,
  ): Promise<AuthUser> {
    const { user } = await api.signup({ email, password, name });
    setUser(user);
    return user;
  }

  async function signout() {
    await api.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, refresh, signin, signup, signout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
