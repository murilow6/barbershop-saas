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
    getAllSupabaseBranches
} from "./supabaseDb";
import { MOCK_SERVICES, MOCK_BARBERS, Client, Branch, CustomerNote } from "./mockConstants";
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
            serviceName: service?.name,
            barberName: barber?.name,
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

export async function getAllMockBranchesAction() {
    "use server";
    const branches = await getAllSupabaseBranches();
    return { success: true, branches };
}

export async function runRetentionJobAction() {
    "use server";
    const results = await processRetentionReminders();
    return { success: true, results };
}
