"use client";

import { useState, useEffect } from "react";
import { Plus, X, MapPin, Phone, Clock, CheckCircle2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createMockBranchAction, updateMockBranchAction } from "@/lib/actions";
import { Branch } from "@/lib/mockConstants";

interface BranchModalProps {
    onBranchUpdated: () => void;
    branch?: Branch; // If present, it's edit mode
    trigger?: React.ReactNode;
}

export function BranchModal({ onBranchUpdated, branch, trigger }: BranchModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        hours: "Seg-Sáb: 09:00 - 20:00",
        active: true
    });

    useEffect(() => {
        if (branch) {
            setFormData({
                name: branch.name,
                address: branch.address,
                phone: branch.phone,
                hours: branch.hours,
                active: branch.active
            });
        }
    }, [branch, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (branch) {
                await updateMockBranchAction(branch.id, {
                    name: formData.name,
                    address: formData.address,
                    phone: formData.phone,
                    hours: formData.hours,
                    active: formData.active
                });
            } else {
                await createMockBranchAction({
                    name: formData.name,
                    address: formData.address,
                    phone: formData.phone,
                    hours: formData.hours,
                    active: formData.active
                });
            }
            setIsOpen(false);
            if (!branch) {
                setFormData({ name: "", address: "", phone: "", hours: "Seg-Sáb: 09:00 - 20:00", active: true });
            }
            onBranchUpdated();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const defaultTrigger = branch ? (
        <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/5 py-2.5 text-xs font-bold text-stone-400 hover:bg-white/10 hover:text-white transition-all">
            <Pencil size={14} /> Editar
        </button>
    ) : (
        <Button
            onClick={() => setIsOpen(true)}
            className="bg-amber-600 hover:bg-amber-500 rounded-2xl tech-glow"
        >
            <Plus size={20} className="mr-2" /> Nova Unidade
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
                                <MapPin className="text-amber-500" /> {branch ? 'Editar Unidade' : 'Cadastrar Nova Unidade'}
                            </h2>
                            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-stone-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Nome da Unidade</label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-stone-950/50 border-white/5 rounded-2xl h-12"
                                        placeholder="Ex: Unidade Shopping"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Endereço Completo</label>
                                    <Input
                                        required
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="bg-stone-950/50 border-white/5 rounded-2xl h-12"
                                        placeholder="Rua, Número, Bairro, Cidade"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Telefone de Contato</label>
                                        <Input
                                            required
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="bg-stone-950/50 border-white/5 rounded-2xl h-12"
                                            placeholder="(11) 99999-9999"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Horário de Funcionamento</label>
                                        <Input
                                            required
                                            value={formData.hours}
                                            onChange={e => setFormData({ ...formData, hours: e.target.value })}
                                            className="bg-stone-950/50 border-white/5 rounded-2xl h-12"
                                            placeholder="Seg-Sáb: 09:00 - 20:00"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={formData.active}
                                        onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                        className="h-4 w-4 rounded border-white/10 bg-stone-900 accent-amber-500"
                                    />
                                    <label htmlFor="active" className="text-sm text-stone-300">Unidade ativa para agendamentos</label>
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
                                    {loading ? "Salvando..." : (branch ? "Salvar Alterações" : "Salvar Unidade")}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </>
    );
}
