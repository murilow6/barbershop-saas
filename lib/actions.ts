"use server";

import {
    createSupabaseClient,
    createSupabaseAppointment,
    getSupabaseClientByPhone,
    updateSupabaseClient,
    createSupabaseBranch,
    createSupabaseNote,
    deleteSupabaseClient,
    deleteSupabaseBranch,
    updateSupabaseBranch,
    getAllSupabaseBranches,
    getAllSupabaseServices,
    getAllSupabaseBarbers,
    getAllSupabaseClients,
    getSupabaseAppointments
} from "./supabaseDb";
import { Client, Branch, CustomerNote } from "./mockConstants";
import { processRetentionReminders } from "./retention";
import { notify } from "./notificationSystem";

export async function saveBookingAction(formData: {
    serviceId: string;
    barberId: string;
    branchId: string;
    date: string;
    time: string;
    clientName: string;
    clientPhone: string;
}) {
    // Find or create client
    let client = await getSupabaseClientByPhone(formData.clientPhone);
    if (!client) {
        client = await createSupabaseClient({
            name: formData.clientName,
            phone: formData.clientPhone,
            status: 'visitante',
        });
    }

    // Create appointment
    const appointment = await createSupabaseAppointment({
        client_id: client.id,
        barber_id: formData.barberId,
        service_id: formData.serviceId,
        branch_id: formData.branchId,
        starts_at: `${formData.date}T${formData.time}:00`,
        status: 'pending',
    });

    // Unified Notification
    await notify({
        type: 'APPOINTMENT_NEW',
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        meta: {
            serviceName: (appointment as any).services?.name, // naming convention from supabase join
            barberName: (appointment as any).barbers?.name,
            date: formData.date,
            time: formData.time
        }
    });

    return { success: true, appointmentId: appointment.id };
}

export async function vincularClienteAction(visitanteId: string, fidelizadoId: string) {
    "use server";
    await updateSupabaseClient(visitanteId, {
        parent_client_id: fidelizadoId,
        status: 'fidelizado' // Ao vincular, ele "torna-se" parte do perfil fidelizado
    });
    return { success: true };
}

export async function createMockClientAction(data: Omit<Client, 'id' | 'created_at'>) {
    "use server";
    const client = await createSupabaseClient(data);
    return { success: true, client };
}

export async function createMockBranchAction(data: Omit<Branch, 'id' | 'created_at'>) {
    "use server";
    const branch = await createSupabaseBranch(data);
    return { success: true, branch };
}

export async function createMockNoteAction(data: Omit<CustomerNote, 'id' | 'created_at'>) {
    "use server";
    const note = await createSupabaseNote(data);
    return { success: true, note };
}

export async function updateMockClientAction(id: string, data: Partial<Omit<Client, 'id' | 'created_at'>>) {
    "use server";
    const client = await updateSupabaseClient(id, data);
    return { success: true, client };
}

export async function deleteMockClientAction(id: string) {
    "use server";
    await deleteSupabaseClient(id);
    return { success: true };
}

export async function updateMockBranchAction(id: string, data: Partial<Omit<Branch, 'id' | 'created_at'>>) {
    "use server";
    const branch = await updateSupabaseBranch(id, data);
    return { success: true, branch };
}

export async function deleteMockBranchAction(id: string) {
    "use server";
    await deleteSupabaseBranch(id);
    return { success: true };
}

// --- Data Fetchers for Client Components ---

export async function getAllMockBranchesAction() {
    const branches = await getAllSupabaseBranches();

    // Transform to match any expected "Mock" shape if needed, or just return
    return {
        success: true,
        branches: branches
    };
}

export async function getServicesAction() {
    try {
        const services = await getAllSupabaseServices();
        return { success: true, services };
    } catch (error) {
        return { success: false, services: [] };
    }
}

export async function getBarbersAction() {
    try {
        const barbers = await getAllSupabaseBarbers();
        return { success: true, barbers };
    } catch (error) {
        return { success: false, barbers: [] };
    }
}

export async function runRetentionJobAction() {
    "use server";
    const results = await processRetentionReminders();
    return { success: true, results };
}

export async function getDashboardStatsAction() {
    "use server";
    try {
        const appointments = await getSupabaseAppointments();
        const clients = await getAllSupabaseClients();
        const services = await getAllSupabaseServices();

        // Calculate Revenue (Sum of finished appointments price)
        const revenueCents = appointments
            .filter((a: any) => a.status === 'finished' || a.status === 'confirmed') // Considering confirmed as potential revenue for forecast
            .reduce((total: number, a: any) => {
                const service = services.find((s: any) => s.id === a.service_id);
                return total + (service?.price_cents || 0);
            }, 0);

        const revenue = revenueCents / 100;

        // Active Clients (Last 30 days or just total for simple MVP)
        const activeClients = clients.length;

        // Appointments Count
        const appointmentsCount = appointments.length;

        // Occupancy (Simple logic: appointments / total slots)
        // For now, hardcode slots or dynamic calculation. Let's return raw count.

        return {
            success: true,
            stats: {
                activeClients,
                appointmentsCount,
                revenue,
                occupancyRate: 0 // advanced logic needed later
            }
        };
    } catch (error) {
        return {
            success: false,
            stats: { activeClients: 0, appointmentsCount: 0, revenue: 0, occupancyRate: 0 }
        };
    }
}

