"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Calendar,
    Check,
    ChevronLeft,
    ChevronRight,
    Scissors,
    User,
    Clock,
    Sparkles,
    Phone,
    UserCircle,
    LogIn,
    UserPlus,
    MapPin
} from "lucide-react";
import { MOCK_SERVICES, MOCK_BARBERS, Branch, Service, Barber } from "@/lib/mockConstants";
import { saveBookingAction, getAllMockBranchesAction, getServicesAction, getBarbersAction } from "@/lib/actions";

type Step = 'branch' | 'service' | 'barber' | 'datetime' | 'info' | 'confirmation';

export function BookingWizard({
    branches = [],
    services = [],
    barbers = []
}: {
    branches?: Branch[],
    services?: Service[],
    barbers?: Barber[]
}) {
    const searchParams = useSearchParams();
    const serviceFromUrl = searchParams.get('service');

    const [step, setStep] = useState<Step>('branch');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedBarber, setSelectedBarber] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [appointmentId, setAppointmentId] = useState('');

    // Internal state to hold data (either passed via props or fetched)
    const [internalBranches, setInternalBranches] = useState<Branch[]>(branches);
    const [internalServices, setInternalServices] = useState<Service[]>(services);
    const [internalBarbers, setInternalBarbers] = useState<Barber[]>(barbers);

    useEffect(() => {
        // Fetch Branches if missing
        if (branches.length > 0) {
            setInternalBranches(branches);
        } else {
            getAllMockBranchesAction().then(res => {
                if (res.success && res.branches) setInternalBranches(res.branches);
            });
        }

        // Fetch Services if missing
        if (services.length > 0) {
            setInternalServices(services);
        } else {
            getServicesAction().then(res => {
                if (res.success && res.services) setInternalServices(res.services);
            });
        }

        // Fetch Barbers if missing
        if (barbers.length > 0) {
            setInternalBarbers(barbers);
        } else {
            getBarbersAction().then(res => {
                if (res.success && res.barbers) setInternalBarbers(res.barbers);
            });
        }
    }, [branches, services, barbers]);

    useEffect(() => {
        if (serviceFromUrl && internalServices.some(s => s.id === serviceFromUrl)) {
            setSelectedService(serviceFromUrl);
            setStep('barber');
        }
    }, [serviceFromUrl, internalServices]);

    // Auto-select removed from here as it's now handled with internalBranches

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const result = await saveBookingAction({
                serviceId: selectedService,
                barberId: selectedBarber,
                branchId: selectedBranch,
                date: selectedDate,
                time: selectedTime,
                clientName,
                clientPhone,
            });

            if (result.success) {
                toast.success("Agendamento confirmado com sucesso!");
                setAppointmentId(result.appointmentId || '');
                setStep('confirmation');
            } else {
                toast.error("Erro ao realizar agendamento. Tente novamente.");
            }
        } catch (error) {
            console.error("Booking error:", error);
            toast.error("Erro inesperado. Verifique sua conexão.");
        } finally {
            setLoading(false);
        }
    };

    const canProceed = () => {
        if (step === 'branch') return !!selectedBranch;
        if (step === 'service') return !!selectedService;
        if (step === 'barber') return !!selectedBarber;
        if (step === 'datetime') return !!selectedDate && !!selectedTime;
        if (step === 'info') return !!clientName && !!clientPhone;
        return false;
    };

    const nextStep = () => {
        if (step === 'branch') {
            if (!selectedBranch) return toast.warning("Por favor, selecione uma unidade.");
            setStep('service');
        }
        else if (step === 'service') {
            if (!selectedService) return toast.warning("Por favor, selecione um serviço.");
            setStep('barber');
        }
        else if (step === 'barber') {
            if (!selectedBarber) return toast.warning("Por favor, selecione um barbeiro.");
            setStep('datetime');
        }
        else if (step === 'datetime') {
            if (!selectedDate || !selectedTime) return toast.warning("Por favor, escolha data e horário.");
            setStep('info');
        }
        else if (step === 'info') {
            if (!clientName || !clientPhone) return toast.warning("Preencha seu nome e telefone para continuar.");
            handleSubmit();
        }
    };

    const prevStep = () => {
        if (step === 'service') setStep('branch');
        else if (step === 'barber') setStep('service');
        else if (step === 'datetime') setStep('barber');
        else if (step === 'info') setStep('datetime');
    };

    const availableTimes = [];
    for (let hour = 9; hour <= 18; hour++) {
        for (let min of [0, 30]) {
            if (hour === 18 && min === 30) break;
            availableTimes.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
        }
    }

    const filteredServices = internalServices.filter(s => !selectedBranch || s.branch_id === selectedBranch);
    const filteredBarbers = internalBarbers.filter(b => !selectedBranch || b.branch_id === selectedBranch);
    const activeBranches = internalBranches.filter(b => b.active);

    // Auto-select branch if only one is active
    useEffect(() => {
        if (activeBranches.length === 1 && !selectedBranch) {
            setSelectedBranch(activeBranches[0].id);
            setStep('service');
        }
    }, [activeBranches, selectedBranch]);

    if (step === 'confirmation') {
        const service = internalServices.find(s => s.id === selectedService);
        const barber = internalBarbers.find(b => b.id === selectedBarber);
        const branch = internalBranches.find(b => b.id === selectedBranch);

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-3xl mx-auto w-full"
            >
                <div className="glass-premium rounded-[2.5rem] p-10 md:p-16 text-center border border-amber-500/20 tech-glow overflow-hidden relative">
                    {/* Background decoration */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full" />

                    <div className="relative z-10">
                        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/30">
                            <Check className="h-12 w-12" />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                            Sua Experiência <br /> <span className="text-amber-500">Começou.</span>
                        </h2>
                        <p className="text-stone-400 text-lg max-w-md mx-auto mb-12">
                            Tudo pronto para sua transformação no dia {new Date(selectedDate).toLocaleDateString('pt-BR')} às {selectedTime}.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
                            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 text-left">
                                <div className="p-3 bg-stone-900 rounded-xl text-amber-500">
                                    <Scissors size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-stone-500 uppercase font-black tracking-widest leading-none mb-1">Serviço</p>
                                    <p className="text-white font-bold">{service?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 text-left">
                                <div className="p-3 bg-stone-900 rounded-xl text-amber-500">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-stone-500 uppercase font-black tracking-widest leading-none mb-1">Mestre</p>
                                    <p className="text-white font-bold">{barber?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 text-left md:col-span-2">
                                <div className="p-3 bg-stone-900 rounded-xl text-amber-500">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-stone-500 uppercase font-black tracking-widest leading-none mb-1">Unidade</p>
                                    <p className="text-white font-bold">{branch?.name}</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Account Section */}
                        <div className="space-y-6 pt-10 border-t border-white/5">
                            <div className="space-y-2">
                                <h3 className="text-white font-bold text-xl">Deseja gerenciar seus agendamentos?</h3>
                                <p className="text-stone-500 text-sm">Crie uma conta em segundos para acompanhar seu histórico e ganhar pontos de fidelidade.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button
                                    className="h-16 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-sm uppercase tracking-widest btn3d gap-3"
                                    onClick={() => window.location.href = '/cadastro?booking=' + appointmentId}
                                >
                                    <UserPlus className="h-5 w-5" />
                                    CRIAR MINHA CONTA
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="h-16 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-sm uppercase tracking-widest gap-3"
                                    onClick={() => window.location.href = '/login'}
                                >
                                    <LogIn className="h-5 w-5" />
                                    JÁ TENHO CONTA
                                </Button>
                            </div>

                            <button
                                onClick={() => window.location.href = '/'}
                                className="text-stone-600 hover:text-stone-400 text-xs font-bold uppercase tracking-widest transition-colors"
                            >
                                CONTINUAR COMO CONVIDADO
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto w-full">
            {/* Step Indicators */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-3 md:gap-4 px-2">
                {['branch', 'service', 'barber', 'datetime', 'info'].map((s, i) => (
                    <div key={s} className="flex flex-col items-center gap-1.5 min-w-[50px] md:min-w-[70px]">
                        <div className={`h-1 w-full rounded-full transition-all duration-500 ${step === s ? 'bg-amber-500 tech-glow shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                            ['branch', 'service', 'barber', 'datetime', 'info'].indexOf(step) > i ? 'bg-amber-500/40' : 'bg-stone-800'
                            }`} />
                        <span className={`text-[9px] md:text-[10px] uppercase font-black tracking-widest ${step === s ? 'text-amber-500' : 'text-stone-600'
                            }`}>
                            Etapa {i + 1}
                        </span>
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {step === 'branch' && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Escolha a Unidade</h2>
                                <p className="text-stone-500 mt-2">Onde você deseja ser atendido hoje?</p>
                            </div>
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                {activeBranches.map(branch => (
                                    <div
                                        key={branch.id}
                                        onClick={() => {
                                            setSelectedBranch(branch.id);
                                            // Reset subsequent selections if branch changes
                                            if (selectedBranch !== branch.id) {
                                                setSelectedService('');
                                                setSelectedBarber('');
                                            }
                                        }}
                                        className={`group relative cursor-pointer rounded-[2rem] p-5 md:p-8 transition-all duration-300 border ${selectedBranch === branch.id
                                            ? 'border-amber-500 bg-amber-500/5 tech-glow'
                                            : 'border-white/5 bg-white/[0.02] active:bg-white/[0.08] hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className={`p-4 rounded-2xl transition-all duration-500 ${selectedBranch === branch.id ? 'bg-amber-500 text-stone-950 scale-110 shadow-lg' : 'bg-stone-800 text-amber-500 group-hover:scale-105'
                                                }`}>
                                                <MapPin className="h-7 w-7" />
                                            </div>
                                            {selectedBranch === branch.id && (
                                                <motion.div layoutId="check-branch" className="bg-amber-500 rounded-full p-1.5 shadow-lg">
                                                    <Check className="h-4 w-4 text-stone-950 font-bold" />
                                                </motion.div>
                                            )}
                                        </div>
                                        <div className="mt-6">
                                            <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-amber-500 transition-colors">{branch.name}</h3>
                                            <p className="mt-2 text-sm text-stone-400 font-medium">{branch.address}</p>
                                            <div className="mt-4 flex items-center gap-2">
                                                <Clock className="h-3.5 w-3.5 text-amber-500/50" />
                                                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">{branch.hours}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'service' && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Escolha o Serviço</h2>
                                <p className="text-stone-500 mt-2">Selecione a experiência na unidade {internalBranches.find(b => b.id === selectedBranch)?.name}</p>
                            </div>
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                {filteredServices.map(service => (
                                    <div
                                        key={service.id}
                                        onClick={() => setSelectedService(service.id)}
                                        className={`group relative cursor-pointer rounded-[2rem] p-5 md:p-6 transition-all duration-300 border ${selectedService === service.id
                                            ? 'border-amber-500 bg-amber-500/5 tech-glow'
                                            : 'border-white/5 bg-white/[0.02] active:bg-white/[0.08] hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className={`p-3 rounded-2xl transition-colors ${selectedService === service.id ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-amber-500'
                                                }`}>
                                                <Scissors className="h-6 w-6" />
                                            </div>
                                            {selectedService === service.id && (
                                                <motion.div layoutId="check" className="bg-amber-500 rounded-full p-1">
                                                    <Check className="h-4 w-4 text-stone-950" />
                                                </motion.div>
                                            )}
                                        </div>
                                        <div className="mt-4">
                                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">{service.name}</h3>
                                            <p className="mt-1 text-sm text-stone-500 leading-relaxed line-clamp-2">{service.description}</p>
                                        </div>
                                        <div className="mt-6 flex items-center justify-between">
                                            <span className="text-xs font-bold text-stone-600 uppercase tracking-widest">{service.duration}</span>
                                            <span className="text-2xl font-black text-amber-500">{service.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'barber' && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Mestre Barbeiro</h2>
                                <p className="text-stone-500 mt-2">Especialistas disponíveis na unidade {internalBranches.find(b => b.id === selectedBranch)?.name}</p>
                            </div>
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredBarbers.map(barber => (
                                    <div
                                        key={barber.id}
                                        onClick={() => setSelectedBarber(barber.id)}
                                        className={`group cursor-pointer rounded-[2rem] p-6 md:p-8 text-center transition-all duration-300 border ${selectedBarber === barber.id
                                            ? 'border-amber-500 bg-amber-500/5 tech-glow'
                                            : 'border-white/5 bg-white/[0.02] active:bg-white/[0.08] hover:border-white/20'
                                            }`}
                                    >
                                        <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl transition-all duration-500 ${selectedBarber === barber.id
                                            ? 'bg-amber-500 text-stone-950'
                                            : 'bg-stone-800 text-amber-500 group-hover:scale-110 group-hover:rotate-3'
                                            }`}>
                                            <UserCircle className="h-12 w-12" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white uppercase tracking-tighter">{barber.name}</h3>
                                        <p className="mt-1 text-xs text-stone-500 font-bold uppercase tracking-widest">{barber.specialty}</p>
                                        {selectedBarber === barber.id && (
                                            <motion.div layoutId="check-barber" className="mt-4 flex justify-center">
                                                <div className="bg-amber-500 rounded-full p-1">
                                                    <Check className="h-4 w-4 text-stone-950" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'datetime' && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Momento Exclusivo</h2>
                                <p className="text-stone-500 mt-2">Escolha o melhor horário para seu atendimento</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="glass-premium rounded-3xl p-6 border border-white/5">
                                    <div className="flex items-center gap-3 mb-4 text-amber-400">
                                        <Calendar className="h-5 w-5" />
                                        <span className="font-bold uppercase tracking-widest text-xs">Selecione a Data</span>
                                    </div>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full bg-stone-900/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500 transition-colors"
                                    />
                                </div>

                                <div className="glass-premium rounded-3xl p-6 border border-white/5">
                                    <div className="flex items-center gap-3 mb-4 text-amber-400">
                                        <Clock className="h-5 w-5" />
                                        <span className="font-bold uppercase tracking-widest text-xs">Horários Disponíveis</span>
                                    </div>
                                    {!selectedDate ? (
                                        <p className="text-stone-600 text-sm italic">Selecione uma data primeiro...</p>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                            {availableTimes.sort().map(time => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`rounded-xl border py-4 text-sm font-bold transition-all ${selectedTime === time
                                                        ? 'border-amber-500 bg-amber-500 text-stone-950 tech-glow shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                                                        : 'border-white/5 bg-white/[0.02] text-stone-400 active:bg-white/10'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'info' && (
                        <div className="max-w-xl mx-auto space-y-8">
                            <div className="text-center">
                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Quase Lá</h2>
                                <p className="text-stone-500 mt-2">Apenas alguns detalhes para finalizar seu agendamento</p>
                            </div>

                            <div className="glass-premium rounded-3xl p-8 border border-white/5 space-y-6">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-500" />
                                        <input
                                            value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}
                                            placeholder="NOME COMPLETO"
                                            className="w-full bg-stone-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500 transition-colors placeholder:text-stone-700 font-bold uppercase tracking-widest text-xs"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-500" />
                                        <input
                                            type="tel"
                                            value={clientPhone}
                                            onChange={(e) => setClientPhone(e.target.value)}
                                            placeholder="TELEFONE / WHATSAPP"
                                            className="w-full bg-stone-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500 transition-colors placeholder:text-stone-700 font-bold uppercase tracking-widest text-xs"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-amber-500/5 rounded-xl border border-amber-500/10">
                                    <Sparkles className="h-5 w-5 text-amber-500 shrink-0" />
                                    <p className="text-[10px] text-stone-400 font-medium leading-relaxed">
                                        NÃO É NECESSÁRIO LOGIN. Confirmaremos sua reserva instantaneamente e enviaremos os detalhes por WhatsApp.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="mt-12 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 md:gap-6">
                <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={step === 'service' || loading}
                    className={`w-full sm:w-auto text-stone-500 hover:text-white hover:bg-white/5 px-8 h-16 rounded-xl font-bold uppercase tracking-widest text-xs hidden sm:flex ${step === 'service' ? 'opacity-0 pointer-events-none' : ''
                        }`}
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>

                {step !== 'service' && (
                    <button
                        onClick={prevStep}
                        className="sm:hidden text-stone-500 font-bold uppercase tracking-widest text-[10px]"
                    >
                        Voltar para etapa anterior
                    </button>
                )}

                <Button
                    onClick={nextStep}
                    disabled={loading}
                    className="w-full sm:flex-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-black h-20 sm:h-16 text-xl sm:text-lg rounded-2xl btn3d tech-glow shadow-xl shadow-amber-600/20"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Clock className="h-5 w-5 animate-spin" />
                            PROCESSANDO...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            {step === 'info' ? 'FINALIZAR AGENDAMENTO' : 'PRÓXIMO PASSO'}
                            {step !== 'info' && <ChevronRight className="h-5 w-5" />}
                        </span>
                    )}
                </Button>
            </div>
        </div>
    );
}
