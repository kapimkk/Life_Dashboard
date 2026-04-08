"use client";

import { FormEvent, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { MoodScore, moodOptions, useMoodStore } from "./store";

export function MoodPanel() {
  const { entries, upsertMood, deleteMood } = useMoodStore();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [score, setScore] = useState<MoodScore>(4);
  const [note, setNote] = useState("");

  const sorted = useMemo(
    () => [...entries].sort((a, b) => b.date.localeCompare(a.date)),
    [entries],
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const selected = moodOptions.find((option) => option.score === score);
    if (!selected) return;
    upsertMood({
      date,
      moodScore: score,
      emoji: selected.emoji,
      note: note.trim(),
    });
    toast.success("Check-in de humor salvo.");
    setOpen(false);
    setNote("");
  }

  return (
    <Card
      title="Mood Tracker"
      action={
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} className="mr-1.5" />
          Check-in
        </Button>
      }
    >
      {sorted.length === 0 ? (
        <EmptyState
          title="Sem registro de humor"
          description="Faca seu check-in diario em menos de 30 segundos."
          action={<Button onClick={() => setOpen(true)}>Registrar agora</Button>}
        />
      ) : null}
      <div className="space-y-2">
        {sorted.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/40 p-3"
          >
            <div>
              <p className="text-sm">
                {entry.emoji} {entry.date}
              </p>
              <p className="text-xs text-zinc-400">
                {entry.note || "Sem observacoes."}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                deleteMood(entry.id);
                toast.success("Registro removido.");
              }}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Check-in de Humor">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input label="Data" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <div>
            <p className="mb-2 text-sm text-zinc-300">Como voce se sente hoje?</p>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map((option) => (
                <button
                  key={option.score}
                  type="button"
                  className={`rounded-xl border p-2 text-xl transition ${
                    score === option.score
                      ? "border-violet-500 bg-violet-500/20"
                      : "border-zinc-700 bg-zinc-900"
                  }`}
                  onClick={() => setScore(option.score)}
                  title={option.label}
                >
                  {option.emoji}
                </button>
              ))}
            </div>
          </div>
          <Input
            label="Nota (opcional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Resumo rapido do seu dia"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
