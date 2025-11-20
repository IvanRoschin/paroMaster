'use client';

import './PriceFilter.css';

import { useEffect, useState } from 'react';
import { useContextSelector } from 'use-context-selector';

import { FiltersContext } from '@/context/FiltersContext';

interface PriceFilterProps {
  currencySymbol?: string;
  minPriceFromDB: number;
  maxPriceFromDB: number;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({
  currencySymbol = '₴',
  minPriceFromDB,
  maxPriceFromDB,
}) => {
  // ✅ подписываемся только на нужные поля контекста
  const minPrice = useContextSelector(FiltersContext, ctx => ctx?.minPrice);
  const maxPrice = useContextSelector(FiltersContext, ctx => ctx?.maxPrice);
  const setMinPrice = useContextSelector(
    FiltersContext,
    ctx => ctx?.setMinPrice
  );
  const setMaxPrice = useContextSelector(
    FiltersContext,
    ctx => ctx?.setMaxPrice
  );

  const [values, setValues] = useState<string[]>([
    (minPrice ?? minPriceFromDB).toString(),
    (maxPrice ?? maxPriceFromDB).toString(),
  ]);

  const step = 200;
  const roundToStep = (value: number, step: number) =>
    Math.round(value / step) * step;

  useEffect(() => {
    setValues([
      (minPrice ?? minPriceFromDB).toString(),
      (maxPrice ?? maxPriceFromDB).toString(),
    ]);
  }, [minPriceFromDB, maxPriceFromDB, minPrice, maxPrice]);

  const handleRangeChange = (type: 'min' | 'max', value: string) => {
    const val = roundToStep(parseInt(value.replace(/\D/g, ''), 10) || 0, step);

    if (type === 'min') {
      const newMin = Math.min(val, parseInt(values[1]));
      setValues([newMin.toString(), values[1]]);
      setMinPrice?.(newMin);
    } else {
      const newMax = Math.max(parseInt(values[0]), val);
      setValues([values[0], newMax.toString()]);
      setMaxPrice?.(newMax);
    }
  };

  const trackLeft =
    ((parseInt(values[0]) - minPriceFromDB) /
      (maxPriceFromDB - minPriceFromDB)) *
    100;
  const trackRight =
    100 -
    ((parseInt(values[1]) - minPriceFromDB) /
      (maxPriceFromDB - minPriceFromDB)) *
      100;

  return (
    <div className="double-slider-box max-w-6xl mx-auto px-4 py-3 container md:w-[250px]">
      <h2 className="subtitle-main">Фільтр за ціною</h2>
      <div className="range-slider">
        <span
          className="slider-track"
          style={{
            left: `${((parseInt(values[0]) - minPriceFromDB) / (maxPriceFromDB - minPriceFromDB)) * 100}%`,
            right: `${100 - ((parseInt(values[1]) - minPriceFromDB) / (maxPriceFromDB - minPriceFromDB)) * 100}%`,
          }}
        />
        <input
          type="range"
          className="min-val"
          min={minPriceFromDB}
          max={maxPriceFromDB}
          step={step}
          value={values[0]}
          onChange={e => handleRangeChange('min', e.target.value)}
        />
        <input
          type="range"
          className="max-val"
          min={minPriceFromDB}
          max={maxPriceFromDB}
          step={step}
          value={values[1]}
          onChange={e => handleRangeChange('max', e.target.value)}
        />
        <div className="tooltip min-tooltip">
          {values[0]} {currencySymbol}
        </div>
        <div className="tooltip max-tooltip">
          {values[1]} {currencySymbol}
        </div>
      </div>
    </div>
  );
};
