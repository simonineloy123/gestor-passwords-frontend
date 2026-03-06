import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email inválido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email inválido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirmá tu contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const passwordRecordSchema = z.object({
  service: z
    .string()
    .min(1, "El servicio es requerido"),
  username: z
    .string()
    .min(1, "El usuario es requerido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  category: z
    .string()
    .min(1, "La categoría es requerida"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PasswordRecordInput = z.infer<typeof passwordRecordSchema>;