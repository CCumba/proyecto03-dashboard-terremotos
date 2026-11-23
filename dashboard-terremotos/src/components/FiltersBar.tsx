import { Stack } from "@mui/material";
import { SelectFilter } from "./SelectFilter";

interface FiltersBarProps {
  years: string[];
  selectedYear: string;
  onYearChange: (value: string) => void;
  eventTypes: string[];
  selectedType: string;
  onTypeChange: (value: string) => void;
}

export function FiltersBar({
  years,
  selectedYear,
  onYearChange,
  eventTypes,
  selectedType,
  onTypeChange,
}: FiltersBarProps) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
      <SelectFilter label="Año" value={selectedYear} options={years} onChange={onYearChange} />
      <SelectFilter
        label="Tipo de evento"
        value={selectedType}
        options={eventTypes}
        onChange={onTypeChange}
      />
    </Stack>
  );
}
