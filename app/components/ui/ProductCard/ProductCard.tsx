'use client';

import { useShoppingCart } from 'app/context/ShoppingCartContext';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { formatCurrency } from '@/app/utils/formatCurrency';
import { Button, NextImage } from '@/components/index';
import { IGoodUI } from '@/types/IGood';

interface IProductCardProps {
  good: IGoodUI;
}

const ProductCard: React.FC<IProductCardProps> = ({ good }) => {
  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useShoppingCart();

  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    setQuantity(getItemQuantity(good._id));
  }, [getItemQuantity, good._id]);

  const { displayPrice, discountPercent } = useMemo(() => {
    const hasDiscount = good.discountPrice && good.discountPrice < good.price;

    return {
      displayPrice: hasDiscount ? good.discountPrice! : good.price,
      discountPercent: hasDiscount
        ? Math.round(((good.price - good.discountPrice!) / good.price) * 100)
        : 0,
    };
  }, [good.price, good.discountPrice]);

  return (
    <li className="flex flex-col border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-all bg-white h-full">
      {/* Верх: изображение и бейджи */}
      <div className="relative w-full h-[200px] mb-3 overflow-hidden rounded-lg flex-shrink-0">
        <Link href={`/catalog/${good._id}`}>
          <NextImage
            src={good.src?.[0] || '/placeholder.png'}
            alt={good.title}
            useSkeleton
            fill
            className="bg-gray-50 rounded-lg"
            classNames={{
              wrapper: 'w-full h-full bg-gray-100 rounded-lg overflow-hidden',
              image: 'object-contain p-2',
            }}
          />
        </Link>

        <div className="absolute top-2 left-2 bg-primaryAccentColor text-white text-xs font-semibold px-2 py-1 rounded">
          {good.isNew ? 'НОВИЙ' : 'Б/У'}
        </div>

        {discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">
            -{discountPercent}%
          </div>
        )}
      </div>

      {/* Содержание карточки */}
      <div className="flex flex-col flex-grow gap-1">
        <Link href={`/catalog/${good._id}`}>
          <h3 className="font-semibold text-sm sm:text-base line-clamp-2 hover:text-primaryAccentColor transition-colors">
            {good.title}
          </h3>
        </Link>

        <p className="text-xs text-gray-500 line-clamp-2">
          Виробник: {good.brand?.name ?? '—'}
        </p>
        <p className="text-xs text-gray-500 line-clamp-1">
          Категорія: {good.category?.name ?? '—'}
        </p>
        <p className="text-xs text-gray-500 line-clamp-1">
          SKU: {good.sku ?? '—'}
        </p>

        {Array.isArray(good.compatibleGoods) &&
          good.compatibleGoods.length > 0 && (
            <p className="text-xs text-gray-500 line-clamp-1">
              Сумісні товари:{' '}
              {good.compatibleGoods
                .map(cg => (typeof cg === 'string' ? cg : cg.model))
                .join(', ')}
            </p>
          )}
      </div>

      {/* Нижний блок */}
      <div className="mt-3 pt-3 border-t border-gray-200 flex flex-col gap-2">
        <div className="text-xl font-bold flex justify-center items-center">
          {discountPercent > 0 ? (
            <>
              <span className="text-red-600">
                {formatCurrency(displayPrice, 'uk-UA', 'UAH')}
              </span>{' '}
              <span className="line-through text-gray-400 text-base">
                {formatCurrency(good.price, 'uk-UA', 'UAH')}
              </span>
            </>
          ) : (
            <span>{formatCurrency(displayPrice, 'uk-UA', 'UAH')}</span>
          )}
        </div>

        <CartActions
          isAvailable={good.isAvailable}
          itemId={good._id}
          quantity={quantity}
          increaseCartQuantity={increaseCartQuantity}
          decreaseCartQuantity={decreaseCartQuantity}
          removeFromCart={removeFromCart}
        />
      </div>
    </li>
  );
};

interface CartActionsProps {
  isAvailable: boolean;
  itemId: string;
  quantity: number;
  increaseCartQuantity: (id: string) => void;
  decreaseCartQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
}

const CartActions: React.FC<CartActionsProps> = ({
  isAvailable,
  itemId,
  quantity,
  increaseCartQuantity,
  decreaseCartQuantity,
  removeFromCart,
}) => {
  return (
    <div className="flex justify-center items-center">
      {quantity === 0 ? (
        <Button
          width="32"
          type="button"
          label="Купити"
          disabled={!isAvailable}
          onClick={() => increaseCartQuantity(itemId)}
        />
      ) : (
        <div className="flex flex-col gap-2 items-center">
          <div className="flex items-center gap-2">
            <Button
              width="32"
              type="button"
              label="-"
              onClick={() => decreaseCartQuantity(itemId)}
              small
              outline
            />
            <span className="w-5 text-center">{quantity}</span>
            <Button
              width="32"
              type="button"
              label="+"
              onClick={() => increaseCartQuantity(itemId)}
              small
              outline
            />
          </div>
          <Button
            width="32"
            type="button"
            label="Видалити"
            onClick={() => removeFromCart(itemId)}
          />
        </div>
      )}
    </div>
  );
};

export default ProductCard;
