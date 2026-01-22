import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { getEnrichedMockAppointments } from "@/lib/mockDb";

import { SectionHeader } from "@/components/admin/ui/SectionHeader";

export default async function AgendaAdminPage() {
  const isMock = process.env.NEXT_PUBLIC_MOCK_MODE === "true";
  let appts = [];

  if (isMock) {
    appts = await getEnrichedMockAppointments();
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("appointments")
      .select(`id,starts_at,status,note,
        barbers:barber_id (name),
        services:service_id (name),
        profiles:user_id (full_name,phone)
      `)
      .order("starts_at", { ascending: true })
      .limit(50);
    appts = data || [];
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Agenda Geral"
        subtitle="Monitore e gerencie todos os agendamentos da casa."
        actions={
          <div className="flex gap-2">
            <Button size="sm" className="glass bg-white/5 border-white/10 text-amber-500 hover:bg-white/10">Hoje</Button>
            <Button size="sm" variant="ghost" className="text-stone-400">Semana</Button>
          </div>
        }
      />

      <div className="glass overflow-hidden rounded-3xl">
        <table className="min-w-full text-sm">
          <thead className="text-neutral-400">
            <tr className="border-b border-white/10">
              <th className="py-2 text-left font-medium">Data</th>
              <th className="py-2 text-left font-medium">Cliente</th>
              <th className="py-2 text-left font-medium">Serviço</th>
              <th className="py-2 text-left font-medium">Barbeiro</th>
              <th className="py-2 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(appts || []).map((a: any) => (
              <tr key={a.id} className="border-b border-white/5">
                <td className="py-2">{new Date(a.starts_at).toLocaleString("pt-BR")}</td>
                <td className="py-2">
                  <div className="font-medium">{a.client?.name || a.profiles?.full_name || "(sem nome)"}</div>
                  <div className="text-xs text-neutral-400">{a.client?.phone || a.profiles?.phone || ""}</div>
                </td>
                <td className="py-2">{a.service?.name || a.services?.name || ""}</td>
                <td className="py-2">{a.barber?.name || a.barbers?.name || ""}</td>
                <td className="py-2">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!appts || appts.length === 0) ? (
          <p className="mt-4 text-sm text-neutral-300">Nenhum agendamento ainda.</p>
        ) : null}
      </div>
    </div>
  );
}
