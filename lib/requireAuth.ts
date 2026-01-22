import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRole, type Role } from "@/lib/roles";

export async function requireUser(nextPath?: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    const qp = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/login${qp}` as any);
  }
  return data.user;
}

export async function requireRole(expected: Role, nextPath?: string) {
  const user = await requireUser(nextPath);
  const role = getRole(user) || "CLIENTE";
  if (role !== expected) {
    redirect(expected === "ADMIN" ? "/cliente" : "/admin");
  }
  return user;
}
