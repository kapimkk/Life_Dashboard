"use client";

import { FormEvent, useMemo, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Entry } from "../store";

type TransactionFormValue = {
  type: "entrada" | "saida";
  description: string;
  category: string;
  paymentMethod: "debito" | "credito";
  totalAmount: string;
  installments: string;
  date: string;
};

type TransactionModalProps = {
  open: boolean;
  title: string;
  initial?: Entry | null;
  onClose: () => void;
  onSubmit: (payload: Omit<Entry, "id">) => void;
};

const categories = [
  "Moradia",
  "Alimentacao",
  "Lazer",
  "Saude",
  "Transporte",
  "Assinaturas",
  "Educacao",
  "Outros",
];

function toForm(entry?: Entry | null): TransactionFormValue {
  if (!entry) {
    return {
      type: "saida",
      description: "",
      category: "",
      paymentMethod: "debito",
      totalAmount: "",
      installments: "1",
      date: new Date().toISOString().slice(0, 10),
    };
  }
  return {
    type: entry.type,
    description: entry.description,
    category: entry.category,
    paymentMethod: entry.paymentMethod,
    totalAmount: String(entry.totalAmount),
    installments: String(entry.installments),
    date: entry.date,
  };
}

export function TransactionModal({
  open,
  title,
  initial,
  onClose,
  onSubmit,
}: TransactionModalProps) {
  const [form, setForm] = useState<TransactionFormValue>(() => toForm(initial));
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((item) => item.toLowerCase().includes(term));
  }, [search]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const totalAmount = Number(form.totalAmount);
    const installments = Math.max(1, Number(form.installments));
    if (
      form.description.trim().length < 2 ||
      form.category.trim().length < 2 ||
      totalAmount <= 0 ||
      !form.date
    ) {
      return;
    }
    onSubmit({
      type: form.type,
      description: form.description.trim(),
      category: form.category.trim(),
      paymentMethod: form.paymentMethod,
      totalAmount,
      installments: form.paymentMethod === "credito" ? installments : 1,
      date: form.date,
    });
    onClose();
    setForm(toForm(null));
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-2">
          <Select
            label="Tipo"
            value={form.type}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                type: event.target.value as "entrada" | "saida",
              }))
            }
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saida</option>
          </Select>
          <Select
            label="Pagamento"
            value={form.paymentMethod}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                paymentMethod: event.target.value as "debito" | "credito",
              }))
            }
          >
            <option value="debito">Debito</option>
            <option value="credito">Credito</option>
          </Select>
        </div>
        <Input
          label="Descricao"
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({ ...current, description: event.target.value }))
          }
        />
        <Input
          label="Buscar categoria"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Digite para filtrar"
        />
        <Select
          label="Categoria"
          value={form.category}
          onChange={(event) =>
            setForm((current) => ({ ...current, category: event.target.value }))
          }
        >
          <option value="">Selecione</option>
          {filteredCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            label="Valor total"
            type="number"
            min={0}
            step="0.01"
            value={form.totalAmount}
            onChange={(event) =>
              setForm((current) => ({ ...current, totalAmount: event.target.value }))
            }
          />
          <Input
            label="Data"
            type="date"
            value={form.date}
            onChange={(event) =>
              setForm((current) => ({ ...current, date: event.target.value }))
            }
          />
        </div>
        {form.paymentMethod === "credito" ? (
          <Input
            label="Parcelas"
            type="number"
            min={1}
            max={24}
            value={form.installments}
            onChange={(event) =>
              setForm((current) => ({ ...current, installments: event.target.value }))
            }
          />
        ) : null}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Modal>
  );
}
