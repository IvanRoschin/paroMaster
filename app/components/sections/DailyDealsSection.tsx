'use client';

import React, { useEffect, useState } from 'react';

import { IGoodUI } from '@/types/IGood';

import { ProductCard } from '../ui';

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
        <h2 className="title">{title}</h2>
        <div className="text-red-600 font-semibold text-lg">
          ⏰ Закінчення через: {formatTime(timeLeft)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {goods.slice(0, 4).map((good, i) => (
          <ProductCard key={i} good={good} />
        ))}
      </div>
    </section>
  );
};

export default DailyDealsSection;
