'use client';

import 'react-range-slider-input/dist/style.css';
import './PriceRange.css';

import { useState } from 'react';
import RangeSlider from 'react-range-slider-input';

import { useAppStore } from '@/app/store/appStore';

interface PriceRangeProps {
  minPriceFromDB: number;
  maxPriceFromDB: number;
  currencySymbol?: string;
}

const PriceRange: React.FC<PriceRangeProps> = ({
  minPriceFromDB,
  maxPriceFromDB,
  currencySymbol = '₴',
}) => {
  const { filters } = useAppStore();
  // Подписываемся на значения из контекста
  const minPrice = filters.minPrice;
  const maxPrice = filters.maxPrice;
  const setMinPrice = filters.setMinPrice;
  const setMaxPrice = filters.setMaxPrice;

  const [value, setValue] = useState<[number, number]>([
    minPrice ?? minPriceFromDB,
    maxPrice ?? maxPriceFromDB,
  ]);

  const handleChange = (vals: [number, number]) => {
    setValue(vals);
    setMinPrice?.(vals[0]);
    setMaxPrice?.(vals[1]);
  };

  return (
    <div className="range-filter">
      <h2 className="text-gray-800 font-semibold mb-4">Фільтр за ціною</h2>

      <RangeSlider
        min={minPriceFromDB}
        max={maxPriceFromDB}
        value={value}
        onInput={handleChange}
        thumbsDisabled={[false, false]}
        orientation="horizontal"
      />

      <div className="flex justify-between text-xs text-gray-700 mt-2">
        <span>
          {minPrice} {currencySymbol}
        </span>
        <span>
          {maxPrice} {currencySymbol}
        </span>
      </div>
    </div>
  );
};

export default PriceRange;
