import type { ReactNode } from "react";
import { Box } from "@mui/material";

interface ResponsiveGridProps {
  children: ReactNode;
  columns?: { mobile: number; desktop: number };
  gap?: number;
}

export function ResponsiveGrid({
  children,
  columns = { mobile: 1, desktop: 3 },
  gap = 16,
}: ResponsiveGridProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: `repeat(${columns.mobile}, 1fr)`,
          sm: `repeat(${columns.desktop}, 1fr)`,
        },
        gap: `${gap}px`,
        mb: 2,
      }}
    >
      {children}
    </Box>
  );
}
