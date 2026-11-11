import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("triora_token");

    if (!token) {
      setLoading(false);
      return;
    }

    api.get("/auth/me")
      .then((response) => setUser(response.data.user))
      .catch(() => {
        localStorage.removeItem("triora_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });

    localStorage.setItem("triora_token", response.data.token);
    setUser(response.data.user);

    return response.data.user;
  };

  const register = async (formData) => {
    const response = await api.post("/auth/signup", formData);

    localStorage.setItem("triora_token", response.data.token);
    setUser(response.data.user);

    return response.data.user;
  };

  const logout = () => {
    localStorage.removeItem("triora_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}