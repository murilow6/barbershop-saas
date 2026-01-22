import { ServicesManager } from "@/components/admin/ServicesManager";

export default function AdminServicosPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Serviços</h1>
        <p className="mt-1 text-neutral-300">Cadastre e gerencie os serviços.</p>
      </header>
      <ServicesManager />
    </div>
  );
}
