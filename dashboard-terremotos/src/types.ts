export interface Earthquake {
  date: string;       // "1965-01-02"
  time: string;       // "13:44:18"
  year: number;        // derivado de date, para el filtro y la serie anual
  latitude: number;
  longitude: number;
  type: string;        // Earthquake | Nuclear Explosion | Explosion | Rock Burst
  depth: number;       // profundidad del hipocentro en km
  magnitude: number;
  magType: string | null; // MW, MB, MS, ML, ...
  status: string | null;  // Automatic | Reviewed
}

export interface TableColumn {
  key: string;
  header: string;
  render?: (row: Earthquake) => React.ReactNode;
}

export type YearCount = { year: number; count: number };
export type TypeCount = { type: string; count: number };
export type HistogramBin = { label: string; count: number };
