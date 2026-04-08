"use client";

import { FormEvent, useState } from "react";
import { BookOpen, ExternalLink, GraduationCap, Newspaper, Plus, Trash2, Video } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { VaultCategory, VaultItem, VaultStatus, useVaultStore } from "./store";

const iconByCategory = {
  Livro: BookOpen,
  Curso: GraduationCap,
  Artigo: Newspaper,
  Video: Video,
  Outros: ExternalLink,
};

const defaultForm = {
  title: "",
  url: "",
  category: "Artigo" as VaultCategory,
  status: "Pendente" as VaultStatus,
};

export function VaultPanel() {
  const { items, addItem, updateItem, toggleStatus, deleteItem } = useVaultStore();
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
  const [form, setForm] = useState(defaultForm);

  function openCreate() {
    setEditingItem(null);
    setForm(defaultForm);
    setOpen(true);
  }

  function openEdit(item: VaultItem) {
    setEditingItem(item);
    setForm({
      title: item.title,
      url: item.url,
      category: item.category,
      status: item.status,
    });
    setOpen(true);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (form.title.trim().length < 2 || !form.url.startsWith("http")) {
      toast.error("Preencha titulo e URL valida.");
      return;
    }
    if (editingItem) {
      updateItem(editingItem.id, form);
      toast.success("Link atualizado.");
    } else {
      addItem(form);
      toast.success("Link salvo no Vault.");
    }
    setOpen(false);
  }

  return (
    <Card
      title="Vault de Conhecimento"
      action={
        <Button onClick={openCreate}>
          <Plus size={16} className="mr-1.5" />
          Novo Link
        </Button>
      }
    >
      {items.length === 0 ? (
        <EmptyState
          title="Seu vault esta vazio"
          description="Salve livros, cursos e artigos para estudar depois."
          action={<Button onClick={openCreate}>Adicionar link</Button>}
        />
      ) : null}
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => {
          const Icon = iconByCategory[item.category];
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4 shadow-sm transition hover:border-zinc-600"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Icon size={16} className="text-violet-400" />
                  {item.category}
                </p>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs ${
                    item.status === "Concluido"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <a
                className="line-clamp-2 text-sm text-zinc-100 hover:text-violet-300"
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                {item.title}
              </a>
              <div className="mt-3 flex flex-wrap gap-1">
                <Button variant="secondary" onClick={() => openEdit(item)}>
                  Editar
                </Button>
                <Button variant="secondary" onClick={() => toggleStatus(item.id)}>
                  {item.status === "Pendente" ? "Concluir" : "Reabrir"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    deleteItem(item.id);
                    toast.success("Link removido.");
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Salvar Recurso">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            label="Titulo"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
          <Input
            label="URL"
            value={form.url}
            onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
            placeholder="https://..."
          />
          <Select
            label="Categoria"
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, category: e.target.value as VaultCategory }))
            }
          >
            <option value="Livro">Livro</option>
            <option value="Curso">Curso</option>
            <option value="Artigo">Artigo</option>
            <option value="Video">Video</option>
            <option value="Outros">Outros</option>
          </Select>
          <Select
            label="Status"
            value={form.status}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, status: e.target.value as VaultStatus }))
            }
          >
            <option value="Pendente">Pendente</option>
            <option value="Concluido">Concluido</option>
          </Select>
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
