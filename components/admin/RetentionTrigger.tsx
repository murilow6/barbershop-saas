"use client";

import { useState } from "react";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { runRetentionJobAction } from "@/lib/actions";
import { useRouter } from "next/navigation";

export function RetentionTrigger() {
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(false);
    const [stats, setStats] = useState<{ sent: number } | null>(null);
    const router = useRouter();

    const handleRun = async () => {
        setLoading(true);
        setFinished(false);
        try {
            const res = await runRetentionJobAction();
            if (res.success) {
                setStats({ sent: res.results.filter((r: any) => r.success).length });
                setFinished(true);
                router.refresh();

                // Reset after 5 seconds
                setTimeout(() => {
                    setFinished(false);
                    setStats(null);
                }, 5000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            {finished && stats && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-xs font-bold animate-in fade-in slide-in-from-right-2">
                    <CheckCircle2 size={14} />
                    {stats.sent} {stats.sent === 1 ? 'lembrete enviado' : 'lembretes enviados'}
                </div>
            )}

            <Button
                onClick={handleRun}
                disabled={loading}
                variant="outline"
                className="bg-stone-900/50 border-amber-500/20 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 rounded-xl px-6 h-11 tech-glow-hover"
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        IA PROCESSANDO...
                    </>
                ) : (
                    <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        RODAR RETENÇÃO AI
                    </>
                )}
            </Button>
        </div>
    );
}
