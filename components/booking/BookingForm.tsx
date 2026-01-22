"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { saveBookingAction } from "@/lib/actions";

type Barber = { id: string; name: string };
type Service = { id: string; name: string; duration_minutes: number; price_cents: number };

export function BookingForm() {
  const supabase = useMemo(() => createClient(), []);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [barberId, setBarberId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: b }, { data: s }] = await Promise.all([
        supabase.from("barbers").select("id,name").order("name"),
        supabase.from("services").select("id,name,duration_minutes,price_cents").order("name"),
      ]);
      setBarbers((b as any) || []);
      setServices((s as any) || []);
    })();
  }, [supabase]);

  async function onSubmit() {
    setLoading(true);
    setErr(null);
    setMsg(null);

    try {
      const result = await saveBookingAction({
        serviceId,
        barberId,
        branchId: 'default', // Fallback as this form seems legacy/simple
        date,
        time,
        clientName: 'Cliente (Formulário)', // Need to get valid user info if using auth
        clientPhone: '00000000000' // Placeholder if not capturing
      });

      if (result.success) {
        toast.success("Agendamento realizado!");
        setMsg("Agendamento criado! Você pode ver em 'Histórico'.");
        setNote("");
      } else {
        toast.error("Erro ao agendar.");
        setErr("Erro ao criar agendamento.");
      }
    } catch (e) {
      toast.error("Erro de conexão.");
      setErr("Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold">Agendar horário</h2>
      <p className="mt-1 text-sm text-neutral-300">Escolha barbeiro, serviço e horário.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-neutral-200">Barbeiro</label>
          <select
            className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-amber-400/40"
            value={barberId}
            onChange={(e) => setBarberId(e.target.value)}
          >
            <option value="">Selecione</option>
            {barbers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-neutral-200">Serviço</label>
          <select
            className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-amber-400/40"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          >
            <option value="">Selecione</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — R$ {(s.price_cents / 100).toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <Input label="Data" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Input label="Horário" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>

      <div className="mt-4">
        <Input label="Observação (opcional)" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex: corte social + barba" />
      </div>

      {err ? <p className="mt-3 text-sm text-red-400">{err}</p> : null}
      {msg ? <p className="mt-3 text-sm text-emerald-400">{msg}</p> : null}

      <div className="mt-6">
        <Button onClick={onSubmit} disabled={loading || !barberId || !serviceId || !date || !time}>
          {loading ? "Agendando..." : "Confirmar agendamento"}
        </Button>
      </div>
    </Card>
  );
}
