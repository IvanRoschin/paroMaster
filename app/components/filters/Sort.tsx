'use client';

import { useContextSelector } from 'use-context-selector';

import { FiltersContext } from '@/context/FiltersContext';

export const Sort = () => {
  // ✅ подписываемся только на нужные части контекста
  const sort = useContextSelector(FiltersContext, ctx => ctx?.sort);
  const setSort = useContextSelector(FiltersContext, ctx => ctx?.setSort);

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
