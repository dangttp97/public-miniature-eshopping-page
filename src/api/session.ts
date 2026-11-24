import type { Session } from "@/entities/Session";
import { readStorage, writeStorage } from "@/lib/storage";

export const getSession = () => readStorage<Session | null>("session", null);
export const setSession = (session: Session | null) =>
  writeStorage("session", session);
