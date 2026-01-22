"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Barber = {
  id: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
};

export function BarbersManager() {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");

  async function refresh() {
    setLoading(true);
    const { data, error } = await supabase.from("barbers").select("id,name,bio,avatar_url").order("name");
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
    const { error } = await supabase.from("barbers").insert({
      name,
      avatar_url: avatarUrl || null,
      bio: bio || null,
    });
    if (error) return setError(error.message);
    setName("");
    setAvatarUrl("");
    setBio("");
    await refresh();
  }

  async function remove(id: string) {
    setError(null);
    const { error } = await supabase.from("barbers").delete().eq("id", id);
    if (error) return setError(error.message);
    await refresh();
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-xl font-semibold">Novo barbeiro</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="João" />
          <Input label="Avatar (URL)" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
        </div>
        <div className="mt-3">
          <Input label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Especialista em degradê e navalha" />
        </div>
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
        <div className="mt-4">
          <Button onClick={add} disabled={!name}>Adicionar</Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Barbeiros</h2>
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
                  <th className="py-2 text-left font-medium">Bio</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((b) => (
                  <tr key={b.id} className="border-b border-white/5">
                    <td className="py-2">{b.name}</td>
                    <td className="py-2 text-neutral-300">{b.bio || ""}</td>
                    <td className="py-2 text-right">
                      <Button variant="ghost" onClick={() => remove(b.id)}>Excluir</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {items.length === 0 ? (
              <p className="mt-4 text-sm text-neutral-300">Nenhum barbeiro cadastrado.</p>
            ) : null}
          </div>
        )}
      </Card>
    </div>
  );
}
