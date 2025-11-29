'use client';

import { useAppStore } from '@/app/store/appStore';

export const Sort = () => {
  const { filters } = useAppStore();
  // ✅ подписываемся только на нужные части контекста
  const sort = filters.sort;
  const setSort = filters.setSort;

  return (
    <div className="max-w-6xl mx-auto px-4 py-3 container md:w-[250px]">
      <h2 className="subtitle mb-4">Сортування</h2>
      <select
        value={sort || ''}
        onChange={e => setSort?.(e.target.value as 'asc' | 'desc' | '')}
        className="border rounded-md px-2 py-1"
      >
        <option value="">За замовчуванням</option>
        <option value="asc">Дешеві → Дорогі</option>
        <option value="desc">Дорогі → Дешеві</option>
      </select>
    </div>
  );
};
