import { useMemo, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { DashboardHeader } from "./DashboardHeader";
import { FiltersBar } from "./FiltersBar";
import { ResponsiveGrid } from "./ResponsiveGrid";
import { KpiCard } from "./KpiCard";
import { ChartCard } from "./ChartCard";
import { EventsByYearChart } from "./EventsByYearChart";
import { EventsByTypeChart } from "./EventsByTypeChart";
import { MagnitudeHistogram } from "./MagnitudeHistogram";
import { RecordsTable } from "./RecordsTable";
import { useEarthquakes } from "../hooks/useEarthquakes";
import { useIsMobile } from "../hooks/useIsMobile";
import { filterEvents, average, countByYear, countByType, buildHistogram } from "../utils/stats";
import type { TableColumn } from "../types";

const DESKTOP_COLUMNS: TableColumn[] = [
  { key: "date", header: "Fecha" },
  { key: "time", header: "Hora" },
  { key: "type", header: "Tipo" },
  { key: "depth", header: "Profundidad (km)" },
  { key: "magnitude", header: "Magnitud" },
  {
    key: "magType",
    header: "Escala",
    render: (row) => row.magType ?? "—",
  },
];

const MOBILE_COLUMNS: TableColumn[] = [
  { key: "date", header: "Fecha" },
  { key: "type", header: "Tipo" },
  {
    key: "magnitude",
    header: "Magnitud",
    render: (row) => `${row.magnitude.toFixed(1)} ${row.magType ?? ""}`.trim(),
  },
];

export function DashboardPage() {
  const { data, loading, error } = useEarthquakes();
  const isMobile = useIsMobile();

  // useState: guarda la selección de los dos filtros. Cada cambio dispara
  // un nuevo render en el que se recalculan KPIs, series y tabla con useMemo.
  const [selectedYear, setSelectedYear] = useState("Todos");
  const [selectedType, setSelectedType] = useState("Todos");

  const years = useMemo(() => {
    const unique = Array.from(new Set(data.map((e) => e.year))).sort((a, b) => a - b);
    return ["Todos", ...unique.map(String)];
  }, [data]);

  const eventTypes = useMemo(() => {
    const unique = Array.from(new Set(data.map((e) => e.type)));
    return ["Todos", ...unique];
  }, [data]);

  const filteredEvents = useMemo(
    () => filterEvents(data, selectedYear, selectedType),
    [data, selectedYear, selectedType]
  );

  const kpis = useMemo(
    () => ({
      total: filteredEvents.length,
      avgMagnitude: average(filteredEvents.map((e) => e.magnitude)),
      avgDepth: average(filteredEvents.map((e) => e.depth)),
    }),
    [filteredEvents]
  );

  const eventsByYear = useMemo(() => countByYear(filteredEvents), [filteredEvents]);
  const eventsByType = useMemo(() => countByType(filteredEvents), [filteredEvents]);
  const histogram = useMemo(() => buildHistogram(filteredEvents), [filteredEvents]);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: "auto" }}>
      <DashboardHeader
        title={isMobile ? "Dashboard de Sismos" : "Dashboard de Sismos Significativos"}
        subtitle="USGS, 1965-2016"
      />
      <FiltersBar
        years={years}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        eventTypes={eventTypes}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />
      <ResponsiveGrid columns={{ mobile: 1, desktop: 3 }}>
        <KpiCard label="Total de eventos" value={kpis.total} />
        <KpiCard label="Magnitud promedio" value={kpis.avgMagnitude} decimals={1} />
        <KpiCard label="Profundidad promedio" value={kpis.avgDepth} unit="km" decimals={0} />
      </ResponsiveGrid>
      <ResponsiveGrid columns={{ mobile: 1, desktop: 3 }}>
        <ChartCard title="Eventos por año">
          <EventsByYearChart data={eventsByYear} />
        </ChartCard>
        <ChartCard title="Eventos por tipo">
          <EventsByTypeChart data={eventsByType} compact={isMobile} />
        </ChartCard>
        <ChartCard title="Distribución de magnitud">
          <MagnitudeHistogram data={histogram} />
        </ChartCard>
      </ResponsiveGrid>
      <RecordsTable
        title="Detalle de registros"
        rows={filteredEvents}
        columns={isMobile ? MOBILE_COLUMNS : DESKTOP_COLUMNS}
        pageSize={10}
      />
    </Box>
  );
}
