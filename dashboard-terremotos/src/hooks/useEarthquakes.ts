import { useEffect, useState } from "react";
import type { Earthquake } from "../types";
import { fetchSismos } from "../firebase/firebaseConfig";

interface UseEarthquakesResult {
  data: Earthquake[];
  loading: boolean;
  error: string | null;
}

export function useEarthquakes(): UseEarthquakesResult {
  const [data, setData] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSismos()
      .then((sismos) => setData(sismos))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Error al consultar Firebase.";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}