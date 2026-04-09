import { ModulePage } from "@/components/layout/module-page";
import { HabitsPanel } from "@/features/habits/habits-panel";

export default function HabitosPage() {
  return (
    <ModulePage title="Habitos" description="Construa consistencia diaria com ofensivas e historico.">
      <HabitsPanel />
    </ModulePage>
  );
}
