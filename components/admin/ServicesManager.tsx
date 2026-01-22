"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Service = {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_cents: number;
};

export function ServicesManager() {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("0");
  const [duration, setDuration] = useState("30");
  const [description, setDescription] = useState("");

  async function refresh() {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("id,name,description,duration_minutes,price_cents")
      .order("name");
    setLoading(false);
    if (error) return setError(error.message);
    setItems((data as any) || []);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function add() {
    setError(null);
    const priceCents = Math.round(Number(price) * 100);
    const { error } = await supabase.from("services").insert({
      name,
      price_cents: priceCents,
      duration_minutes: Number(duration),
      description: description || null,
    });
    if (error) return setError(error.message);
    setName("");
    setPrice("0");
    setDuration("30");
    setDescription("");
    await refresh();
  }

  async function remove(id: string) {
    setError(null);
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return setError(error.message);
    await refresh();
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-xl font-semibold">Novo serviço</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Corte + barba" />
          <Input label="Preço (R$)" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="59.90" />
          <Input label="Duração (min)" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="45" />
          <Input label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição curta" />
        </div>
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
        <div className="mt-4">
          <Button onClick={add} disabled={!name || Number.isNaN(Number(price))}>Adicionar</Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Serviços</h2>
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
                  <th className="py-2 text-left font-medium">Duração</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id} className="border-b border-white/5">
                    <td className="py-2">{s.name}</td>
                    <td className="py-2">R$ {(s.price_cents / 100).toFixed(2)}</td>
                    <td className="py-2">{s.duration_minutes} min</td>
                    <td className="py-2 text-right">
                      <Button variant="ghost" onClick={() => remove(s.id)}>Excluir</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {items.length === 0 ? (
              <p className="mt-4 text-sm text-neutral-300">Nenhum serviço cadastrado.</p>
            ) : null}
          </div>
        )}
      </Card>
    </div>
  );
}
