import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

export interface User {
  id: string;
  _id?: string;
  email?: string;
  fullName?: string;
  // role?: string;
}


export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export interface LabelProps {
  htmlFor?: string;
  text?: string;
}

export interface Option {
  name: string;
  flag: string;
  code: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  error?: string;
}

export interface UserInfoResponse{
  msg: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  msg: string;
}
export interface LogoutResponse {
  msg: string;  
}

export interface AuthContextType{
  user: User | null | undefined ;
  handleLogin: (payload: LoginRequest) => Promise<any>;
  handleLogout: () => Promise<void>;
  loadingAuth: boolean;
  setLoadingAuth: React.Dispatch<React.SetStateAction<boolean>>;
  fetchUser: () => Promise<void>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<number>>;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface NoAuthRouteProps {
  children: ReactNode;
}

export interface ProtectedRouteProps {
  children: ReactNode;
}

export interface SignUpFormValues {
  fullName: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string,

}

export interface SignUpResponse {
  msg: string;
}

export interface ButtonProps {
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  children: React.ReactNode;
}
