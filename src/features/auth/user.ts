import { logout } from "@/api/auth";
import { getSession, setSession } from "@/api/session";
import { subscribe } from "@/lib/storage";
import { useSyncExternalStore } from "@koniwa/core";

const getUser = () => getSession()?.user ?? null;

export const useUser = () => useSyncExternalStore(subscribe, getUser);

export const signOut = async () => {
  await logout();
  setSession(null);
};
