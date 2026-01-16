'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { useAppStore } from '@/app/store/appStore';
import { formatCurrency } from '@/app/utils/formatCurrency';
import {
  Button,
  CompareButton,
  FavoriteButton,
  NextImage,
} from '@/components/index';
import { IGoodUI } from '@/types/IGood';

interface IProductCardProps {
  good: IGoodUI;
}

const ProductCard: React.FC<IProductCardProps> = ({ good }) => {
  const { cart, compare, favorites } = useAppStore();

  const [quantity, setQuantity] = useState(0);

  // const { items: compareItems } = useCompare();
  // const { isFavorite } = useFavorites();
  const isInCompare = compare.items.some(i => i._id === good._id);

  useEffect(() => {
    setQuantity(cart.getItemQuantity(good._id));
  }, [cart, good._id]);

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
      <div className="relative w-full h-[200px] mb-3 rounded-lg overflow-hidden">
        <Link href={`/catalog/${good._id}`}>
          <NextImage
            priority
            src={good.src?.[0] || '/placeholder.png'}
            alt={good.title}
            useSkeleton
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="bg-gray-50 rounded-lg"
            classNames={{
              wrapper: 'w-full h-full bg-gray-100 rounded-lg overflow-hidden',
              image: 'object-contain p-2',
            }}
          />
        </Link>
        {/* Верхний левый бейдж */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <div className="bg-primaryAccentColor text-white text-xs font-semibold px-2 py-1 rounded">
            {good.isUsed ? 'Б/У' : 'НОВИЙ'}
          </div>
          {discountPercent > 0 && (
            <div className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">
              -{discountPercent}%
            </div>
          )}
        </div>
      </div>

      {/* Содержание карточки */}
      <div className="flex flex-col flex-grow gap-2">
        <Link href={`/catalog/${good._id}`}>
          <h3 className="font-semibold text-sm sm:text-base line-clamp-2 hover:text-primaryAccentColor transition-colors h-[2.8rem]">
            {good.title}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 line-clamp-1">
          Виробник: {good.brand?.name ?? '—'}
        </p>
        <p className="text-xs text-gray-500 line-clamp-1">
          Категорія: {good.category?.name ?? '—'}
        </p>
        {/* SKU + кнопки + метки */}
        <div className="flex items-center justify-between mt-1">
          {/* SKU */}
          <span className="text-xs text-gray-500 line-clamp-1">
            SKU: {good.sku ?? '—'}
          </span>

          {/* Блок кнопок сравнения и избранного + статусные метки */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex gap-1">
              <CompareButton good={good} />
              <FavoriteButton good={good} />
            </div>

            <div className="flex flex-col">
              {isInCompare && (
                <span className="text-xs text-blue-600 font-semibold">
                  У порівнянні
                </span>
              )}
              {favorites.isFavorite(good._id) && (
                <span className="text-xs text-red-500 font-semibold">
                  Улюблений
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Нижний блок: цена и действия */}
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
          increaseCartQuantity={cart.increaseCartQuantity}
          decreaseCartQuantity={cart.decreaseCartQuantity}
          removeFromCart={cart.removeFromCart}
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
