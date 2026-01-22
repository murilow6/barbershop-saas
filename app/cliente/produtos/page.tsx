import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";

export default async function ProdutosPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id,name,price_cents,stock,image_url,description")
    .order("name");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Produtos</h1>
        <p className="mt-1 text-neutral-300">Cuidados premium pro seu estilo.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(products || []).map((p: any) => (
          <Card key={p.id} className="p-5">
            {p.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image_url} alt={p.name} className="h-40 w-full rounded-xl object-cover" />
            ) : (
              <div className="h-40 w-full rounded-xl bg-white/5" />
            )}
            <div className="mt-4 flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <span className="text-sm text-neutral-200">R$ {(p.price_cents / 100).toFixed(2)}</span>
            </div>
            <p className="mt-2 text-sm text-neutral-300 line-clamp-3">{p.description || ""}</p>
            <p className="mt-3 text-xs text-neutral-400">Estoque: {p.stock ?? 0}</p>
          </Card>
        ))}
      </div>

      {(!products || products.length === 0) ? (
        <Card className="p-5 text-sm text-neutral-300">
          Nenhum produto cadastrado ainda. Entre como admin e cadastre os produtos.
        </Card>
      ) : null}
    </div>
  );
}
