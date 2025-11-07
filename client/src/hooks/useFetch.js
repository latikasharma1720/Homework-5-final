import { useState, useEffect } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null), [loading, setLoading] = useState(true), [error, setError] = useState(null);
  useEffect(() => {
    if (!url) return;
    let isMounted = true;
    (async () => {
      try {
        setLoading(true); setError(null);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (isMounted) setData(json);
      } catch (e) { if (isMounted) { setError(e.message); setData(null); } }
      finally { if (isMounted) setLoading(false); }
    })();
    return () => { isMounted = false; };
  }, [url]);
  return { data, loading, error };
}
