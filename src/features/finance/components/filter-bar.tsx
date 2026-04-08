"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export type FinanceFilters = {
  month: string;
  year: string;
  date: string;
};

type FilterBarProps = {
  filters: FinanceFilters;
  onChange: (next: FinanceFilters) => void;
};

const monthOptions = [
  { value: "", label: "Todos os meses" },
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Marco" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-3 md:grid-cols-3">
      <Select
        label="Mes"
        value={filters.month}
        onChange={(event) =>
          onChange({
            ...filters,
            month: event.target.value,
            date: "",
          })
        }
      >
        {monthOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Input
        label="Ano"
        type="number"
        value={filters.year}
        onChange={(event) =>
          onChange({
            ...filters,
            year: event.target.value,
            date: "",
          })
        }
      />
      <Input
        label="Data especifica"
        type="date"
        value={filters.date}
        onChange={(event) =>
          onChange({
            ...filters,
            date: event.target.value,
          })
        }
      />
    </div>
  );
}
