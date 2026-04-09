import { ModulePage } from "@/components/layout/module-page";
import { VaultPanel } from "@/features/vault/vault-panel";

export default function VaultPage() {
  return (
    <ModulePage title="Vault" description="Salve links e cursos para consumir com intencao depois.">
      <VaultPanel />
    </ModulePage>
  );
}
