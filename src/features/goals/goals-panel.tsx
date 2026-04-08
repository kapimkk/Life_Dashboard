"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Goal,
  GoalCategory,
  GoalStatus,
  getGoalProgress,
  useGoalsStore,
} from "./store";

const defaultForm = {
  title: "",
  category: "Curto Prazo" as GoalCategory,
  targetValue: "",
  currentValue: "",
  status: "todo" as GoalStatus,
};

const columns: { key: GoalStatus; title: string }[] = [
  { key: "todo", title: "A Fazer" },
  { key: "in_progress", title: "Em Andamento" },
  { key: "done", title: "Concluido" },
];

export function GoalsPanel() {
  const { goals, addGoal, updateGoal, updateGoalStatus, deleteGoal } = useGoalsStore();
  const [open, setOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [form, setForm] = useState(defaultForm);

  function openCreate() {
    setEditingGoal(null);
    setForm(defaultForm);
    setOpen(true);
  }

  function openEdit(goal: Goal) {
    setEditingGoal(goal);
    setForm({
      title: goal.title,
      category: goal.category,
      targetValue: String(goal.targetValue),
      currentValue: String(goal.currentValue),
      status: goal.status ?? "todo",
    });
    setOpen(true);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const targetValue = Number(form.targetValue);
    const currentValue = Number(form.currentValue);

    if (form.title.trim().length < 3 || targetValue <= 0 || currentValue < 0) {
      toast.error("Preencha título e valores válidos.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      category: form.category,
      targetValue,
      currentValue,
      status: form.status,
    };

    if (editingGoal) {
      updateGoal(editingGoal.id, payload);
      toast.success("Meta atualizada.");
    } else {
      addGoal(payload);
      toast.success("Meta criada.");
    }

    setOpen(false);
    setForm(defaultForm);
  }

  return (
    <Card
      title="Metas"
      action={
        <Button onClick={openCreate}>
          <Plus size={16} className="mr-1.5" />
          Nova Meta
        </Button>
      }
    >
      {goals.length === 0 ? (
        <EmptyState
          title="Sem metas cadastradas"
          description="Defina objetivos de curto, médio ou longo prazo."
          action={<Button onClick={openCreate}>Criar meta</Button>}
        />
      ) : null}
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-3">
          {columns.map((column) => (
            <div
              key={column.key}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-3 shadow-sm"
            >
              <p className="mb-3 text-sm font-semibold text-zinc-300">{column.title}</p>
              <div className="space-y-3">
                {goals
                  .filter((goal) => (goal.status ?? "todo") === column.key)
                  .map((goal) => {
                    const progress = getGoalProgress(goal);
                    return (
                      <div
                        key={goal.id}
                        className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <p className="font-medium">{goal.title}</p>
                          <span className="text-zinc-400">{goal.category}</span>
                        </div>
                        <div className="h-2 rounded-full bg-zinc-800">
                          <div
                            className="h-2 rounded-full bg-violet-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-zinc-400">
                          {progress.toFixed(1)}% ({goal.currentValue}/{goal.targetValue})
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {column.key !== "todo" ? (
                            <Button
                              variant="secondary"
                              onClick={() => updateGoalStatus(goal.id, "todo")}
                            >
                              A Fazer
                            </Button>
                          ) : null}
                          {column.key !== "in_progress" ? (
                            <Button
                              variant="secondary"
                              onClick={() => updateGoalStatus(goal.id, "in_progress")}
                            >
                              Em Andamento
                            </Button>
                          ) : null}
                          {column.key !== "done" ? (
                            <Button
                              variant="secondary"
                              onClick={() => updateGoalStatus(goal.id, "done")}
                            >
                              <ArrowRight size={14} className="mr-1" />
                              Concluir
                            </Button>
                          ) : null}
                        </div>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" onClick={() => openEdit(goal)}>
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              deleteGoal(goal.id);
                              toast.success("Meta removida.");
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                {goals.filter((goal) => (goal.status ?? "todo") === column.key).length === 0 ? (
                  <p className="rounded-lg border border-dashed border-zinc-700 p-3 text-xs text-zinc-500">
                    Nenhuma meta nesta coluna.
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingGoal ? "Editar meta" : "Nova meta"}
      >
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            label="Título"
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
          />
          <Select
            label="Categoria"
            value={form.category}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                category: event.target.value as GoalCategory,
              }))
            }
          >
            <option value="Curto Prazo">Curto Prazo</option>
            <option value="Médio Prazo">Médio Prazo</option>
            <option value="Longo Prazo">Longo Prazo</option>
          </Select>
          <Select
            label="Status"
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                status: event.target.value as GoalStatus,
              }))
            }
          >
            <option value="todo">A Fazer</option>
            <option value="in_progress">Em Andamento</option>
            <option value="done">Concluido</option>
          </Select>
          <Input
            label="Valor Alvo"
            type="number"
            min={0}
            value={form.targetValue}
            onChange={(event) =>
              setForm((current) => ({ ...current, targetValue: event.target.value }))
            }
          />
          <Input
            label="Valor Atual"
            type="number"
            min={0}
            value={form.currentValue}
            onChange={(event) =>
              setForm((current) => ({ ...current, currentValue: event.target.value }))
            }
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">{editingGoal ? "Salvar" : "Criar"}</Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
