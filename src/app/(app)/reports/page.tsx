import { ModulePage } from "@/components/layout/module-page";
import { ReportsPanel } from "@/features/reports/reports-panel";

export default function ReportsPage() {
  return (
    <ModulePage title="Relatorios" description="Visualize a evolucao da sua rotina em dados e graficos.">
      <ReportsPanel />
    </ModulePage>
  );
}
