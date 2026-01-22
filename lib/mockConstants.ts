export interface Service {
    id: string;
    name: string;
    price: string;
    duration: string;
    branch_id: string;
    description?: string;
}

export interface Barber {
    id: string;
    name: string;
    specialty: string;
    branch_id: string;
    image?: string;
}

export interface Branch {
    id: string;
    name: string;
    address: string;
    phone: string;
    hours: string;
    active: boolean;
    created_at: string;
}

export interface Client {
    id: string;
    name: string;
    phone: string;
    email?: string;
    user_id?: string;
    observations?: string;
    status: 'visitante' | 'fidelizado';
    parent_client_id?: string;
    loyalty_points?: number;
    created_at: string;
}

export interface CustomerNote {
    id: string;
    client_id: string;
    text: string;
    author: string;
    created_at: string;
}

export interface Appointment {
    id: string;
    client_id: string;
    barber_id: string;
    service_id: string;
    branch_id: string;
    starts_at: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes?: string;
    finished_at?: string; // ISO string
    thank_you_sent_at?: string; // ISO string
    created_at: string;
}

export interface ReminderLog {
    id: string;
    client_id: string;
    service_id: string;
    sent_at: string;
    estimated_interval_days: number;
    channel: 'whatsapp';
}

// Mock Services
export const MOCK_SERVICES: Service[] = [
    { id: 's1', name: 'Corte Masculino', price: 'R$ 45,00', duration: '30 min', description: 'Corte tradicional com máquina e tesoura', branch_id: 'br1' },
    { id: 's2', name: 'Barba Completa', price: 'R$ 35,00', duration: '20 min', description: 'Aparar, desenhar e finalizar', branch_id: 'br1' },
    { id: 's3', name: 'Corte + Barba', price: 'R$ 70,00', duration: '50 min', description: 'Combo completo', branch_id: 'br2' },
];

// Mock Barbers
export const MOCK_BARBERS: Barber[] = [
    { id: 'b1', name: 'Carlos Silva', specialty: 'Cortes Clássicos', branch_id: 'br1' },
    { id: 'b2', name: 'André Ramos', specialty: 'Degradê & Navalha', branch_id: 'br1' },
    { id: 'b3', name: 'Felipe Costa', specialty: 'Barboterapia', branch_id: 'br2' },
];

export const MOCK_BRANCHES: Branch[] = [
    { id: 'br1', name: 'Sede Principal - Centro', address: 'Rua das Flores, 123', phone: '11 99999-9999', hours: 'Seg-Sáb: 09:00 - 20:00', active: true, created_at: new Date().toISOString() },
    { id: 'br2', name: 'Unidade Shopping - Sul', address: 'Av. das Americas, 500', phone: '11 88888-8888', hours: 'Todos os dias: 10:00 - 22:00', active: true, created_at: new Date().toISOString() },
];
