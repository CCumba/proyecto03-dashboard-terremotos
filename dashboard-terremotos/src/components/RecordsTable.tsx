import { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import type { Earthquake, TableColumn } from "../types";

interface RecordsTableProps {
  title: string;
  rows: Earthquake[];
  columns: TableColumn[];
  pageSize?: number;
  emptyMessage?: string;
}

export function RecordsTable({
  title,
  rows,
  columns,
  pageSize = 10,
  emptyMessage = "No hay registros para este filtro.",
}: RecordsTableProps) {
  const [page, setPage] = useState(0);
  const start = page * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {rows.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      ) : (
        <>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col.key}>{col.header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {pageRows.map((row, i) => (
                  <TableRow key={start + i}>
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.render ? col.render(row) : String(row[col.key as keyof Earthquake])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[pageSize]}
          />
        </>
      )}
    </Paper>
  );
}
