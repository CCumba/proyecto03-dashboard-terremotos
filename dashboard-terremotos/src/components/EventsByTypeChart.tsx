import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { TypeCount } from "../types";

interface EventsByTypeChartProps {
  data: TypeCount[];
  compact?: boolean;
}

const SHORT_LABELS: Record<string, string> = {
  Earthquake: "Earthq.",
  "Nuclear Explosion": "Nuclear",
  Explosion: "Expl.",
  "Rock Burst": "Rock B.",
};

export function EventsByTypeChart({ data, compact = false }: EventsByTypeChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    label: compact ? SHORT_LABELS[d.type] ?? d.type : d.type,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="label" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#2E6F8E" />
      </BarChart>
    </ResponsiveContainer>
  );
}
