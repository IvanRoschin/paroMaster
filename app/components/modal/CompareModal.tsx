'use client';

import { useEffect, useMemo, useState } from 'react';

import { useAppStore } from '@/app/store/appStore';
import { Button, Modal, NextImage } from '@/components';

const FIELDS_TO_COMPARE: { key: string; label: string }[] = [
  { key: 'price', label: 'Ціна' },
  { key: 'discountPrice', label: 'Ціна зі знижкою' },
  { key: 'brand', label: 'Бренд' },
  { key: 'model', label: 'Модель' },
  { key: 'averageRating', label: 'Середній рейтинг' },
  { key: 'ratingCount', label: 'К-сть оцінок' },
];

export default function CompareModal({ onClose }: { onClose: () => void }) {
  // const { items, remove, clear } = useCompare();
  const { compare } = useAppStore();

  const [mounted, setMounted] = useState(false);

  const differentFields = useMemo(() => {
    const diff = new Set<string>();
    if (compare.items.length <= 1) return diff;

    FIELDS_TO_COMPARE.forEach(field => {
      const values = compare.items.map(item => {
        const value = item[field.key];
        return typeof value === 'object' && value !== null
          ? JSON.stringify(value)
          : value;
      });
      if (new Set(values).size > 1) diff.add(field.key);
    });

    return diff;
  }, [compare.items]);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // после всех хуков

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      body={
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Порівняння товарів</h2>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {compare.items.map(item => (
              <div
                key={item._id}
                className="relative w-[160px] bg-white shadow rounded-xl p-4 border hover:shadow-lg transition-shadow flex-shrink-0"
              >
                <button
                  onClick={() => compare.remove(item._id)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-red-500 text-lg font-bold transition"
                >
                  ✕
                </button>

                <NextImage
                  src={item.src[0]}
                  alt={item.title}
                  width={120}
                  height={120}
                  classNames={{ image: 'object-cover rounded-lg' }}
                />

                <div className="mt-3 space-y-1 text-sm">
                  {FIELDS_TO_COMPARE.map(field => {
                    const value = item[field.key];
                    if (!value) return null;

                    const displayValue =
                      typeof value === 'object' && value !== null
                        ? (value.name ?? JSON.stringify(value))
                        : value;

                    return (
                      <p
                        key={field.key}
                        className={
                          differentFields.has(field.key)
                            ? 'text-red-500 font-bold'
                            : ''
                        }
                      >
                        {field.label}: {displayValue}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={compare.clear}
              className="px-6 py-2 font-semibold rounded-lg w-[180px]"
            >
              Очистити
            </Button>
          </div>
        </div>
      }
    />
  );
}
