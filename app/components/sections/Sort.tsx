'use client';
import { useFilter } from '@/context/FiltersContext';

export const Sort = () => {
  const { sort, setSort } = useFilter();

  return (
    <div>
      <h2>Сортування</h2>
      <select
        value={sort}
        onChange={e => setSort(e.target.value as 'asc' | 'desc')}
      >
        <option value="">За замовчуванням</option>
        <option value="asc">Дешеві → Дорогі</option>
        <option value="desc">Дорогі → Дешеві</option>
      </select>
    </div>
  );
};
