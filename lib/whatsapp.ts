/**
 * WhatsApp Cloud API Integration Utility
 * Handles sending template or text messages to admins/barbers.
 */

interface SendMessageParams {
    to: string;
    message: string;
}

/**
 * Sends a raw text message via WhatsApp Cloud API.
 * Note: For production, you usually use Templates to initiate conversations.
 * This function handles errors silently to avoid blocking the booking flow.
 */
export async function sendWhatsAppNotification({ to, message }: SendMessageParams) {
    const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
    const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
        // Mock mode for development
        console.warn(`[Mock WhatsApp] Credentials missing. Message to ${to}: "${message}"`);
        return { success: true, mock: true };
    }

    try {
        const response = await fetch(
            `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: to.replace(/\D/g, ""), // Remove non-digits
                    type: "text",
                    text: {
                        preview_url: false,
                        body: message,
                    },
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("WhatsApp Cloud API error:", data);
            return { success: false, error: data };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Failed to send WhatsApp notification:", error);
        return { success: false, error };
    }
}
