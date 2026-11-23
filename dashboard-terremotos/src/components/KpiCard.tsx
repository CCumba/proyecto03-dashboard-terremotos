import { Paper, Typography } from "@mui/material";

interface KpiCardProps {
  label: string;
  value: number;
  unit?: string;
  decimals?: number;
}

export function KpiCard({ label, value, unit, decimals = 0 }: KpiCardProps) {
  const formatted = value.toLocaleString("es-EC", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {formatted}
        {unit ? ` ${unit}` : ""}
      </Typography>
    </Paper>
  );
}
