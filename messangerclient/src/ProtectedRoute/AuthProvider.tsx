import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import type {
  User,
  AuthContextType,
  AuthProviderProps,
  UserInfoResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
} from "../Service/interface";
import { _get, _post } from "../Service/axios";
import {
  GET_USER_INFO,
  LOGIN_ENDPOINT,
  LOGOUT_ENDPOINT,
} from "../Service/useApiService";

//create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<number>(0);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      setLoadingAuth(true);
      const { data } = await _get<UserInfoResponse>(GET_USER_INFO);
      setUser(data?.user || null);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
      setIsAuthenticated(0);
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [isAuthenticated]);

  const handleLogin = async (payload: LoginRequest) => {
    try {
      setLoadingAuth(true);
      const response = await _post<LoginResponse>(LOGIN_ENDPOINT, payload);
      await fetchUser();
      return response;
    } catch (error) {
      console.error("Failed to login", error);
    } finally {
      setLoadingAuth(true);
    }
  };

  const handleLogout = async () => {
    await _post<LogoutResponse>(LOGOUT_ENDPOINT, {});
    setUser(null);
    setLoadingAuth(false);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        handleLogin,
        handleLogout,
        loadingAuth,
        setLoadingAuth,
        fetchUser,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//custom hook to use the context
export function useAuth() {
  const context = useContext(AuthContext);

  if(context == undefined){
    throw new Error("useAuth must be used of an AuthProvider");
  }
  return context;
}
