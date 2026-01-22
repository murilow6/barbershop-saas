"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  stock: number | null;
  image_url: string | null;
};

export function ProductsManager() {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("0");
  const [stock, setStock] = useState("0");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  async function refresh() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("id,name,description,price_cents,stock,image_url")
      .order("name");
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setItems((data as any) || []);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function add() {
    setError(null);
    const priceCents = Math.round(Number(price) * 100);
    const { error } = await supabase.from("products").insert({
      name,
      price_cents: priceCents,
      stock: Number(stock),
      image_url: imageUrl || null,
      description: description || null,
    });
    if (error) return setError(error.message);
    setName("");
    setPrice("0");
    setStock("0");
    setImageUrl("");
    setDescription("");
    await refresh();
  }

  async function remove(id: string) {
    setError(null);
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return setError(error.message);
    await refresh();
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-xl font-semibold">Novo produto</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Pomada modeladora" />
          <Input label="Preço (R$)" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="39.90" />
          <Input label="Estoque" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="10" />
          <Input label="Imagem (URL)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
        </div>
        <div className="mt-3">
          <Input label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição curta" />
        </div>
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
        <div className="mt-4">
          <Button onClick={add} disabled={!name || Number.isNaN(Number(price))}>Adicionar</Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Produtos</h2>
          <Button variant="ghost" onClick={refresh}>Atualizar</Button>
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-neutral-300">Carregando...</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-neutral-400">
                <tr className="border-b border-white/10">
                  <th className="py-2 text-left font-medium">Nome</th>
                  <th className="py-2 text-left font-medium">Preço</th>
                  <th className="py-2 text-left font-medium">Estoque</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-b border-white/5">
                    <td className="py-2">{p.name}</td>
                    <td className="py-2">R$ {(p.price_cents / 100).toFixed(2)}</td>
                    <td className="py-2">{p.stock ?? 0}</td>
                    <td className="py-2 text-right">
                      <Button variant="ghost" onClick={() => remove(p.id)}>Excluir</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {items.length === 0 ? (
              <p className="mt-4 text-sm text-neutral-300">Nenhum produto cadastrado.</p>
            ) : null}
          </div>
        )}
      </Card>
    </div>
  );
}
