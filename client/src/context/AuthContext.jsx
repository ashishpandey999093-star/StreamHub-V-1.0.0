import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCurrentUser()
      .then((response) => {
        setUser(response.data.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
 
  const login = async (payload) => {
  const response = await api.login(payload);
  const token = response.data.data.accessToken;
  localStorage.setItem("accessToken", token);
  setUser(response.data.data.user);
  return response.data;
};

  const register = async (formData) => {
    const response = await api.register(formData);
    return response.data;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}