
"use client";

import { useEffect, useState } from "react";
import { getAllNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/supabaseDb";
import { Bell, Check, CheckCheck, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        setLoading(true);
        const data = await getAllNotifications(50); // Fetch last 50
        setNotifications(data);
        setLoading(false);
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        await markNotificationAsRead(id);
        toast.success("Marcada como lida");
        loadNotifications(); // Refresh
        // Trigger global event if using context (for now, polling in header will handle it eventually)
    };

    const handleMarkAllRead = async () => {
        await markAllNotificationsAsRead();
        toast.success("Todas marcadas como lidas");
        loadNotifications();
    };

    const filtered = notifications.filter(n => filter === 'all' ? true : !n.read);

    const getIcon = (type: string) => {
        switch (type) {
            case 'booking': return <CheckCircle2 className="text-green-500" />;
            case 'payment': return <CheckCheck className="text-blue-500" />;
            case 'info': return <AlertCircle className="text-yellow-500" />;
            default: return <Bell className="text-gray-400" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Central de Notificações
                    </h1>
                    <p className="text-gray-500 text-sm">Gerencie todos os avisos do sistema</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleMarkAllRead}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm border border-white/10 flex items-center gap-2 transition"
                    >
                        <CheckCheck className="w-4 h-4" />
                        Marcar todas como lidas
                    </button>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
                    >
                        <option value="all">Todas</option>
                        <option value="unread">Não lidas</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-3">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Carregando...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 border border-dashed border-gray-800 rounded-xl flex flex-col items-center justify-center text-gray-500">
                        <Bell className="w-12 h-12 mb-4 opacity-20" />
                        <p>Nenhuma notificação encontrada</p>
                    </div>
                ) : (
                    filtered.map((notif) => (
                        <div
                            key={notif.id}
                            className={`
                                relative group p-4 rounded-xl border transition-all duration-300
                                ${notif.read ? 'bg-black/20 border-white/5 opacity-60' : 'bg-white/5 border-amber-500/30 shadow-[0_0_15px_-5px_rgba(245,158,11,0.2)]'}
                            `}
                        >
                            <div className="flex gap-4 items-start">
                                <div className={`p-2 rounded-lg ${notif.read ? 'bg-white/5' : 'bg-amber-500/10'}`}>
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-medium ${notif.read ? 'text-gray-400' : 'text-white'}`}>
                                        {notif.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-1">{notif.message}</p>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                                        <Clock className="w-3 h-3" />
                                        {new Date(notif.created_at).toLocaleString('pt-BR')}
                                    </div>
                                </div>
                                {!notif.read && (
                                    <button
                                        onClick={() => handleMarkAsRead(notif.id)}
                                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition"
                                        title="Marcar como lida"
                                    >
                                        <Check className="w-4 h-4 text-green-500" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
