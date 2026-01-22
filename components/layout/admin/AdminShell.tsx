import Link from "next/link";
import { ReactNode } from "react";
import {
  LayoutDashboard,
  CalendarClock,
  Users,
  Scissors,
  Package,
  UserRound,
  Settings,
  LogOut,
  TrendingUp,
  CreditCard,
  Building2
} from "lucide-react";

import { NotificationBell } from "@/components/admin/NotificationBell";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/agenda", label: "Agenda", icon: CalendarClock },
  { href: "/admin/financeiro", label: "Financeiro", icon: TrendingUp },
  { href: "/admin/unidades", label: "Unidades", icon: Building2 },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/barbeiros", label: "Barbeiros", icon: UserRound },
  { href: "/admin/servicos", label: "Serviços", icon: Scissors },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white md:grid md:grid-cols-[280px_1fr]">
      {/* Sidebar - Premium Glass */}
      <aside className="border-r border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center tech-glow">
              <Scissors className="w-6 h-6 text-black" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight">BarberSaaS</p>
              <p className="text-[10px] text-amber-500 font-medium uppercase tracking-widest">Premium Admin</p>
            </div>
          </div>
        </div>

        <nav className="px-4 pb-6">
          <div className="space-y-6">
            <div>
              <p className="px-4 mb-2 text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Principal</p>
              <ul className="space-y-1">
                {items.slice(0, 3).map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href as any}
                      className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-400 hover:text-white hover:bg-white/5 transition-all group"
                    >
                      <Icon className="h-4 w-4 group-hover:text-amber-500 transition-colors" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="px-4 mb-2 text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Gestão</p>
              <ul className="space-y-1">
                {items.slice(3).map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href as any}
                      className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-400 hover:text-white hover:bg-white/5 transition-all group"
                    >
                      <Icon className="h-4 w-4 group-hover:text-amber-500 transition-colors" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-white/5">
              <ul className="space-y-1">
                <li>
                  <Link
                    href={"/admin/configuracoes" as any}
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-400 hover:text-white hover:bg-white/5 transition-all group"
                  >
                    <Settings className="h-4 w-4 group-hover:text-amber-500 transition-colors" />
                    Configurações
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/logout" as any}
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all group"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </aside>

      <main className="relative overflow-y-auto">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-600/5 blur-[100px] rounded-full -z-10" />

        {/* Top Header */}
        <header className="flex justify-end items-center px-8 pt-8 md:px-12 md:pt-12 mb-0">
          <div className="flex items-center gap-4">
            {/* Add other header items here like Profile later */}
            <NotificationBell />
          </div>
        </header>

        <div className="p-8 md:p-12 max-w-7xl mx-auto pt-4 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
