import { getAllMockClients } from "@/lib/mockDb";
import { User, Phone, Mail, Award, Sparkles, ChevronRight, Search } from "lucide-react";
import { SectionHeader } from "@/components/admin/ui/SectionHeader";
import { CustomerModal } from "@/components/admin/CustomerModal";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { identifyOverdueClients } from "@/lib/retention";
import { RetentionTrigger } from "@/components/admin/RetentionTrigger";

export default async function ClientesAdminPage() {
  const clients = await getAllMockClients();
  const overdueList = await identifyOverdueClients();
  const overdueIds = new Set(overdueList.map(item => item.client.id));

  const handleRefresh = async () => {
    "use server";
    revalidatePath("/admin/clientes");
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Gestão de Clientes"
        subtitle="Analise o perfil e o engajamento da sua base de clientes."
        actions={
          <div className="flex items-center gap-4">
            <RetentionTrigger />
            <CustomerModal onClientUpdated={handleRefresh} />
          </div>
        }
      />

      {/* Stats e Busca */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="glass rounded-3xl p-6 border-white/5">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">Total de Clientes</p>
          <p className="text-3xl font-bold text-white">{clients.length}</p>
        </div>
        <div className="glass rounded-3xl p-6 border-white/5">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">Fidelizados</p>
          <p className="text-3xl font-bold text-amber-500">{clients.filter(c => c.status === 'fidelizado').length}</p>
        </div>
        <div className="md:col-span-2 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500">
            <Search size={20} />
          </div>
          <input
            placeholder="Buscar por nome ou telefone..."
            className="w-full h-full bg-stone-900/50 border border-white/5 rounded-3xl pl-12 pr-6 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
            disabled
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-600 bg-white/5 px-2 py-0.5 rounded uppercase">Em Breve</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clients.length === 0 ? (
          <div className="col-span-full glass rounded-3xl p-12 text-center text-stone-500">
            Nenhum cliente cadastrado ainda. Comece adicionando o primeiro!
          </div>
        ) : (
          clients.map((client: any) => (
            <Link
              href={`/admin/clientes/${client.id}`}
              key={client.id}
              className="glass glass-hover tech-glow-hover group relative overflow-hidden rounded-3xl p-6 transition-all"
            >
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-amber-500/5 blur-2xl group-hover:bg-amber-500/10" />

              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${client.status === 'fidelizado' ? 'bg-amber-500/10 text-amber-500' : 'bg-stone-500/10 text-stone-400'
                  }`}>
                  <User className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors uppercase tracking-tight">{client.name}</h3>
                    {overdueIds.has(client.id) && (
                      <span className="flex items-center gap-1 text-[10px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 animate-pulse">
                        <Sparkles size={10} />
                        ATRASADO
                      </span>
                    )}
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-stone-400">
                      <Phone className="h-3.5 w-3.5" />
                      {client.phone}
                    </div>
                    {client.email && (
                      <div className="flex items-center gap-2 text-sm text-stone-400">
                        <Mail className="h-3.5 w-3.5" />
                        {client.email}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm font-bold text-amber-500/80">
                      <Award className="h-3.5 w-3.5" />
                      {client.loyalty_points || 0} pontos
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${client.status === 'fidelizado'
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      : 'bg-stone-500/10 border-white/5 text-stone-400'
                      }`}>
                      {client.status}
                    </span>

                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-stone-500 group-hover:text-amber-500 transition-colors">
                      Ver Ficha <ChevronRight size={12} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
