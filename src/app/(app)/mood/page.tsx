import { ModulePage } from "@/components/layout/module-page";
import { MoodPanel } from "@/features/mood/mood-panel";

export default function MoodPage() {
  return (
    <ModulePage title="Humor" description="Registre seu bem-estar e entenda seus padroes emocionais.">
      <MoodPanel />
    </ModulePage>
  );
}
