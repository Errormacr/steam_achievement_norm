import { useState, useEffect } from 'react';
import { ApiService } from '../services/api.services';
import { TimeAveragePercent } from '../types';
import { HistogramValue } from '../types/sharedProps';

export function useAchAccPercentHistogramData() {
  const [data, setData] = useState<HistogramValue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const steamId = localStorage.getItem('steamId');
    if (!steamId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    ApiService.get<TimeAveragePercent>(`user/${steamId}/avg-percent-by-time/`)
      .then((response) => {
        setData(Object.entries(response).map(([key, item]) => ({ count: +item.toFixed(2), name: key })));
      })
      .catch((err) => {
        console.error("Failed to fetch average percent by time:", err);
        setError(err);
        setData([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { data, isLoading, error };
}
