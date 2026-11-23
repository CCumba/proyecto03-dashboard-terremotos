import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { HistogramBin } from "../types";

interface MagnitudeHistogramProps {
  data: HistogramBin[];
}

export function MagnitudeHistogram({ data }: MagnitudeHistogramProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="label" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#9C5B33" />
      </BarChart>
    </ResponsiveContainer>
  );
}
