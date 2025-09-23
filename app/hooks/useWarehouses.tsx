'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const useWarehouses = (city: string) => {
  const [warehouses, setWarehouses] = useState<
    { Ref: string; Description: string }[]
  >([]);
  const [isWarehousesLoading, setIsWarehousesLoading] = useState(false);

  useEffect(() => {
    const fetchWarehouses = async () => {
      if (!city.trim()) return;
      try {
        setIsWarehousesLoading(true);
        const response = await fetch('/api/warehouses', {
          method: 'POST',
          body: JSON.stringify({ city }),
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (!result.success)
          throw new Error(result.message || 'Failed to fetch warehouses');
        setWarehouses(result.data || []);
      } catch (error) {
        console.error('Failed to fetch warehouses:', error);
        toast.error('Не вдалося завантажити відділення');
        setWarehouses([]);
      } finally {
        setIsWarehousesLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchWarehouses();
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [city]);

  return { warehouses, isWarehousesLoading };
};

export default useWarehouses;
