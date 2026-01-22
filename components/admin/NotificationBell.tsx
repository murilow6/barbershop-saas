"use client";

import { useEffect, useState } from "react";
import { getUnreadNotifications, markNotificationAsRead } from "@/lib/supabaseDb";
import { Bell } from "lucide-react";
import { toast } from "sonner";

export function NotificationBell() {
    const [unread, setUnread] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        const notifs = await getUnreadNotifications();
        setUnread(notifs);
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30s
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id: string) => {
        await markNotificationAsRead(id);
        toast.success("Notificação marcada como lida");
        await fetchNotifications();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-800 transition"
            >
                <Bell className="w-6 h-6 text-white" />
                {unread.length > 0 && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#1A1A1A] border border-gray-800 rounded-lg shadow-xl z-50">
                    <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                        <h3 className="font-semibold text-sm">Notificações</h3>
                        <span className="text-xs text-gray-400">{unread.length} novas</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {unread.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                Nenhuma notificação nova
                            </div>
                        ) : (
                            unread.map((notif) => (
                                <div key={notif.id} className="p-3 hover:bg-gray-800 transition border-b border-gray-800 last:border-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-medium text-sm text-yellow-500">{notif.title}</h4>
                                        <button
                                            onClick={() => handleMarkAsRead(notif.id)}
                                            className="text-xs text-gray-400 hover:text-white"
                                        >
                                            Ler
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-300">{notif.message}</p>
                                    <span className="text-[10px] text-gray-500 mt-2 block">
                                        {new Date(notif.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-3 border-t border-gray-700 text-center">
                        <a href="/admin/notificacoes" className="text-xs text-amber-500 hover:text-amber-400 font-medium">
                            Ver todas as notificações
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
