import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import type { readStatus } from "./enum/ReadStatus";

export interface User {
  _id: string;
  email: string;
  fullName: string;
  countryCode?: string;
  mobileNumber: string;
  profilePic?: string;
  status?: string;
  isOnline: boolean;
  lastSeen?: string;
  isActive: boolean;
  isDeleted: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: string;
  createdAt: string;
  updatedAt: string;
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

export interface UserInfoResponse {
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

export interface AuthContextType {
  user: User | null | undefined;
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
  confirmPassword: string;
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

export interface LoginValues {
  email: string;
  password: string;
}

export interface ForgotPasswordValues {
  email: string;
}

export interface ForgotPasswordResponse {
  msg: string;
}

export interface ResetPasswordValues {
  password: string;
  retypePassword: string;
}

export interface Props1 {
  openSidebar: () => void;
  id?: string;
  currentUser?: User;
}
export interface Props2 {
  closeSidebar: () => void;
}

export interface ApiResponse<T> {
  data: T;
}

export interface IMESSAGE {
  _id?: string;
  senderId: string;
  receiverId: string;
  messageType: string;
  content: string;
  fileId?: string;
  readStatus: readStatus;
  createdAt?: string;
}

export interface ChatInputProps{
  sendMessage: (message: IMESSAGE) => void;
}

export interface MessageCardProps {
  isSended: boolean;
  content: string;
  status: readStatus;
  user: User;
  createdAt: string;
}

export interface ChatMessageProps {
  id?: string;
  messages: IMESSAGE[];
}
