import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";

export default async function ServicosPage() {
  const supabase = await createClient();
  const { data: servicos } = await supabase
    .from("services")
    .select("id,name,price_cents,duration_minutes,description")
    .order("name");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Serviços</h1>
        <p className="mt-1 text-neutral-300">Escolha o estilo. A gente cuida do resto.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(servicos || []).map((s: any) => (
          <Card key={s.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold">{s.name}</h2>
              <span className="text-sm text-neutral-200">
                R$ {(s.price_cents / 100).toFixed(2)}
              </span>
            </div>
            <p className="mt-2 text-sm text-neutral-300 line-clamp-3">{s.description || ""}</p>
            <p className="mt-3 text-xs text-neutral-400">{s.duration_minutes} min</p>
          </Card>
        ))}
      </div>

      {(!servicos || servicos.length === 0) ? (
        <Card className="p-5 text-sm text-neutral-300">
          Nenhum serviço cadastrado ainda. Entre como admin e cadastre os serviços.
        </Card>
      ) : null}
    </div>
  );
}
