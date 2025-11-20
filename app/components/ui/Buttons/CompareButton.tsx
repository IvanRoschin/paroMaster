'use client';

import { FaBalanceScale } from 'react-icons/fa';

import { useCompare } from '@/context/CompareContext';

export default function CompareButton({ good }: { good: any }) {
  const { add, items, remove } = useCompare();
  const isInCompare = items.some(i => i._id === good._id);

  return (
    <button
      title={isInCompare ? 'У порівнянні' : 'Додати до порівняння'}
      onClick={() => (isInCompare ? remove(good._id) : add(good))}
      className={`
        p-2 rounded-md transition-colors
        ${isInCompare ? ' text-red-500 ' : ' hover:text-red-500'}
      `}
    >
      <FaBalanceScale size={22} />
    </button>
  );
}
