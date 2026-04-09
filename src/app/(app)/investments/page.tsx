import { ModulePage } from "@/components/layout/module-page";
import { InvestmentsPanel } from "@/features/investments/investments-panel";

export default function InvestmentsPage() {
  return (
    <ModulePage title="Investimentos" description="Gerencie caixinhas e progresso dos seus sonhos.">
      <InvestmentsPanel />
    </ModulePage>
  );
}
