import { requireRole } from "@/lib/requireAuth";
import { ClientShell } from "@/components/layout/client/ClientShell";

export default async function ClienteLayout({ children }: { children: React.ReactNode }) {
  await requireRole("CLIENTE", "/cliente");
  return <ClientShell>{children}</ClientShell>;
}
