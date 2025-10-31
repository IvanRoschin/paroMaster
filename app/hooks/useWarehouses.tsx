'use client';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { IWarehouse } from '@/types/index';

const useWarehouses = (city: string) => {
  const [warehouses, setWarehouses] = useState<IWarehouse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchWarehouses = async (c: string) => {
    if (!c.trim()) {
      setWarehouses([]);
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch('/api/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: c.trim() }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message || 'Failed');
      setWarehouses(result.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Не вдалося завантажити відділення');
      setWarehouses([]);
    } finally {
      setIsLoading(false);
    }
  };

  // fetch с debounce для ручного ввода
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchWarehouses(city), 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [city]);

  return { warehouses, isLoading, fetchWarehouses };
};

export default useWarehouses;
