import { useState, useEffect } from "react";

export function useWorldData() {
  const [worldData, setWorldData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-50m.json")
      .then(res => res.json())
      .then(data => {
        setWorldData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { worldData, loading };
}
