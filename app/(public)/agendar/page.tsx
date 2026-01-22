import { getAllMockBranches } from "@/lib/mockDb";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { Suspense } from "react";

export default async function AgendarPage() {
    const branches = await getAllMockBranches();

    return (
        <div className="min-h-screen bg-stone-950 px-4 py-12 md:py-20 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-stone-900/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full">
                <Suspense fallback={
                    <div className="max-w-4xl mx-auto w-full flex items-center justify-center min-h-[400px]">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-12 w-12 rounded-full border-t-2 border-amber-500 animate-spin" />
                            <p className="text-stone-500 font-bold uppercase tracking-widest text-xs">Carregando experiência...</p>
                        </div>
                    </div>
                }>
                    <BookingWizard branches={branches} />
                </Suspense>
            </div>
        </div>
    );
}
