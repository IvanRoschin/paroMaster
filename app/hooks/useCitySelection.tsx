'use client';

import { useEffect, useState } from 'react';

import { useCities } from '@/hooks/index';

export function useCitySelection(
  value: string,
  setFieldValue: (field: string, value: any) => void,
  fetchWarehouses: (city: string) => void
) {
  const [search, setSearch] = useState(value || '');
  const { allCities } = useCities(search);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  useEffect(() => {
    const query = search.trim().toLowerCase();
    const filtered = allCities
      .filter(c => (query ? c.description.toLowerCase().includes(query) : true))
      .map(c => c.description);
    setFilteredCities(filtered);
  }, [search, allCities]);

  const handleSelect = (city: string) => {
    setFieldValue('city', city);
    setSearch(city);
    setFilteredCities([]);
    fetchWarehouses(city);
  };

  useEffect(() => {
    setSearch(value || '');
  }, [value]);

  return { search, setSearch, filteredCities, handleSelect };
}
