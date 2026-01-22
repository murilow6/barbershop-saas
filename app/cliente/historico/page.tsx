import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";

export default async function ClienteHistoricoPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user!;

  const { data: appts } = await supabase
    .from("appointments")
    .select(`id,starts_at,status,note,
      barbers:barber_id (name),
      services:service_id (name,price_cents)
    `)
    .eq("user_id", user.id)
    .order("starts_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Histórico</h1>
        <p className="mt-1 text-neutral-300">Seus últimos 50 agendamentos.</p>
      </header>

      <div className="space-y-3">
        {(appts || []).map((a: any) => (
          <Card key={a.id} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-neutral-400">{new Date(a.starts_at).toLocaleString("pt-BR")}</p>
                <p className="mt-1 text-lg font-semibold">{a.services?.name || ""}</p>
                <p className="mt-1 text-sm text-neutral-300">Barbeiro: {a.barbers?.name || ""}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-300">{a.status}</p>
                <p className="mt-1 text-sm text-neutral-200">R$ {((a.services?.price_cents || 0) / 100).toFixed(2)}</p>
              </div>
            </div>
            {a.note ? <p className="mt-3 text-sm text-neutral-300">Obs: {a.note}</p> : null}
          </Card>
        ))}

        {(!appts || appts.length === 0) ? (
          <Card className="p-6 text-sm text-neutral-300">Nenhum agendamento ainda.</Card>
        ) : null}
      </div>
    </div>
  );
}
