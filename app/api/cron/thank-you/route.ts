import { NextResponse } from "next/server";
import { checkAndSendThankYouMessages } from "@/lib/thankYou";

export const dynamic = 'force-dynamic'; // Prevent static caching

export async function GET() {
    try {
        console.log("[API] Triggering Thank You Message Job...");
        const results = await checkAndSendThankYouMessages();

        return NextResponse.json({
            success: true,
            processed: results.length,
            details: results
        });
    } catch (error) {
        console.error("[API] Job failed:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
