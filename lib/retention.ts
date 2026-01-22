import { getAllSupabaseClients, getSupabaseAppointmentsByClientId, getAllSupabaseReminders, createSupabaseReminder, getSupabaseBranchById } from "./supabaseDb";
import { MOCK_SERVICES, Service, Appointment, ReminderLog } from "./mockConstants";
import { notify } from "./notificationSystem";

/**
 * Calcula o intervalo médio (em dias) entre os agendamentos de um cliente para um serviço específico.
 * Se houver apenas um agendamento, retorna um valor padrão (ex: 30 dias).
 */
async function calculateClientFrequency(appointments: Appointment[]): Promise<number> {
    if (appointments.length < 2) return 30; // Padrão se não houver histórico suficiente

    const dates = appointments
        .map(a => new Date(a.starts_at).getTime())
        .sort((a, b) => a - b);

    let totalDiff = 0;
    for (let i = 1; i < dates.length; i++) {
        totalDiff += (dates[i] - dates[i - 1]);
    }

    const avgMs = totalDiff / (dates.length - 1);
    const avgDays = Math.round(avgMs / (1000 * 60 * 60 * 24));

    return avgDays > 0 ? avgDays : 30;
}

/**
 * Identifica clientes que provavelmente precisam de um novo serviço.
 */
export async function identifyOverdueClients() {
    const clients = await getAllSupabaseClients();
    const allReminders = await getAllSupabaseReminders();
    const now = new Date();

    const overdue = [];

    for (const client of clients) {
        const appointments = await getSupabaseAppointmentsByClientId(client.id);
        if (appointments.length === 0) continue;

        // Filtrar apenas agendamentos completados ou passados para análise
        const completedAppts = appointments.filter(a =>
            a.status === 'completed' || new Date(a.starts_at) < now
        );

        if (completedAppts.length === 0) continue;

        // Verificar se já existe um agendamento futuro
        const futureAppt = appointments.find(a =>
            (a.status === 'pending' || a.status === 'confirmed') && new Date(a.starts_at) > now
        );
        if (futureAppt) continue;

        // Pegar o último agendamento
        const lastAppt = completedAppts[0]; // getMockAppointmentsByClientId já retorna ordenado decrescente
        const lastDate = new Date(lastAppt.starts_at);

        // Calcular frequência
        const avgDays = await calculateClientFrequency(completedAppts);

        // Data estimada do próximo
        const estimatedNextDate = new Date(lastDate);
        estimatedNextDate.setDate(lastDate.getDate() + avgDays);

        // Se a data estimada já passou (ou está muito próxima, ex: hoje)
        if (estimatedNextDate <= now) {
            // Verificar se recebeu lembrete recente (últimos 7 dias para evitar spam)
            const recentReminder = allReminders.find(r =>
                r.client_id === client.id &&
                (now.getTime() - new Date(r.sent_at).getTime()) < (7 * 24 * 60 * 60 * 1000)
            );

            if (!recentReminder) {
                const service = MOCK_SERVICES.find(s => s.id === lastAppt.service_id);
                overdue.push({
                    client,
                    lastService: service,
                    avgDays,
                    lastDate,
                });
            }
        }
    }

    return overdue;
}

/**
 * Processa e envia os lembretes de retenção.
 */
export async function processRetentionReminders() {
    const overdue = await identifyOverdueClients();
    const results = [];

    for (const item of overdue) {
        const { client, lastService, avgDays } = item;

        try {
            // Unified Notification
            await notify({
                type: 'RETENTION_ALERT',
                clientName: client.name,
                clientPhone: client.phone,
                meta: {
                    daysSinceLastVisit: avgDays
                }
            });

            // Registrar no log para evitar duplicidade
            await createSupabaseReminder({
                client_id: client.id,
                service_id: lastService?.id || 'unknown',
                sent_at: new Date().toISOString(),
                estimated_interval_days: avgDays,
                channel: 'whatsapp'
            });

            results.push({ success: true, client: client.name });
        } catch (error) {
            console.error(`Erro ao enviar lembrete para ${client.name}:`, error);
            results.push({ success: false, client: client.name, error });
        }
    }

    return results;
}
