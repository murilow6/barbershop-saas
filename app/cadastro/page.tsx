"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function CadastroPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function onSignup() {
    setLoading(true);
    setError(null);
    setOk(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
          role: "CLIENTE",
        },
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }

    setOk("Conta criada! Se o projeto estiver com confirmação de e-mail habilitada, verifique sua caixa de entrada.");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="mx-auto max-w-md">
          <Card className="p-6">
            <h1 className="text-2xl font-semibold">Criar conta</h1>
            <p className="mt-1 text-sm text-neutral-300">Crie sua conta de cliente e comece a agendar.</p>

            <div className="mt-6 space-y-3">
              <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" />
              <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seuemail@dominio.com" />
              <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
            {ok ? <p className="mt-3 text-sm text-emerald-400">{ok}</p> : null}

            <div className="mt-6 flex flex-col gap-3">
              <Button onClick={onSignup} disabled={loading || !nome || !email || !password}>
                {loading ? "Criando..." : "Criar conta"}
              </Button>
              <Button variant="ghost" onClick={() => router.push("/login")}>Voltar ao login</Button>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
