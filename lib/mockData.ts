import fs from 'fs';
import path from 'path';

// Centralized mock data for the barbershop SaaS
// This uses a local JSON file to simulate a persistent database for demo purposes

const DB_PATH = path.join(process.cwd(), 'mock-db.json');

export interface Service {
    id: string;
    name: string;
    price: string;
    duration: string;
    description?: string;
}

export interface Barber {
    id: string;
    name: string;
    specialty: string;
    image?: string;
}

export interface Client {
    id: string;
    name: string;
    phone: string;
    email?: string;
    user_id?: string;
    loyalty_points?: number;
    created_at: string;
}

export interface Appointment {
    id: string;
    client_id: string;
    barber_id: string;
    service_id: string;
    starts_at: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes?: string;
    created_at: string;
}

// Initial Mock Data
export const MOCK_SERVICES: Service[] = [
    { id: 's1', name: 'Corte Masculino', price: 'R$ 45,00', duration: '30 min', description: 'Corte tradicional com máquina e tesoura' },
    { id: 's2', name: 'Barba Completa', price: 'R$ 35,00', duration: '20 min', description: 'Aparar, desenhar e finalizar' },
    { id: 's3', name: 'Corte + Barba', price: 'R$ 70,00', duration: '50 min', description: 'Combo completo' },
];

export const MOCK_BARBERS: Barber[] = [
    { id: 'b1', name: 'Carlos Silva', specialty: 'Cortes Clássicos' },
    { id: 'b2', name: 'André Ramos', specialty: 'Degradê & Navalha' },
    { id: 'b3', name: 'Felipe Costa', specialty: 'Barboterapia' },
];

interface DBStructure {
    clients: Client[];
    appointments: Appointment[];
}

function readDB(): DBStructure {
    if (!fs.existsSync(DB_PATH)) {
        return { clients: [], appointments: [] };
    }
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return { clients: [], appointments: [] };
    }
}

function writeDB(data: DBStructure) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Helper to generate IDs
function generateId(prefix: string): string {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

// Client operations - Server Actions / Server Side
export async function createClient(data: Omit<Client, 'id' | 'created_at'>): Promise<Client> {
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

export async function getClientByPhone(phone: string): Promise<Client | undefined> {
    const db = readDB();
    return db.clients.find(c => c.phone === phone);
}

export async function getAllClients(): Promise<Client[]> {
    const db = readDB();
    return db.clients;
}

// Appointment operations
export async function createAppointment(data: Omit<Appointment, 'id' | 'created_at'>): Promise<Appointment> {
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

export async function getAllAppointments(): Promise<Appointment[]> {
    const db = readDB();
    return db.appointments.sort((a, b) =>
        new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
    );
}

// Get enriched appointment data
export async function getEnrichedAppointments() {
    const db = readDB();
    return db.appointments.map(appt => ({
        ...appt,
        client: db.clients.find(c => c.id === appt.client_id),
        barber: MOCK_BARBERS.find(b => b.id === appt.barber_id),
        service: MOCK_SERVICES.find(s => s.id === appt.service_id),
    }));
}
