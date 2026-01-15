'use client';

import { FieldArray, useFormikContext } from 'formik';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button, NextImage } from '@/components/index';
import { IGoodUI, IOrder } from '@/types/index';

interface GoodsFieldsProps {
  goods?: IGoodUI[];
  showSelect: boolean;
  setShowSelect: (value: boolean) => void;
}

export const GoodsFields = ({
  goods,
  showSelect,
  setShowSelect,
}: GoodsFieldsProps) => {
  const { values, setFieldValue } = useFormikContext<IOrder>();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGoods =
    goods?.filter(good =>
      `${good.title} ${good.brand} ${good.model}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) || [];

  const handleSelectGood = (good: IGoodUI) => {
    // проверяем, что товар ещё не добавлен
    if (values.orderedGoods.some(item => item.good === good._id)) {
      toast.warning('Цей товар вже додано!');
      return;
    }
    setFieldValue('orderedGoods', [
      ...values.orderedGoods,
      { good: good._id, quantity: 1, price: good.price },
    ]);
    setSearchQuery('');
    setShowSelect(false);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold">Товари у замовленні</h3>
      <FieldArray
        name="orderedGoods"
        render={({ remove }) => (
          <div>
            {values.orderedGoods.map((item, i) => {
              const goodInfo = goods?.find(g => g._id === item.good);
              return (
                <div
                  key={i}
                  className="border p-4 mb-4 flex items-center gap-4"
                >
                  <NextImage
                    src={goodInfo?.src?.[0] || '/placeholder.png'}
                    alt={goodInfo?.title || 'item'}
                    width={150}
                    height={150}
                    className="object-cover"
                  />
                  <span className="flex-1">{goodInfo?.title}</span>
                  <Button
                    type="button"
                    label="-"
                    onClick={() =>
                      setFieldValue(
                        `orderedGoods.${i}.quantity`,
                        Math.max((item.quantity || 1) - 1, 1)
                      )
                    }
                  />
                  <span>{item.quantity}</span>
                  <Button
                    type="button"
                    label="+"
                    onClick={() =>
                      setFieldValue(
                        `orderedGoods.${i}.quantity`,
                        (item.quantity || 0) + 1
                      )
                    }
                  />
                  <span>Ціна: {item.price} грн</span>
                  <span>
                    Сума: {(item.price || 0) * (item.quantity || 1)} грн
                  </span>
                  <Button
                    type="button"
                    label="Видалити"
                    onClick={() => remove(i)}
                  />
                </div>
              );
            })}
          </div>
        )}
      />

      <div className="flex justify-between mt-4 mb-4">
        <Button
          type="button"
          label="Додати товар"
          onClick={() => setShowSelect(true)}
        />
      </div>

      {showSelect && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Пошук товару за назвою, брендом чи моделлю"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-md mb-2"
          />
          <div className="max-h-60 overflow-y-auto border rounded-md">
            {filteredGoods.map(good => (
              <div
                key={good._id}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSelectGood(good)}
              >
                {good.title}
              </div>
            ))}
            {!filteredGoods.length && (
              <div className="p-2 text-gray-500">Нічого не знайдено</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
