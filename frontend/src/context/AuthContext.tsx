import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  role: 'student' | 'company' | 'admin' | null;
  setAuth: (token: string, user: User, role: 'student' | 'company' | 'admin') => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [role, setRole] = useState<'student' | 'company' | 'admin' | null>(
    () => { const r = localStorage.getItem('role'); return (r === 'student' || r === 'company' || r === 'admin') ? r : null; }
  );
  const [isLoading, setIsLoading] = useState(true);

  function setAuth(newToken: string, newUser: User, newRole: 'student' | 'company' | 'admin') {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('role', newRole);
    setToken(newToken);
    setUser(newUser);
    setRole(newRole);
  }

  useEffect(() => {
    setIsLoading(false);
  }, []);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setToken(null);
    setUser(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, role, setAuth, logout, isAuthenticated: !!token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
