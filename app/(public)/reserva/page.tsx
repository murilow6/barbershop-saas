import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function ReservaPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Reserva</h2>
      <Card>
        Para agendar, entre na área do sistema: <Link className="text-gold underline" href="/login">Login</Link>
      </Card>
    </div>
  );
}
