"use client";

import { FormEvent, useState } from "react";
import { BanknoteArrowDown, BanknoteArrowUp, Pencil, Plus, Trash2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/utils";
import { Asset, getAssetPerformance, useInvestmentsStore } from "./store";

const defaultForm = {
  name: "",
  currentValue: "",
  targetValue: "",
};

export function InvestmentsPanel() {
  const { boxes, addBox, updateBox, applyMovement, deleteBox } = useInvestmentsStore();
  const [open, setOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [movementOpen, setMovementOpen] = useState(false);
  const [movementType, setMovementType] = useState<"deposit" | "withdraw">("deposit");
  const [selectedBox, setSelectedBox] = useState<Asset | null>(null);
  const [movementValue, setMovementValue] = useState("");
  const [form, setForm] = useState(defaultForm);

  function openCreate() {
    setEditingAsset(null);
    setForm(defaultForm);
    setOpen(true);
  }

  function openEdit(asset: Asset) {
    setEditingAsset(asset);
    setForm({
      name: asset.name,
      currentValue: String(asset.currentValue),
      targetValue: asset.targetValue ? String(asset.targetValue) : "",
    });
    setOpen(true);
  }

  function openMovement(asset: Asset, type: "deposit" | "withdraw") {
    setSelectedBox(asset);
    setMovementType(type);
    setMovementValue("");
    setMovementOpen(true);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const currentValue = Number(form.currentValue);
    const targetValue = Number(form.targetValue);
    if (form.name.trim().length < 2 || currentValue < 0) {
      toast.error("Preencha os dados da caixinha corretamente.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      currentValue,
      targetValue: targetValue > 0 ? targetValue : undefined,
    };
    if (editingAsset) {
      updateBox(editingAsset.id, payload);
      toast.success("Caixinha atualizada.");
    } else {
      addBox(payload);
      toast.success("Caixinha criada.");
    }
    setOpen(false);
    setForm(defaultForm);
  }

  function handleMovementSubmit(event: FormEvent) {
    event.preventDefault();
    if (!selectedBox) return;
    const amount = Number(movementValue);
    if (amount <= 0) {
      toast.error("Informe um valor valido.");
      return;
    }
    applyMovement(selectedBox.id, movementType, amount);
    toast.success(movementType === "deposit" ? "Aporte realizado." : "Resgate realizado.");
    setMovementOpen(false);
  }

  return (
    <Card
      title="Investimentos"
      action={
        <Button onClick={openCreate}>
          <Plus size={16} className="mr-1.5" />
          Nova Caixinha
        </Button>
      }
    >
      {boxes.length === 0 ? (
        <EmptyState
          title="Carteira vazia"
          description="Crie caixinhas para separar objetivos de investimento."
          action={<Button onClick={openCreate}>Adicionar caixinha</Button>}
        />
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {boxes.map((asset) => {
          const data = getAssetPerformance(asset);
          return (
            <div
              key={asset.id}
              className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 shadow-sm transition hover:shadow-lg hover:shadow-violet-900/10"
            >
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 font-semibold">
                  <Wallet size={16} className="text-violet-400" />
                  {asset.name}
                </p>
                <p className="text-sm text-zinc-300">{formatCurrency(data.totalValue)}</p>
              </div>
              {asset.targetValue ? (
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-xs text-zinc-400">
                    <span>Meta {formatCurrency(asset.targetValue)}</span>
                    <span>{data.progress.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800">
                    <div
                      className="h-2 rounded-full bg-violet-500"
                      style={{ width: `${data.progress}%` }}
                    />
                  </div>
                </div>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button variant="ghost" onClick={() => openEdit(asset)}>
                  <Pencil size={14} />
                </Button>
                <Button variant="secondary" onClick={() => openMovement(asset, "deposit")}>
                  <BanknoteArrowUp size={14} className="mr-1.5" />
                  Aportar
                </Button>
                <Button variant="secondary" onClick={() => openMovement(asset, "withdraw")}>
                  <BanknoteArrowDown size={14} className="mr-1.5" />
                  Resgatar
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    deleteBox(asset.id);
                    toast.success("Caixinha removida.");
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingAsset ? "Editar ativo" : "Novo ativo"}
      >
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            label="Nome"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
          />
          <Input
            label="Valor Atual"
            type="number"
            min={0}
            step="0.01"
            value={form.currentValue}
            onChange={(event) =>
              setForm((current) => ({ ...current, currentValue: event.target.value }))
            }
          />
          <Input
            label="Valor Objetivo (opcional)"
            type="number"
            min={0}
            step="0.01"
            value={form.targetValue}
            onChange={(event) =>
              setForm((current) => ({ ...current, targetValue: event.target.value }))
            }
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">{editingAsset ? "Salvar" : "Criar"}</Button>
          </div>
        </form>
      </Modal>
      <Modal
        open={movementOpen}
        onClose={() => setMovementOpen(false)}
        title={movementType === "deposit" ? "Aportar valor" : "Resgatar valor"}
      >
        <form className="space-y-3" onSubmit={handleMovementSubmit}>
          <p className="text-sm text-zinc-400">{selectedBox?.name}</p>
          <Input
            label="Valor"
            type="number"
            min={0}
            step="0.01"
            value={movementValue}
            onChange={(event) => setMovementValue(event.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setMovementOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Confirmar</Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
