"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/utils";
import { FilterBar, FinanceFilters } from "./components/filter-bar";
import { TransactionModal } from "./components/transaction-modal";
import { Entry, getInstallments, useFinanceStore } from "./store";

export function FinancePanel() {
  const { entries, balance, addEntry, updateEntry, deleteEntry } = useFinanceStore();
  const [open, setOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [filters, setFilters] = useState<FinanceFilters>({
    month: "",
    year: String(new Date().getFullYear()),
    date: "",
  });

  function openCreate() {
    setEditingEntry(null);
    setModalKey((value) => value + 1);
    setOpen(true);
  }

  function openEdit(entry: Entry) {
    setEditingEntry(entry);
    setModalKey((value) => value + 1);
    setOpen(true);
  }

  const installments = useMemo(() => getInstallments(entries), [entries]);

  const filteredInstallments = useMemo(() => {
    return installments.filter((item) => {
      if (filters.date) return item.dueDate === filters.date;
      const [year, month] = item.dueDate.split("-");
      const byYear = filters.year ? year === filters.year : true;
      const byMonth = filters.month ? month === filters.month : true;
      return byYear && byMonth;
    });
  }, [filters, installments]);

  const monthlyBalance = useMemo(() => {
    return filteredInstallments.reduce((acc, item) => {
      return item.type === "entrada"
        ? acc + item.installmentAmount
        : acc - item.installmentAmount;
    }, 0);
  }, [filteredInstallments]);

  return (
    <Card
      title="Finanças"
      action={
        <Button onClick={openCreate}>
          <Plus size={16} className="mr-1.5" />
          Nova Transação
        </Button>
      }
    >
      <p className="mb-3 text-sm text-zinc-400">Saldo atual</p>
      <p className={`mb-4 text-2xl font-bold ${balance >= 0 ? "text-green-400" : "text-red-400"}`}>
        {formatCurrency(balance)}
      </p>
      <p className="mb-4 text-sm text-zinc-500">
        Impacto no periodo filtrado:{" "}
        <span className={monthlyBalance >= 0 ? "text-green-400" : "text-red-400"}>
          {formatCurrency(monthlyBalance)}
        </span>
      </p>
      <div className="mb-4">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>
      {installments.length === 0 ? (
        <EmptyState
          title="Sem transações por enquanto"
          description="Adicione entradas e saídas para acompanhar seu fluxo de caixa."
          action={<Button onClick={openCreate}>Adicionar transação</Button>}
        />
      ) : null}
      <div className="space-y-2">
        {filteredInstallments.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 shadow-sm"
          >
            <div>
              <p className="text-sm">{entry.description}</p>
              <p className="text-xs text-zinc-500">
                {entry.category} - {entry.dueDate} - {entry.paymentMethod} -{" "}
                {entry.installmentNumber}/{entry.installments}
              </p>
              {entry.installments > 1 ? (
                <p className="text-xs text-zinc-600">
                  Compra total: {formatCurrency(entry.totalAmount)}
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <span className={entry.type === "entrada" ? "text-green-400" : "text-red-400"}>
                {entry.type === "entrada" ? "+" : "-"} {formatCurrency(entry.installmentAmount)}
              </span>
              <Button
                variant="ghost"
                onClick={() => {
                  const original = entries.find((item) => item.id === entry.entryId);
                  if (original) openEdit(original);
                }}
              >
                <Pencil size={14} />
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  deleteEntry(entry.entryId);
                  toast.success("Transação removida.");
                }}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <TransactionModal
        key={modalKey}
        open={open}
        title={editingEntry ? "Editar transacao" : "Nova transacao"}
        initial={editingEntry}
        onClose={() => setOpen(false)}
        onSubmit={(payload) => {
          if (editingEntry) {
            updateEntry(editingEntry.id, payload);
            toast.success("Transação atualizada.");
            return;
          }
          addEntry(payload);
          toast.success("Transação adicionada.");
        }}
      />
    </Card>
  );
}
