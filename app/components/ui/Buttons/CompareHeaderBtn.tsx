'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FaBalanceScale } from 'react-icons/fa';

import { useCompare } from '@/context/CompareContext';

const CompareModalClient = dynamic(
  () => import('@/components/modal/CompareModal'),
  { ssr: false }
);

export default function CompareHeaderBtn() {
  const { items } = useCompare();
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center justify-center"
      >
        <FaBalanceScale className="w-7 h-7" />
        <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-primaryAccentColor text-white text-[10px] font-semibold">
          {items.length}
        </span>
      </button>

      {open && <CompareModalClient onClose={() => setOpen(false)} />}
    </>
  );
}
