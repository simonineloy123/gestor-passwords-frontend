import api from "./api";
import { AuthResponse, PasswordRecord, RegisterResponse } from "@/types";


export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  },

  register: async (email: string, password: string): Promise<RegisterResponse> => {
    const { data } = await api.post("/auth/register", { email, password });
    return data;
  },

  me: async (): Promise<{ user: { id: string; email: string } }> => {
    const { data } = await api.get("/auth/me");
    return data;
  },
};


export const passwordService = {
  getAll: async (): Promise<PasswordRecord[]> => {
    const { data } = await api.get("/passwords");
    return data;
  },

  create: async (payload: {
    service: string;
    username: string;
    password: string;
    category: string;
  }): Promise<PasswordRecord> => {
    const { data } = await api.post("/passwords", payload);
    return data;
  },

  update: async (
    id: string,
    payload: {
      service: string;
      username: string;
      password: string;
      category: string;
    }
  ): Promise<PasswordRecord> => {
    const { data } = await api.put(`/passwords/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/passwords/${id}`);
  },
};