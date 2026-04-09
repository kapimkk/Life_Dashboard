import { ModulePage } from "@/components/layout/module-page";
import { GoalsPanel } from "@/features/goals/goals-panel";

export default function GoalsPage() {
  return (
    <ModulePage title="Metas" description="Acompanhe objetivos com foco no proximo marco.">
      <GoalsPanel />
    </ModulePage>
  );
}
