"use client";

import { useState } from "react";
import { Link as LinkIcon, Plus, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { vincularClienteAction } from "@/lib/actions";

export function VincularVisitante({
    fidelizadoId,
    visitantes
}: {
    fidelizadoId: string,
    visitantes: any[]
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const filtered = visitantes.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.phone.includes(searchTerm)
    );

    const handleLink = async (visitanteId: string) => {
        setLoading(true);
        try {
            await vincularClienteAction(visitanteId, fidelizadoId);
            window.location.reload(); // Refresh to update the UI
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button
                variant="outline"
                onClick={() => setIsOpen(true)}
                className="w-full border-white/5 bg-stone-900/50 text-xs hover:border-amber-500/50 rounded-xl"
            >
                <Plus size={14} className="mr-1" /> Vincular Novo Visitante
            </Button>
        );
    }

    return (
        <div className="space-y-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Selecionar Visitante</p>
                <button onClick={() => setIsOpen(false)} className="text-stone-500 hover:text-white">
                    <Plus size={14} className="rotate-45" />
                </button>
            </div>

            <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600" />
                <input
                    autoFocus
                    placeholder="Nome ou telefone..."
                    className="w-full bg-stone-950 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="max-h-40 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {filtered.length === 0 ? (
                    <p className="text-center text-[10px] text-stone-600 py-2">Nenhum visitante encontrado.</p>
                ) : (
                    filtered.map(v => (
                        <button
                            key={v.id}
                            disabled={loading}
                            onClick={() => handleLink(v.id)}
                            className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/5 transition-all text-left"
                        >
                            <div>
                                <p className="text-xs font-bold text-white leading-tight">{v.name}</p>
                                <p className="text-[10px] text-stone-500">{v.phone}</p>
                            </div>
                            <LinkIcon size={12} className="text-amber-500/50" />
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
