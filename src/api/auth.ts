import { sessionSchema } from "@/entities/Session";
import { z } from "zod";

import { post } from "./client";

export const login = (email: string, password: string) =>
  post(sessionSchema, "/api/auth/login", { email, password });

export const register = (name: string, email: string, password: string) =>
  post(sessionSchema, "/api/auth/register", { name, email, password });

export const logout = () =>
  post(z.unknown(), "/api/auth/logout").catch(() => undefined);
