"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Flame, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { Habit, HabitFrequency, getHabitStreak, useHabitsStore } from "./store";
import { toISODate } from "./utils/streak";

const defaultForm = { title: "", frequency: "diario" as HabitFrequency };

export function HabitsPanel() {
  const { habits, toggleHabitToday, addHabit, updateHabit, deleteHabit } = useHabitsStore();
  const today = toISODate(new Date());
  const [open, setOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [form, setForm] = useState(defaultForm);

  function openCreate() {
    setEditingHabit(null);
    setForm(defaultForm);
    setOpen(true);
  }

  function openEdit(habit: Habit) {
    setEditingHabit(habit);
    setForm({ title: habit.title, frequency: habit.frequency });
    setOpen(true);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (form.title.trim().length < 3) {
      toast.error("Informe um nome de hábito com pelo menos 3 caracteres.");
      return;
    }

    if (editingHabit) {
      updateHabit(editingHabit.id, form);
      toast.success("Hábito atualizado.");
    } else {
      addHabit(form);
      toast.success("Hábito criado.");
    }
    setOpen(false);
    setForm(defaultForm);
  }

  return (
    <Card
      title="Hábitos Diários"
      action={
        <Button onClick={openCreate}>
          <Plus size={16} className="mr-1.5" />
          Novo Hábito
        </Button>
      }
    >
      {habits.length === 0 ? (
        <EmptyState
          title="Nenhum hábito criado"
          description="Crie seu primeiro hábito para iniciar sua ofensiva."
          action={<Button onClick={openCreate}>Criar hábito</Button>}
        />
      ) : null}
      <div className="space-y-3">
        {habits.map((habit) => {
          const checked = habit.doneDates.includes(today);
          const streak = getHabitStreak(habit);
          return (
            <div
              key={habit.id}
              className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <motion.button
                  className="flex flex-1 items-center justify-between text-left"
                  whileTap={{ scale: 0.99 }}
                  onClick={() => toggleHabitToday(habit.id)}
                >
                  <div>
                    <p className="font-medium">{habit.title}</p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                      <span className="rounded-md bg-zinc-800 px-2 py-0.5">
                        {habit.frequency === "diario" ? "Diário" : "Semanal"}
                      </span>
                      <span className="flex items-center gap-1 text-orange-400">
                        <Flame size={14} />
                        Ofensiva: {streak} dias
                      </span>
                    </p>
                  </div>
                  <motion.div
                    animate={checked ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CheckCircle2
                      className={checked ? "text-green-400" : "text-zinc-600"}
                      size={22}
                    />
                  </motion.div>
                </motion.button>
                <Button variant="ghost" onClick={() => openEdit(habit)}>
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    deleteHabit(habit.id);
                    toast.success("Hábito removido.");
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
        title={editingHabit ? "Editar hábito" : "Novo hábito"}
      >
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            label="Nome"
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
          />
          <Select
            label="Frequência"
            value={form.frequency}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                frequency: event.target.value as HabitFrequency,
              }))
            }
          >
            <option value="diario">Diário</option>
            <option value="semanal">Semanal</option>
          </Select>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">{editingHabit ? "Salvar" : "Criar"}</Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
