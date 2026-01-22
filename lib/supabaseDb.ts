
import { createClient } from "@/lib/supabase/client";
import { Appointment, Client, Barber, Service, Branch, MOCK_BRANCHES } from "./mockConstants";

export async function createSupabaseClient(data: Partial<Client>) {
    const supabase = createClient();
    const { data: profile, error } = await supabase
        .from('profiles')
        .insert([{
            full_name: data.name,
            phone: data.phone,
            role: 'CLIENTE'
        }])
        .select()
        .single();

    if (error) throw error;

    // Adapt to Client interface
    return {
        id: profile.id,
        name: profile.full_name,
        phone: profile.phone,
        status: 'visitante', // Default for new
        created_at: profile.created_at
    } as Client;
}

export async function getSupabaseClientByPhone(phone: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .single();

    if (error || !data) return undefined;

    return {
        id: data.id,
        name: data.full_name,
        phone: data.phone,
        status: 'visitante',
        created_at: data.created_at
    } as Client;
}

export async function createSupabaseAppointment(data: any) {
    const supabase = createClient();
    const { data: appt, error } = await supabase
        .from('appointments')
        .insert([{
            user_id: data.client_id,
            barber_id: data.barber_id,
            service_id: data.service_id,
            starts_at: data.starts_at,
            status: data.status || 'pending'
        }])
        .select()
        .single();

    if (error) throw error;
    return appt;
}

export async function getSupabaseAppointments() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('appointments')
        .select(`
            *,
            profiles:user_id (full_name, phone),
            barbers:barber_id (name),
            services:service_id (name)
        `);

    if (error) return [];

    return data.map((a: any) => ({
        id: a.id,
        client_id: a.user_id,
        barber_id: a.barber_id,
        service_id: a.service_id,
        starts_at: a.starts_at,
        status: a.status,
        finished_at: a.finished_at,
        thank_you_sent_at: a.thank_you_sent_at,
        client: {
            id: a.user_id,
            name: a.profiles?.full_name,
            phone: a.profiles?.phone
        },
        barber: { name: a.barbers?.name },
        service: { name: a.services?.name }
    }));
}

export async function updateSupabaseAppointment(id: string, updates: any) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// --- Branches ---

export async function getAllSupabaseBranches() {
    // For now, return mock branches as they are static or need a table
    // If you created a branches table, query it here.
    return MOCK_BRANCHES;
}

export async function createSupabaseBranch(data: any) {
    // Placeholder if no table exists yet
    return {
        id: 'new_branch',
        ...data,
        active: true,
        created_at: new Date().toISOString()
    };
}

export async function updateSupabaseBranch(id: string, data: any) {
    return { id, ...data };
}

export async function deleteSupabaseBranch(id: string) {
    return true;
}

// --- Notes ---

export async function createSupabaseNote(data: any) {
    // Requires a 'customer_notes' table if you want to save this
    // For now, we can log or just return a mock success
    console.warn("Notes table not created in Supabase yet.");
    return {
        id: 'note_' + Date.now(),
        ...data,
        created_at: new Date().toISOString()
    };
}

// --- Client Updates ---

export async function updateSupabaseClient(id: string, data: any) {
    const supabase = createClient();

    // Check if 'status' or 'parent_client_id' fields exist in profiles
    // The schema provided only had role, full_name, phone. 
    // You might need to add columns to 'profiles' for robust CRM.

    const { data: profile, error } = await supabase
        .from('profiles')
        .update({
            full_name: data.name,
            phone: data.phone
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return profile;
}

export async function deleteSupabaseClient(id: string) {
    const supabase = createClient();
    await supabase.from('profiles').delete().eq('id', id);
}

// --- Specific Getters & Helpers ---

export async function getAllSupabaseClients() {
    const supabase = createClient();
    const { data } = await supabase.from('profiles').select('*');
    if (!data) return [];

    return data.map((p: any) => ({
        id: p.id,
        name: p.full_name,
        phone: p.phone,
        status: p.role === 'CLIENTE' ? 'visitante' : 'fidelizado', // Simple mapping
        created_at: p.created_at
    }));
}

export async function getSupabaseAppointmentsByClientId(clientId: string) {
    const supabase = createClient();
    const { data } = await supabase
        .from('appointments')
        .select(`
            *,
            barbers:barber_id (name),
            services:service_id (name)
        `)
        .eq('user_id', clientId)
        .order('starts_at', { ascending: false });

    if (!data) return [];

    return data.map((a: any) => ({
        id: a.id,
        client_id: a.user_id,
        barber_id: a.barber_id,
        service_id: a.service_id,
        starts_at: a.starts_at,
        status: a.status,
        finished_at: a.finished_at,
        thank_you_sent_at: a.thank_you_sent_at,
        barber: { name: a.barbers?.name },
        service: { name: a.services?.name }
    }));
}

export async function getEnrichedSupabaseAppointments() {
    return getSupabaseAppointments(); // Re-use existing enriched getter
}

export async function getSupabaseBranchById(id: string) {
    return MOCK_BRANCHES.find(b => b.id === id); // Mock for now
}

// --- Reminders ---

export async function createSupabaseReminder(data: any) {
    // Requires 'reminders' table. For now, log to console.
    console.log("[Supabase] Creating reminder:", data);
    return { id: 'rem_' + Date.now(), ...data };
}

export async function getAllSupabaseReminders() {
    return [];
}

// --- Notifications (System Alerts) ---

export async function createSystemNotification(data: {
    type: 'booking' | 'payment' | 'system' | 'info';
    title: string;
    message: string;
}) {
    // Requires a 'notifications' table. Failing gracefully if not exists.
    const supabase = createClient();
    try {
        await supabase.from('notifications').insert([{
            ...data,
            read: false,
            created_at: new Date().toISOString()
        }]);
    } catch (e) {
        console.warn("Notifications table missing or error:", e);
    }
}

export async function getUnreadNotifications() {
    const supabase = createClient();
    const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('read', false)
        .order('created_at', { ascending: false });

    return data || [];
}

export async function getAllNotifications(limit = 50) {
    const supabase = createClient();
    const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    return data || [];
}

export async function markNotificationAsRead(id: string) {
    const supabase = createClient();
    await supabase.from('notifications').update({ read: true }).eq('id', id);
}

export async function markAllNotificationsAsRead() {
    const supabase = createClient();
    await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);
}



