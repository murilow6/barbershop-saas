-- DANGER: This script removes ALL data from the system.
-- Use this to prepare for production.

BEGIN;

-- Truncate tables with cascade to handle foreign keys
TRUNCATE TABLE 
    public.appointments,
    public.notifications,
    public.customer_notes
    CASCADE;

-- Optional: If you want to clear clients/services/barbers too, uncomment:
-- TRUNCATE TABLE public.clients CASCADE;
-- TRUNCATE TABLE public.barbers CASCADE;
-- TRUNCATE TABLE public.services CASCADE;
-- TRUNCATE TABLE public.branches CASCADE;

-- For now, we usually keep Services/Barbers/Branches as initial setup, 
-- but clear customer data (Appointments, Clients, Notifications).

-- If 'clients' are considered customer data (they are), clear them.
DELETE FROM public.clients;

COMMIT;
