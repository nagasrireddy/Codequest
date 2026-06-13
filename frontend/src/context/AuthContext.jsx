import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("cq_token"));
  const [loading, setLoading] = useState(true);

  // On first load, if a token exists, fetch the current user
  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const { data } = await authService.getMe();
          setUser(data.user);
        } catch {
          localStorage.removeItem("cq_token");
          setToken(null);
        }
      }
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (newToken, userData) => {
    localStorage.setItem("cq_token", newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("cq_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);