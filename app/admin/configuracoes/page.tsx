import { Card } from "@/components/ui/card";

export default function AdminConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Configurações</h1>
        <p className="mt-1 text-neutral-300">Ajuste horários, regras e identidade.</p>
      </header>

      <Card className="p-6">
        <h2 className="text-xl font-semibold">Horários e regras</h2>
        <p className="mt-2 text-sm text-neutral-300">
          Este módulo já está estruturado para evoluir. A recomendação é salvar configurações por barbearia (tenant)
          na tabela <b>tenants</b> e aplicar regras na criação de agendamentos.
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm text-neutral-300 space-y-1">
          <li>Horário de funcionamento (por dia da semana)</li>
          <li>Intervalo mínimo entre atendimentos</li>
          <li>Duração por serviço</li>
          <li>Políticas de cancelamento</li>
        </ul>
      </Card>
    </div>
  );
}
