import { getAllMockBranches } from "@/lib/mockDb";
import { MapPin, Phone, Clock, Sparkles, Building2, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/admin/ui/SectionHeader";
import { BranchModal } from "@/components/admin/BranchModal";
import { revalidatePath } from "next/cache";
import { deleteMockBranchAction } from "@/lib/actions";

export default async function UnidadesAdminPage() {
    const branches = await getAllMockBranches();

    const handleRefresh = async () => {
        "use server";
        revalidatePath("/admin/unidades");
    };

    const handleDelete = async (id: string) => {
        "use server";
        await deleteMockBranchAction(id);
        revalidatePath("/admin/unidades");
    };

    return (
        <div className="space-y-8">
            <SectionHeader
                title="Gestão de Unidades"
                subtitle="Gerencie as sedes e filiais da sua barbearia."
                actions={
                    <BranchModal onBranchUpdated={handleRefresh} />
                }
            />

            <div className="grid gap-6 md:grid-cols-2">
                {branches.length === 0 ? (
                    <div className="col-span-full glass rounded-3xl p-12 text-center text-stone-500">
                        Nenhuma unidade cadastrada. Crie sua primeira sede!
                    </div>
                ) : (
                    branches.map((branch: any) => (
                        <div key={branch.id} className="glass glass-hover tech-glow-hover group relative overflow-hidden rounded-3xl p-6 transition-all">
                            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-500/5 blur-2xl group-hover:bg-amber-500/10 transition-colors" />

                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 text-left">
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all group-hover:scale-110 ${branch.active ? 'bg-amber-500/10 text-amber-500 tech-glow shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-stone-500/10 text-stone-500'
                                        }`}>
                                        <Building2 size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors">{branch.name}</h3>
                                        <div className="mt-1 flex items-center gap-1.5">
                                            <div className={`h-1.5 w-1.5 rounded-full ${branch.active ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${branch.active ? 'text-green-500' : 'text-red-500'}`}>
                                                {branch.active ? 'Ativa' : 'Inativa'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button className="text-stone-600 hover:text-white transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <div className="mt-8 grid grid-cols-1 gap-4 text-sm text-stone-400">
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="text-amber-500/50 mt-0.5 shrink-0" />
                                    <span>{branch.address}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={16} className="text-amber-500/50 shrink-0" />
                                    <span>{branch.phone}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-amber-500/50 shrink-0" />
                                    <span>{branch.hours}</span>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-2">
                                <BranchModal branch={branch} onBranchUpdated={handleRefresh} />

                                <form action={async () => { "use server"; await handleDelete(branch.id); }}>
                                    <button
                                        type="submit"
                                        className="flex items-center justify-center h-[42px] w-11 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500/50 hover:bg-red-500/10 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
