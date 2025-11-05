'use client';

import { useShoppingCart } from 'app/context/ShoppingCartContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { FaPen } from 'react-icons/fa';

import { Button, NextImage } from '@/components/index';
import { getCloudinaryUrl } from '@/helpers/getCloudinaryUrl';
import { IGoodUI } from '@/types/IGood';

interface IProductCardProps {
  good: IGoodUI;
}

const ProductCard: React.FC<IProductCardProps> = ({ good }) => {
  const { data: session } = useSession();
  const isAdmin = !!session?.user;

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
    <li className="flex flex-col justify-between border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-all relative bg-white">
      {/* Верх: изображение и бейджи */}
      <div className="relative w-full h-[200px] mb-4 overflow-hidden rounded-lg z-0">
        <Link href={`/catalog/${good._id}`}>
          <NextImage
            src={getCloudinaryUrl(good.src?.[0], 300, 300)}
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

      {/* Заголовок */}
      <Link href={`/catalog/${good._id}`}>
        <h3 className="font-semibold text-sm sm:text-base line-clamp-2 hover:text-primaryAccentColor transition-colors mb-2">
          {good.title}
        </h3>
      </Link>

      {/* Рейтинг */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex text-yellow-400">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i}>
              {i < Math.round(good.averageRating || 0) ? '★' : '☆'}
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-600">
          ({good.ratingCount || 0} відгуків)
        </span>
      </div>

      {/* Наличие и характеристики */}
      <p className="text-sm text-gray-500 mb-1">
        {good.isAvailable ? '✅ В наявності' : '❌ Немає в наявності'}
      </p>
      <p className="text-sm text-gray-500 mb-1">Артикул: {good.sku}</p>
      <p className="text-sm text-gray-500 mb-1">
        Виробник: {good.brand?.name ?? '—'}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        Категорія: {good.category?.name ?? '—'}
      </p>

      {/* Цена */}
      <div className="mt-2 mb-4 text-xl font-bold">
        {discountPercent > 0 ? (
          <>
            <span className="text-red-600">
              ₴{displayPrice.toLocaleString('uk-UA')}
            </span>{' '}
            <span className="line-through text-gray-400 text-base">
              ₴{good.price.toLocaleString('uk-UA')}
            </span>
          </>
        ) : (
          <span>₴{displayPrice.toLocaleString('uk-UA')}</span>
        )}
      </div>

      {/* Сумісні товари */}
      {Array.isArray(good.compatibleGoods) &&
        good.compatibleGoods.length > 0 && (
          <p className="text-xs text-gray-500 mb-2">
            Сумісні товари:{' '}
            {good.compatibleGoods
              .map(cg => (typeof cg === 'string' ? cg : cg.model))
              .join(', ')}
          </p>
        )}

      {/* Нижний блок */}
      <div className="flex  items-center justify-center mt-auto pt-2 border-t border-gray-200">
        <CartActions
          isAvailable={good.isAvailable}
          itemId={good._id}
          quantity={quantity}
          increaseCartQuantity={increaseCartQuantity}
          decreaseCartQuantity={decreaseCartQuantity}
          removeFromCart={removeFromCart}
        />

        {isAdmin && (
          <Link href={`/admin/goods/${good._id}`}>
            <span className="cursor-pointer w-8 h-8 rounded-full bg-orange-600 flex justify-center items-center hover:opacity-80 transition-opacity">
              <FaPen size={12} color="white" />
            </span>
          </Link>
        )}
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
    <div>
      {quantity === 0 ? (
        <Button
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
