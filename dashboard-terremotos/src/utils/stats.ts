import type { Earthquake, YearCount, TypeCount, HistogramBin } from "../types";

export function filterEvents(
  events: Earthquake[],
  selectedYear: string,
  selectedType: string
): Earthquake[] {
  return events.filter((e) => {
    const matchesYear = selectedYear === "Todos" || String(e.year) === selectedYear;
    const matchesType = selectedType === "Todos" || e.type === selectedType;
    return matchesYear && matchesType;
  });
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return sum / values.length;
}

export function countByYear(events: Earthquake[]): YearCount[] {
  const counts = new Map<number, number>();
  for (const e of events) {
    counts.set(e.year, (counts.get(e.year) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([year, count]) => ({ year, count }));
}

export function countByType(events: Earthquake[]): TypeCount[] {
  const counts = new Map<string, number>();
  for (const e of events) {
    counts.set(e.type, (counts.get(e.type) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([type, count]) => ({ type, count }));
}

export function buildHistogram(events: Earthquake[], binSize = 0.5): HistogramBin[] {
  if (events.length === 0) return [];
  const magnitudes = events.map((e) => e.magnitude);
  const min = Math.floor(Math.min(...magnitudes) / binSize) * binSize;
  const max = Math.ceil(Math.max(...magnitudes) / binSize) * binSize;

  const bins: HistogramBin[] = [];
  for (let start = min; start < max; start += binSize) {
    bins.push({ label: start.toFixed(1), count: 0 });
  }
  for (const m of magnitudes) {
    const idx = Math.min(
      bins.length - 1,
      Math.floor((m - min) / binSize)
    );
    if (bins[idx]) bins[idx].count += 1;
  }
  return bins;
}
