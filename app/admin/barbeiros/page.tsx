import { BarbersManager } from "@/components/admin/BarbersManager";

export default function AdminBarbeirosPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Barbeiros</h1>
        <p className="mt-1 text-neutral-300">Cadastre o time e perfis.</p>
      </header>
      <BarbersManager />
    </div>
  );
}
