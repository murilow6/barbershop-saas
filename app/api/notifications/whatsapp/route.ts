import { NextResponse } from "next/server";
import { sendWhatsAppNotification } from "@/lib/whatsapp";

/**
 * API Route to bridge booking events with WhatsApp notifications.
 * This can be called from server actions or background jobs.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { clientName, serviceName, barberName, date, time } = body;

        const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;

        if (!adminPhoneNumber) {
            console.error("ADMIN_PHONE_NUMBER not found in environment variables.");
            return NextResponse.json({ success: false, error: "Admin number not configured" }, { status: 500 });
        }

        const message = `💈 *Novo agendamento!*\n\nCliente: ${clientName}\nServiço: ${serviceName}\nBarbeiro: ${barberName}\nData: ${date}\nHorário: ${time}`;

        const result = await sendWhatsAppNotification({
            to: adminPhoneNumber,
            message,
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in WhatsApp Notification Route:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
