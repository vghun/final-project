import { createContext, useContext, useState, useEffect } from "react";
import { AuthAPI } from "~/apis/AuthAPI";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // Load dữ liệu từ localStorage khi app khởi chạy
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedUser && storedAccessToken && storedRefreshToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
    }
  }, []);

  // LOGIN
  const login = (userData, newAccessToken, newRefreshToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    setUser(userData);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
  };

  // LOGOUT
  const logout = async () => {
    try {
      if (refreshToken) {
        await AuthAPI.logout({ refreshToken }); // <-- phải là object
      }
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        setUser,
        isLogin: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
