const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'mock-db.json');
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// Add an overdue client
const overdueClient = {
    id: 'client_overdue_1',
    name: 'Cliente Antigo Teste',
    phone: '11912345678',
    status: 'fidelizado',
    created_at: '2025-10-01T10:00:00.000Z',
    loyalty_points: 50
};

// Add historical appointments to establish frequency (approx 15 days)
const appts = [
    {
        id: 'appt_old_1',
        client_id: 'client_overdue_1',
        service_id: 's1',
        barber_id: 'b1',
        branch_id: 'br1',
        starts_at: '2025-11-01T10:00:00',
        status: 'completed',
        created_at: '2025-10-31T10:00:00.000Z'
    },
    {
        id: 'appt_old_2',
        client_id: 'client_overdue_1',
        service_id: 's1',
        barber_id: 'b1',
        branch_id: 'br1',
        starts_at: '2025-11-16T10:00:00',
        status: 'completed',
        created_at: '2025-11-15T10:00:00.000Z'
    }
];

// Current date is 2026-01-21. Last appt was 2025-11-16. 
// Frequency is 15 days. Overdue since 2025-12-01 approx.

db.clients.push(overdueClient);
db.appointments.push(...appts);

fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
console.log('Seed retention data injected.');
