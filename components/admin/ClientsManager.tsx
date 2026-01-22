"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: string | null;
};

type Note = { id: string; customer_id: string; note: string; created_at: string };

export function ClientsManager() {
  const supabase = useMemo(() => createClient(), []);
  const [clients, setClients] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function refreshClients() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,full_name,phone,role")
      .eq("role", "CLIENTE")
      .order("full_name");
    if (error) return setErr(error.message);
    setClients((data as any) || []);
  }

  async function refreshNotes(customerId: string) {
    const { data, error } = await supabase
      .from("customer_notes")
      .select("id,customer_id,note,created_at")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });
    if (error) return setErr(error.message);
    setNotes((data as any) || []);
  }

  useEffect(() => {
    refreshClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function selectClient(id: string) {
    setSelected(id);
    setErr(null);
    setNotes([]);
    await refreshNotes(id);
  }

  async function addNote() {
    if (!selected) return;
    setErr(null);
    const text = noteText.trim();
    if (!text) return;

    const { error } = await supabase.from("customer_notes").insert({
      customer_id: selected,
      note: text,
    });
    if (error) return setErr(error.message);
    setNoteText("");
    await refreshNotes(selected);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Clientes</h2>
          <Button variant="ghost" onClick={refreshClients}>Atualizar</Button>
        </div>
        {err ? <p className="mt-3 text-sm text-red-400">{err}</p> : null}

        <div className="mt-4 space-y-2">
          {clients.map((c) => (
            <button
              key={c.id}
              onClick={() => selectClient(c.id)}
              className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                selected === c.id
                  ? "border-amber-400/40 bg-amber-400/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{c.full_name || "(sem nome)"}</span>
                <span className="text-xs text-neutral-400">{c.phone || ""}</span>
              </div>
              <div className="mt-1 text-xs text-neutral-400">ID: {c.id}</div>
            </button>
          ))}

          {clients.length === 0 ? (
            <p className="text-sm text-neutral-300">Nenhum cliente ainda.</p>
          ) : null}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold">Anotações do cliente</h2>
        {!selected ? (
          <p className="mt-3 text-sm text-neutral-300">Selecione um cliente à esquerda.</p>
        ) : (
          <>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <Input
                label="Nova anotação"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Ex: prefere barba mais baixa, evitar navalha"
              />
              <div className="self-end">
                <Button onClick={addNote}>Adicionar</Button>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {notes.map((n) => (
                <div key={n.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-sm text-neutral-200">{n.note}</p>
                  <p className="mt-1 text-xs text-neutral-400">{new Date(n.created_at).toLocaleString("pt-BR")}</p>
                </div>
              ))}
              {notes.length === 0 ? (
                <p className="text-sm text-neutral-300">Nenhuma anotação ainda.</p>
              ) : null}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
