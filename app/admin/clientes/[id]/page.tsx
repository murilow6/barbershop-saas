import { getMockClientById, getMockAppointmentsByClientId, getMockNotesByClientId, getAllMockClients } from "@/lib/mockDb";
import { User, Phone, Mail, Award, Clock, FileText, Plus, Link as LinkIcon, Calendar, MapPin, Scissors, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/admin/ui/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { VincularVisitante } from "@/components/admin/VincularVisitante";
import { vincularClienteAction, createMockNoteAction, deleteMockClientAction } from "@/lib/actions";
import { CustomerModal } from "@/components/admin/CustomerModal";
import { redirect } from "next/navigation";

export default async function ClienteDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const client = await getMockClientById(id);
    const appointments = await getMockAppointmentsByClientId(id);
    const notes = await getMockNotesByClientId(id);
    const allClients = await getAllMockClients();

    if (!client) {
        return <div className="p-8 text-center text-stone-500">Cliente não encontrado.</div>;
    }

    const visitorClients = allClients.filter(c => c.status === 'visitante' && c.id !== client.id);

    async function handleRefresh() {
        "use server";
        revalidatePath(`/admin/clientes/${id}`);
    }

    async function handleDelete() {
        "use server";
        await deleteMockClientAction(id);
        revalidatePath("/admin/clientes");
        redirect("/admin/clientes");
    }

    async function addNoteAction(formData: FormData) {
        "use server";
        const text = formData.get("note") as string;
        if (!text) return;

        await createMockNoteAction({
            client_id: id,
            text,
            author: "Admin", // In a real app, this would be the logged in user
        });

        revalidatePath(`/admin/clientes/${id}`);
    }

    return (
        <div className="space-y-8 pb-12">
            <SectionHeader
                title={client.name}
                subtitle={`Perfil detalhado do ${client.status === 'fidelizado' ? 'Cliente Fidelizado' : 'Visitante'}`}
                actions={
                    <div className="flex gap-2">
                        <CustomerModal client={client} onClientUpdated={handleRefresh} />

                        <form action={handleDelete}>
                            <Button type="submit" variant="ghost" className="text-red-500/50 hover:bg-red-500/10 hover:text-red-500 border border-white/5">
                                Excluir
                            </Button>
                        </form>
                    </div>
                }
            />

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Basic Info & Loyalty */}
                <div className="space-y-8 lg:col-span-1">
                    <Card className="glass overflow-hidden rounded-3xl border-white/5 p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500 tech-glow mb-4">
                                <User size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">{client.name}</h2>
                            <span className={`mt-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${client.status === 'fidelizado' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500' : 'bg-stone-500/10 border border-white/5 text-stone-400'
                                }`}>
                                {client.status}
                            </span>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 text-stone-400">
                                <Phone className="h-4 w-4 text-amber-500/50" />
                                <span className="text-sm">{client.phone}</span>
                            </div>
                            {client.email && (
                                <div className="flex items-center gap-3 text-stone-400">
                                    <Mail className="h-4 w-4 text-amber-500/50" />
                                    <span className="text-sm">{client.email}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-stone-400">
                                <Calendar className="h-4 w-4 text-amber-500/50" />
                                <span className="text-sm">Cadastrado em {format(new Date(client.created_at), "dd/MM/yyyy", { locale: ptBR })}</span>
                            </div>
                        </div>

                        <div className="mt-8 rounded-2xl bg-stone-950/50 p-4 border border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-amber-500" />
                                    <span className="text-sm font-bold text-white">Pontos Fidelidade</span>
                                </div>
                                <span className="text-xl font-bold text-amber-500">{client.loyalty_points || 0}</span>
                            </div>
                        </div>

                        {client.observations && (
                            <div className="mt-8">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Observações Gerais</h4>
                                <p className="text-sm text-stone-400 leading-relaxed italic">
                                    "{client.observations}"
                                </p>
                            </div>
                        )}
                    </Card>

                    {/* vinculação de clientes */}
                    {client.status === 'fidelizado' && (
                        <Card className="glass rounded-3xl border-white/5 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <LinkIcon size={18} className="text-amber-500" />
                                <h3 className="font-bold text-white">Vínculos (Visitantes)</h3>
                            </div>
                            <p className="text-xs text-stone-500 mb-4">Vincule contas temporárias a este perfil fidelizado para unificar o histórico.</p>

                            <div className="space-y-3">
                                {allClients.filter(c => c.parent_client_id === client.id).map(linked => (
                                    <Link
                                        href={`/admin/clientes/${linked.id}`}
                                        key={linked.id}
                                        className="flex items-center gap-3 p-3 rounded-2xl bg-amber-500/5 border border-amber-500/10 hover:border-amber-500/30 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                                            <User size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-white truncate">{linked.name}</p>
                                            <p className="text-[10px] text-stone-500">{linked.phone}</p>
                                        </div>
                                        <ChevronRight size={14} className="text-stone-700 group-hover:text-amber-500 transition-colors" />
                                    </Link>
                                ))}

                                <VincularVisitante
                                    fidelizadoId={client.id}
                                    visitantes={visitorClients.filter(v => v.parent_client_id !== client.id)}
                                />
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right Column: History & Notes */}
                <div className="space-y-8 lg:col-span-2">
                    {/* Anotações Internas */}
                    <Card className="glass rounded-3xl border-white/5 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <FileText size={20} className="text-amber-500" />
                                <h3 className="text-lg font-bold text-white">Anotações Internas</h3>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 uppercase px-2 py-0.5 border border-white/5 rounded-md">
                                Apenas Admin
                            </span>
                        </div>

                        <form action={addNoteAction} className="relative mb-8">
                            <textarea
                                name="note"
                                placeholder="Adicionar uma anotação sobre o cliente (ex: prefere degradê alto)..."
                                className="w-full bg-stone-950/50 border border-white/10 rounded-2xl p-4 text-sm text-stone-300 focus:outline-none focus:border-amber-500/50 transition-colors resize-none h-24"
                            />
                            <Button type="submit" size="sm" className="absolute bottom-3 right-3 bg-amber-600 hover:bg-amber-500">
                                <Plus size={16} className="mr-1" /> Salvar
                            </Button>
                        </form>

                        <div className="space-y-4">
                            {notes.length === 0 ? (
                                <p className="text-center text-sm text-stone-600 py-4 italic">Nenhuma anotação registrada.</p>
                            ) : (
                                notes.map(note => (
                                    <div key={note.id} className="group relative rounded-2xl bg-white/5 border border-white/5 p-4 transition-all hover:border-white/10">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-bold text-amber-500/50 uppercase tracking-tighter">{note.author}</span>
                                            <span className="text-[10px] text-stone-600">{format(new Date(note.created_at), "HH:mm - dd MMM yyyy", { locale: ptBR })}</span>
                                        </div>
                                        <p className="text-sm text-stone-400">{note.text}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* Histórico de Agendamentos */}
                    <Card className="glass rounded-3xl border-white/5 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Clock size={20} className="text-amber-500" />
                            <h3 className="text-lg font-bold text-white">Histórico de Agendamentos</h3>
                        </div>

                        <div className="space-y-4">
                            {appointments.length === 0 ? (
                                <p className="text-center text-sm text-stone-600 py-8">Nenhum agendamento encontrado para este cliente.</p>
                            ) : (
                                appointments.map((appt: any) => (
                                    <div key={appt.id} className="flex items-center gap-4 rounded-2xl bg-stone-950/30 p-4 border border-white/5">
                                        <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-石-900 border border-white/5">
                                            <span className="text-[10px] uppercase text-amber-500 font-bold">{format(new Date(appt.starts_at), "MMM", { locale: ptBR })}</span>
                                            <span className="text-lg font-bold text-white leading-none">{format(new Date(appt.starts_at), "dd")}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-white text-sm">{appt.service?.name}</h4>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${appt.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                    appt.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                                                    }`}>
                                                    {appt.status}
                                                </span>
                                            </div>
                                            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                                                <div className="flex items-center gap-1 text-[10px] text-stone-500">
                                                    <User size={12} className="text-amber-500/30" />
                                                    {appt.barber?.name}
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] text-stone-500">
                                                    <MapPin size={12} className="text-amber-500/30" />
                                                    {appt.branch?.name}
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                                                    <Scissors size={12} className="text-amber-500/30" />
                                                    {appt.service?.price}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
