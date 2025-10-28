import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // restore token on page reload
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  // fetch current user
  const { data: user, refetch, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      if (!token) return null;
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.setItem("user", JSON.stringify(res.data));
        return res.data;
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        logout(); // token invalid
        return null;
      }
    },
    enabled: !!token,
  });

  const signup = async (username, email, password) => {
    try {
      await axios.post("http://localhost:5000/api/auth/signup", { username, email, password });
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setToken(res.data.token);
      queryClient.setQueryData(["currentUser"], res.data.user);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    queryClient.setQueryData(["currentUser"], null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signup, login, logout, refetchUser: refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
