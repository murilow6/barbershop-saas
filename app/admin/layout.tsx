import { requireRole } from "@/lib/requireAuth";
import { AdminShell } from "@/components/layout/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("ADMIN", "/admin");
  return <AdminShell>{children}</AdminShell>;
}
