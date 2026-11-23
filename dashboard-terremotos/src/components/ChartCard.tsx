import type { ReactNode } from "react";
import { Paper, Typography } from "@mui/material";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  height?: number;
}

export function ChartCard({ title, children, height = 220 }: ChartCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <div style={{ width: "100%", height }}>{children}</div>
    </Paper>
  );
}
