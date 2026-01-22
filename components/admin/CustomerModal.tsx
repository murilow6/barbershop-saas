"use client";

import { useState, useEffect } from "react";
import { Plus, X, User, Phone, Mail, FileText, CheckCircle2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createMockClientAction, updateMockClientAction } from "@/lib/actions";
import { Client } from "@/lib/mockConstants";

interface CustomerModalProps {
    onClientUpdated: () => void;
    client?: Client; // If present, it's edit mode
    trigger?: React.ReactNode;
}

export function CustomerModal({ onClientUpdated, client, trigger }: CustomerModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        observations: "",
        status: "fidelizado" as "visitante" | "fidelizado"
    });

    useEffect(() => {
        if (client) {
            setFormData({
                name: client.name,
                phone: client.phone,
                email: client.email || "",
                observations: client.observations || "",
                status: client.status
            });
        }
    }, [client, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (client) {
                await updateMockClientAction(client.id, {
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    observations: formData.observations,
                    status: formData.status
                });
            } else {
                await createMockClientAction({
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    observations: formData.observations,
                    status: formData.status
                });
            }
            setIsOpen(false);
            if (!client) {
                setFormData({ name: "", phone: "", email: "", observations: "", status: "fidelizado" });
            }
            onClientUpdated();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const defaultTrigger = client ? (
        <Button variant="outline" className="border-white/10 bg-stone-900/50 text-stone-400 hover:text-white">
            <Pencil size={16} className="mr-2" /> Editar Perfil
        </Button>
    ) : (
        <Button
            onClick={() => setIsOpen(true)}
            className="bg-amber-600 hover:bg-amber-500 rounded-2xl tech-glow"
        >
            <Plus size={20} className="mr-2" /> Novo Cliente
        </Button>
    );

    return (
        <>
            <div onClick={() => setIsOpen(true)}>
                {trigger || defaultTrigger}
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-lg glass border-white/10 rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between border-b border-white/5 p-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <User className="text-amber-500" /> {client ? 'Editar Perfil' : 'Cadastrar Novo Cliente'}
                            </h2>
                            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-stone-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Nome Completo</label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-stone-950/50 border-white/5 rounded-2xl h-12 focus:border-amber-500"
                                        placeholder="Ex: Carlos Alberto"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Telefone / WhatsApp</label>
                                        <Input
                                            required
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="bg-stone-950/50 border-white/5 rounded-2xl h-12"
                                            placeholder="(11) 99999-9999"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Email (Opcional)</label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="bg-stone-950/50 border-white/5 rounded-2xl h-12"
                                            placeholder="carlos@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Status Base</label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, status: "fidelizado" })}
                                            className={`flex-1 flex items-center justify-center gap-2 rounded-2xl h-12 border transition-all ${formData.status === 'fidelizado' ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-stone-950/50 border-white/5 text-stone-500'
                                                }`}
                                        >
                                            <CheckCircle2 size={16} /> Fidelizado
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, status: "visitante" })}
                                            className={`flex-1 flex items-center justify-center gap-2 rounded-2xl h-12 border transition-all ${formData.status === 'visitante' ? 'bg-stone-500/10 border-stone-500 text-stone-400' : 'bg-stone-950/50 border-white/5 text-stone-500'
                                                }`}
                                        >
                                            <User size={16} /> Visitante
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Observações Internas</label>
                                    <textarea
                                        value={formData.observations}
                                        onChange={e => setFormData({ ...formData, observations: e.target.value })}
                                        className="w-full bg-stone-950/50 border border-white/5 rounded-2xl p-4 text-sm text-stone-300 focus:outline-none focus:border-amber-500/50 transition-colors resize-none h-24"
                                        placeholder="Preferências do cliente, alergias, etc..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="flex-1 rounded-2xl border border-white/5 hover:bg-stone-900"
                                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-amber-600 hover:bg-amber-500 rounded-2xl"
                                >
                                    {loading ? "Salvando..." : (client ? "Salvar Alterações" : "Cadastrar Cliente")}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </>
    );
}
