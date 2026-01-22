import Link from "next/link";
import { ReactNode } from "react";
import { CalendarCheck, History, Package, Scissors, UserRound, Home, LogOut } from "lucide-react";

const items = [
  { href: "/cliente", label: "Início", icon: Home },
  { href: "/cliente/agendar", label: "Agendar", icon: CalendarCheck },
  { href: "/cliente/historico", label: "Histórico", icon: History },
  { href: "/cliente/servicos", label: "Serviços", icon: Scissors },
  { href: "/cliente/produtos", label: "Produtos", icon: Package },
  { href: "/cliente/barbeiros", label: "Barbeiros", icon: UserRound },
];

export function ClientShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
      <aside className="border-r border-white/10 bg-black/20 backdrop-blur">
        <div className="p-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-neutral-300">BarberSaaS</p>
            <p className="text-lg font-semibold">Cliente</p>
          </div>
        </div>

        <nav className="px-3 pb-6">
          <ul className="space-y-1">
            {items.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href as any}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-neutral-200 hover:bg-white/5"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href={"/logout" as any}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-neutral-200 hover:bg-white/5"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
