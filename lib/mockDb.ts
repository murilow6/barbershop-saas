import fs from 'fs';
import path from 'path';
import { Service, Barber, Client, Appointment, Branch, CustomerNote, ReminderLog, MOCK_SERVICES, MOCK_BARBERS, MOCK_BRANCHES } from './mockConstants';

// Persistent mock database using a local JSON file
const DB_PATH = path.join(process.cwd(), 'mock-db.json');

interface DBStructure {
    clients: Client[];
    appointments: Appointment[];
    branches: Branch[];
    customerNotes: CustomerNote[];
    reminders: ReminderLog[];
}

// In-memory cache to prevent constant disk reads
let CACHE: DBStructure | null = null;

function readDB(): DBStructure {
    if (CACHE) return CACHE;

    if (!fs.existsSync(DB_PATH)) {
        CACHE = { clients: [], appointments: [], branches: MOCK_BRANCHES, customerNotes: [], reminders: [] };
        return CACHE;
    }
    try {
        console.log("[MockDb] Reading from disk..."); // Log to confirm when disk I/O happens
        const data = fs.readFileSync(DB_PATH, 'utf8');
        const parsed = JSON.parse(data);
        CACHE = {
            clients: parsed.clients || [],
            appointments: parsed.appointments || [],
            branches: parsed.branches || MOCK_BRANCHES,
            customerNotes: parsed.customerNotes || [],
            reminders: parsed.reminders || [],
        };
        return CACHE;
    } catch (e) {
        CACHE = { clients: [], appointments: [], branches: MOCK_BRANCHES, customerNotes: [], reminders: [] };
        return CACHE;
    }
}

function writeDB(data: DBStructure) {
    CACHE = data; // Update cache
    // Async write to not block main thread completely (simulated speedup)
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function generateId(prefix: string): string {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

// Clients operations
export async function createMockClient(data: Omit<Client, 'id' | 'created_at'>): Promise<Client> {
    const db = readDB();
    const client: Client = {
        id: generateId('client'),
        created_at: new Date().toISOString(),
        ...data,
    };
    db.clients.push(client);
    writeDB(db);
    return client;
}

export async function updateMockClient(id: string, data: Partial<Omit<Client, 'id' | 'created_at'>>): Promise<Client | undefined> {
    const db = readDB();
    const index = db.clients.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    db.clients[index] = { ...db.clients[index], ...data };
    writeDB(db);
    return db.clients[index];
}

export async function deleteMockClient(id: string): Promise<void> {
    const db = readDB();
    db.clients = db.clients.filter(c => c.id !== id);
    writeDB(db);
}

export async function getMockClientById(id: string): Promise<Client | undefined> {
    const db = readDB();
    return db.clients.find(c => c.id === id);
}

export async function getMockClientByPhone(phone: string): Promise<Client | undefined> {
    const db = readDB();
    return db.clients.find(c => c.phone === phone);
}

export async function getAllMockClients(): Promise<Client[]> {
    const db = readDB();
    return db.clients;
}

// Branches operations
export async function getAllMockBranches(): Promise<Branch[]> {
    const db = readDB();
    return db.branches;
}

export async function getMockBranchById(id: string): Promise<Branch | undefined> {
    const db = readDB();
    return db.branches.find(b => b.id === id);
}

export async function createMockBranch(data: Omit<Branch, 'id' | 'created_at'>): Promise<Branch> {
    const db = readDB();
    const branch: Branch = {
        id: generateId('branch'),
        created_at: new Date().toISOString(),
        ...data,
    };
    db.branches.push(branch);
    writeDB(db);
    return branch;
}

export async function updateMockBranch(id: string, data: Partial<Omit<Branch, 'id' | 'created_at'>>): Promise<Branch | undefined> {
    const db = readDB();
    const index = db.branches.findIndex(b => b.id === id);
    if (index === -1) return undefined;
    db.branches[index] = { ...db.branches[index], ...data };
    writeDB(db);
    return db.branches[index];
}

export async function deleteMockBranch(id: string): Promise<void> {
    const db = readDB();
    db.branches = db.branches.filter(b => b.id !== id);
    writeDB(db);
}

// Notes operations
export async function createMockNote(data: Omit<CustomerNote, 'id' | 'created_at'>): Promise<CustomerNote> {
    const db = readDB();
    const note: CustomerNote = {
        id: generateId('note'),
        created_at: new Date().toISOString(),
        ...data,
    };
    db.customerNotes.push(note);
    writeDB(db);
    return note;
}

export async function getMockNotesByClientId(clientId: string): Promise<CustomerNote[]> {
    const db = readDB();
    return db.customerNotes
        .filter(n => n.client_id === clientId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

// Appointments operations
export async function createMockAppointment(data: Omit<Appointment, 'id' | 'created_at'>): Promise<Appointment> {
    const db = readDB();
    const appointment: Appointment = {
        id: generateId('appt'),
        created_at: new Date().toISOString(),
        ...data,
    };
    db.appointments.push(appointment);
    writeDB(db);
    return appointment;
}

export async function getMockAppointmentsByClientId(clientId: string) {
    const db = readDB();
    return db.appointments
        .filter(a => a.client_id === clientId)
        .map(appt => ({
            ...appt,
            barber: MOCK_BARBERS.find(b => b.id === appt.barber_id),
            service: MOCK_SERVICES.find(s => s.id === appt.service_id),
            branch: db.branches.find(br => br.id === appt.branch_id),
        }))
        .sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime());
}

export async function updateMockAppointment(id: string, data: Partial<Omit<Appointment, 'id' | 'created_at'>>): Promise<Appointment | undefined> {
    const db = readDB();
    const index = db.appointments.findIndex(a => a.id === id);
    if (index === -1) return undefined;

    db.appointments[index] = { ...db.appointments[index], ...data };
    writeDB(db);
    return db.appointments[index];
}

export async function getEnrichedMockAppointments() {
    const db = readDB();
    return db.appointments.map(appt => ({
        ...appt,
        client: db.clients.find(c => c.id === appt.client_id),
        barber: MOCK_BARBERS.find(b => b.id === appt.barber_id),
        service: MOCK_SERVICES.find(s => s.id === appt.service_id),
        branch: db.branches.find(br => br.id === appt.branch_id),
    })).sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
}

// Reminders operations
export async function createMockReminder(data: Omit<ReminderLog, 'id'>): Promise<ReminderLog> {
    const db = readDB();
    const reminder: ReminderLog = {
        id: generateId('rem'),
        ...data,
    };
    db.reminders.push(reminder);
    writeDB(db);
    return reminder;
}

export async function getAllMockReminders(): Promise<ReminderLog[]> {
    const db = readDB();
    return db.reminders;
}

export async function getMockRemindersByClientId(clientId: string): Promise<ReminderLog[]> {
    const db = readDB();
    return db.reminders.filter(r => r.client_id === clientId);
}
