import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { YearCount } from "../types";

interface EventsByYearChartProps {
  data: YearCount[];
}

export function EventsByYearChart({ data }: EventsByYearChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="year" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#1F3864" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
