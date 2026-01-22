
import { createSystemNotification } from "./supabaseDb";
import { sendWhatsAppNotification } from "./whatsapp";

// Define Event Types
export type NotificationType =
    | 'APPOINTMENT_NEW'
    | 'APPOINTMENT_REMINDER'
    | 'APPOINTMENT_COMPLETED' // Thank You
    | 'RETENTION_ALERT';

interface NotificationPayload {
    type: NotificationType;
    clientName: string;
    clientPhone: string;
    meta?: {
        serviceName?: string;
        date?: string;
        time?: string;
        barberName?: string;
        daysSinceLastVisit?: number;
    };
}

/**
 * Central Hub for all notifications.
 * Ensures that every important event triggers:
 * 1. An Internal Alert (System Notification)
 * 2. An External Message (WhatsApp) - Optional/Configurable
 */
export async function notify(payload: NotificationPayload) {
    const { type, clientName, clientPhone, meta } = payload;
    const adminPhone = process.env.ADMIN_PHONE_NUMBER;

    console.log(`[NotificationSystem] Processing event: ${type} for ${clientName}`);

    try {
        // --- 1. INTERNAL ALERTS (Always) ---
        let alertTitle = '';
        let alertMessage = '';

        switch (type) {
            case 'APPOINTMENT_NEW':
                alertTitle = 'Novo Agendamento';
                alertMessage = `${clientName} agendou ${meta?.serviceName || 'serviço'} para ${meta?.date} às ${meta?.time}`;
                break;
            case 'APPOINTMENT_REMINDER':
                alertTitle = 'Lembrete Enviado';
                alertMessage = `Lembrete (Retenção) enviado para ${clientName}`;
                break;
            case 'APPOINTMENT_COMPLETED':
                alertTitle = 'Agradecimento Enviado';
                alertMessage = `Agradecimento pós-corte enviado para ${clientName}`;
                break;
            case 'RETENTION_ALERT':
                alertTitle = 'Risco de Churn';
                alertMessage = `Cliente ${clientName} não volta há ${meta?.daysSinceLastVisit} dias.`;
                break;
        }

        await createSystemNotification({
            type: 'system', // Generic type for DB
            title: alertTitle,
            message: alertMessage
        });

        // --- 2. EXTERNAL MESSAGES (WhatsApp) ---
        // Logic specific to each type

        if (type === 'APPOINTMENT_NEW' && adminPhone) {
            const waMessage = `💈 *Novo agendamento!*\n\nCliente: ${clientName}\nServiço: ${meta?.serviceName}\nBarbeiro: ${meta?.barberName}\nData: ${new Date(meta?.date || '').toLocaleDateString('pt-BR')}\nHorário: ${meta?.time}`;
            await sendWhatsAppNotification({ to: adminPhone, message: waMessage });
        }

        if (type === 'APPOINTMENT_COMPLETED') {
            const firstName = clientName.split(' ')[0];
            const waMessage = `Obrigado pela visita, ${firstName}!\nFoi um prazer te atender hoje.\nEsperamos que tenha curtido o corte.`;
            await sendWhatsAppNotification({ to: clientPhone, message: waMessage });
        }

        if (type === 'RETENTION_ALERT') {
            const firstName = clientName.split(' ')[0];
            const waMessage = `Oi ${firstName}! 👋\nJá faz cerca de ${meta?.daysSinceLastVisit} dias desde o seu último serviço.\nQue tal agendar novamente para manter o visual em dia? ✂️\n\nReserve aqui: https://barber-saas.com/agendar`;
            await sendWhatsAppNotification({ to: clientPhone, message: waMessage });
        }

    } catch (error) {
        // Non-blocking error handling
        console.error(`[NotificationSystem] Error processing ${type}:`, error);
        // We could also create an error alert here if needed
    }
}
