import { getEnrichedSupabaseAppointments, updateSupabaseAppointment, createSupabaseReminder } from "./supabaseDb";
import { notify } from "./notificationSystem";
import { Appointment } from "./mockConstants";

/**
 * Checks for completed appointments that haven't received a "Thank You" message
 * and sends it if 30-40 minutes have passed since completion.
 */
export async function checkAndSendThankYouMessages() {
    const appointments = await getEnrichedSupabaseAppointments();
    const now = new Date();
    const results = [];

    // Filter eligible appointments
    const eligibleAppointments = appointments.filter((appt: any) => {
        // 1. Must be completed
        if (appt.status !== 'completed') return false;

        // 2. Must have a finished_at timestamp
        if (!appt.finished_at) return false;

        // 3. Must NOT have sent thank you yet
        if (appt.thank_you_sent_at) return false;

        // 4. Time check: 30 minutes after completion
        const finishedAt = new Date(appt.finished_at);
        const diffMs = now.getTime() - finishedAt.getTime();
        const diffMinutes = diffMs / (1000 * 60);

        return diffMinutes >= 30;
    });

    console.log(`[ThankYouJob] Found ${eligibleAppointments.length} eligible appointments.`);

    for (const appt of eligibleAppointments) {
        if (!appt.client) continue;

        try {
            // Unified Notification
            await notify({
                type: 'APPOINTMENT_COMPLETED',
                clientName: appt.client.name,
                clientPhone: appt.client.phone
            });

            // Update appointment to prevent duplicate sending
            await updateSupabaseAppointment(appt.id, {
                thank_you_sent_at: new Date().toISOString()
            });

            // Log as interaction
            await createSupabaseReminder({
                client_id: appt.client.id,
                service_id: appt.service_id,
                sent_at: new Date().toISOString(),
                estimated_interval_days: 0,
                channel: 'whatsapp'
            });

            results.push({
                success: true,
                appointmentId: appt.id,
                client: appt.client.name
            });

        } catch (error) {
            console.error(`[ThankYouJob] Error processing appointment ${appt.id}:`, error);
            results.push({
                success: false,
                appointmentId: appt.id,
                error: String(error)
            });
        }
    }

    return results;
}
