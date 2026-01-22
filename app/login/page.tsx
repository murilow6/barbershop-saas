"use client";

import { useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const nextPath = params.get("next") || "/cliente";
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onLogin() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const role = data.user?.user_metadata?.role;

    if (role === "ADMIN") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/cliente";
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="mx-auto max-w-md">
          <Card className="p-6">
            <h1 className="text-2xl font-semibold">Entrar</h1>
            <p className="mt-1 text-sm text-neutral-300">Acesse sua conta para agendar ou administrar a barbearia.</p>

            <div className="mt-6 space-y-3">
              <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seuemail@dominio.com" />
              <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}

            <div className="mt-6 flex flex-col gap-3">
              <Button onClick={onLogin} disabled={loading || !email || !password}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
              <Button variant="ghost" onClick={() => router.push("/cadastro")}>Criar conta</Button>
            </div>

            <div className="mt-6 text-xs text-neutral-400">
              <p>
                Dica: para criar um ADMIN, defina o role do usuário como <b>ADMIN</b> no Supabase (Auth &gt; Users &gt; User metadata/app metadata).
              </p>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Carregando...</div>}>
      <LoginContent />
    </Suspense>
  );
}
