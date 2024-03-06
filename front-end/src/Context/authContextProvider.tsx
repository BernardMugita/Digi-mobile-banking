import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { Login } from "./authApi";
import { AxiosError } from "axios";

interface User {
  success: boolean;
  token: string;
}

type Props = {
  children: React.ReactNode;
};

export const AuthContextProvider = (props: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setLoading,
    error,
    setError,
  };

  const handleLogin = async (username: string, pin: string) => {
    try {
      setLoading(true);
      const loginResponse = await Login(username, pin);
      if (!loginResponse) {
        setError("error: ");
      } else {
        setTimeout(() => {
          setIsAuthenticated(true);
          setUser(loginResponse);
          localStorage.setItem("token", JSON.stringify(loginResponse.token));
        }, 4000);
      }
      setLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(axiosError.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const loggedinUser = localStorage.getItem("user");
      if (loggedinUser) {
        setUser(JSON.parse(loggedinUser));
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ ...value, handleLogin, handleLogout }}>
      {props.children}
    </AuthContext.Provider>
  );
};
