import { BookingForm } from "@/components/booking/BookingForm";

export default function ClienteAgendarPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Agendar</h1>
        <p className="mt-1 text-neutral-300">Escolha o melhor horário pra você.</p>
      </header>
      <BookingForm />
    </div>
  );
}
