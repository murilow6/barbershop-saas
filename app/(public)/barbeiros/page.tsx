import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";

export default async function BarbeirosPage() {
  const supabase = await createClient();
  const { data: barbers } = await supabase
    .from("barbers")
    .select("id,name,bio,avatar_url")
    .order("name");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Barbeiros</h1>
        <p className="mt-1 text-neutral-300">Profissionais que dominam a arte do corte.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(barbers || []).map((b: any) => (
          <Card key={b.id} className="p-5">
            <div className="flex items-center gap-3">
              {b.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.avatar_url} alt={b.name} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-white/5" />
              )}
              <div>
                <h2 className="text-lg font-semibold">{b.name}</h2>
                <p className="text-xs text-neutral-400">Barbeiro</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-neutral-300 line-clamp-4">{b.bio || ""}</p>
          </Card>
        ))}
      </div>

      {(!barbers || barbers.length === 0) ? (
        <Card className="p-5 text-sm text-neutral-300">
          Nenhum barbeiro cadastrado ainda. Entre como admin e cadastre o time.
        </Card>
      ) : null}
    </div>
  );
}
