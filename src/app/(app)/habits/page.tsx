import { ModulePage } from "@/components/layout/module-page";
import { HabitsPanel } from "@/features/habits/habits-panel";

export default function HabitsPage() {
  return (
    <ModulePage title="Habitos" description="Construa consistencia diaria com ofensivas e historico.">
      <HabitsPanel />
    </ModulePage>
  );
}
