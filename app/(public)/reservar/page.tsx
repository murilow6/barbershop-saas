import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { BookingForm } from "@/components/booking/BookingForm";

export default async function ReservarPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Reserva</h1>
        <p className="mt-1 text-neutral-300">Agende seu horário em poucos cliques.</p>
      </header>

      {data.user ? (
        <BookingForm />
      ) : (
        <Card className="p-6">
          <p className="text-sm text-neutral-300">
            Para agendar, você precisa estar logado.
          </p>
          <div className="mt-4">
            <Link className="underline text-amber-300" href="/login?next=/reservar">
              Ir para login
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
