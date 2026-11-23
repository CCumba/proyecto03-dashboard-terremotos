import { useEffect, useState } from "react";
import type { Earthquake } from "../types";
import { sampleEarthquakes } from "../data/sampleEarthquakes";

interface UseEarthquakesResult {
  data: Earthquake[];
  loading: boolean;
  error: string | null;
}

// En este sprint carga los datos de ejemplo (sampleEarthquakes) en vez del
// database.json completo del Sprint 1; la forma del hook (data/loading/error)
// es la misma que se usará cuando se conecte al archivo real.
export function useEarthquakes(): UseEarthquakesResult {
  const [data, setData] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    setData(sampleEarthquakes);
    setLoading(false);
  }, []);

  return { data, loading, error };
}
