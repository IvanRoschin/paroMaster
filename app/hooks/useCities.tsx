'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ICity } from '@/types/index';

const useCities = (query: string) => {
  const [allCities, setCities] = useState<ICity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: query.trim() }),
        });
        const result = await res.json();
        if (!result.success) throw new Error(result.message || 'Failed');

        setCities(result.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Не вдалося завантажити міста');
        setCities([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return { allCities, isLoading };
};

export default useCities;
