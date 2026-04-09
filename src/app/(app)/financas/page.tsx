import { ModulePage } from "@/components/layout/module-page";
import { FinancePanel } from "@/features/finance/finance-panel";

export default function FinancasPage() {
  return (
    <ModulePage title="Financas" description="Gerencie saldo, lancamentos e faturas em um fluxo unico.">
      <FinancePanel />
    </ModulePage>
  );
}
