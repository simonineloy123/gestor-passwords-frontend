export interface User {
  id: string;
  email: string;
}

export interface PasswordRecord {
  id: string;
  userId: string;
  service: string;
  username: string;
  password: string;
  category: string;
  googleLogin: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface AuthResponse {
  token: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
}

export const CATEGORIES = [
  "Todos",
  "Streaming",
  "Redes Sociales",
  "Educacion",
  "Gubernamental",
  "Trabajo",
  "Finanzas",
  "Compras",
  "Gaming",
  "Salud",
  "Otros",
] as const;

export type Category = (typeof CATEGORIES)[number];