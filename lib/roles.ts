import type { User } from "@supabase/supabase-js";

export type Role = "ADMIN" | "CLIENTE";

export function getRole(user: User | null): Role | null {
  if (!user) return null;
  const anyUser = user as any;
  const role =
    anyUser.app_metadata?.role ||
    anyUser.user_metadata?.role ||
    anyUser.user_metadata?.tipo;
  if (role === "ADMIN" || role === "CLIENTE") return role;
  return "CLIENTE"; // default safe
}
