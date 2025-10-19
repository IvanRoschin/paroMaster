'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { IGoodUI } from '@/types/IGood';

interface DailyDealsSectionProps {
  title?: string;
  goods: IGoodUI[]; // максимум 4
}

const DailyDealsSection: React.FC<DailyDealsSectionProps> = ({
  title = 'Пропозиції дня',
  goods,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Таймер обратного отсчета
  useEffect(() => {
    // Устанавливаем таймер до конца дня (23:59:59)
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    setTimeLeft(endOfDay.getTime() - now.getTime());

    const interval = setInterval(() => {
      const diff = endOfDay.getTime() - new Date().getTime();
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')} : ${minutes
      .toString()
      .padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <section className="my-10 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="text-red-600 font-semibold text-lg">
          ⏰ Закінчення через: {formatTime(timeLeft)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {goods.slice(0, 4).map((good, index) => (
          <Link
            key={index}
            href={`/product/${good._id}`}
            className="group relative border rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 bg-white"
          >
            <div className="relative w-full h-48 sm:h-56 lg:h-64">
              <Image
                src={good.src[0] || '/placeholder.png'}
                alt={good.title}
                fill
                className="object-contain p-4 bg-gray-50 group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-4 flex flex-col gap-2">
              <h3 className="text-sm sm:text-base font-medium line-clamp-2">
                {good.title}
              </h3>

              {good.discountPrice && good.discountPrice < good.price ? (
                <div className="flex items-center gap-2">
                  <span className="text-red-600 font-bold">
                    ₴{good.discountPrice.toLocaleString()}
                  </span>
                  <span className="line-through text-gray-400 text-sm">
                    ₴{good.price.toLocaleString()}
                  </span>
                  <span className="ml-auto bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded">
                    -
                    {Math.round(
                      ((good.price - good.discountPrice) / good.price) * 100
                    )}
                    %
                  </span>
                </div>
              ) : (
                <div className="text-gray-900 font-semibold">
                  ₴{good.price.toLocaleString()}
                </div>
              )}

              <button className="mt-2 w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors">
                Купити зараз
              </button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DailyDealsSection;
