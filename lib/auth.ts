import { User } from "@/types";

const TOKEN_KEY = "auth-token";
const USER_KEY = "auth-user";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find(c => c.trim().startsWith(`${TOKEN_KEY}=`));
  return tokenCookie ? tokenCookie.split("=")[1].trim() : null;
};

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const user = sessionStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setAuth = (token: string, user: User | null): void => {
  const isProduction = process.env.NODE_ENV === "production";
  document.cookie = [
    `${TOKEN_KEY}=${token}`,
    "path=/",
    "SameSite=Strict",
    `Max-Age=${60 * 60}`,
    isProduction ? "Secure" : "",
  ].filter(Boolean).join("; ");

  if (user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearAuth = (): void => {
  document.cookie = `${TOKEN_KEY}=; path=/; Max-Age=0; SameSite=Strict`;
  sessionStorage.removeItem(USER_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};