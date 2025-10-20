'use client';

import { useShoppingCart } from 'app/context/ShoppingCartContext';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaPen } from 'react-icons/fa';

import { Button } from '@/components/index';
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
    if (typeof window !== 'undefined') {
      setQuantity(getItemQuantity(good._id));
    }
  }, [getItemQuantity, good._id]);

  const displayPrice =
    good.discountPrice && good.discountPrice < good.price
      ? good.discountPrice
      : good.price;

  const discountPercent =
    good.discountPrice && good.discountPrice < good.price
      ? Math.round(((good.price - good.discountPrice) / good.price) * 100)
      : 0;

  return (
    <li className="flex flex-col justify-between border border-gray-300 rounded-md p-4 hover:shadow-lg transition-all relative">
      <Link
        href={`/catalog/${good._id}`}
        className="flex flex-col h-full justify-between"
      >
        <div className="relative w-full h-[200px] mb-4">
          <Image
            src={getCloudinaryUrl(good.src[0], 200, 200)}
            alt={good.title}
            fill
            className="object-contain bg-gray-50 p-2"
          />
          <div className="absolute top-2 left-2 bg-primaryAccentColor text-white text-xs font-semibold px-2 py-1 rounded">
            {good.isNew ? 'НОВИЙ' : 'Б/У'}
          </div>
          {discountPercent > 0 && (
            <div className="absolute top-2 right-2 bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">
              -{discountPercent}%
            </div>
          )}
        </div>

        <h3 className="font-semibold text-sm sm:text-base line-clamp-2 mb-2">
          {good.title}
        </h3>

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

        <div className="mb-2 text-sm text-gray-500">
          {good.isAvailable ? 'В наявності' : 'Немає в наявності'}
        </div>

        <div className="mb-2 text-sm text-gray-500">Артикул: {good.sku}</div>

        <div className="text-xl font-bold mb-4">
          {discountPercent > 0 ? (
            <>
              <span className="text-red-600">
                ₴{good.discountPrice?.toLocaleString()}
              </span>{' '}
              <span className="line-through text-gray-400">
                ₴{good.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span>₴{good.price.toLocaleString()}</span>
          )}
        </div>

        {good.isCompatible && (good.compatibleGoods?.length ?? 0) > 0 && (
          <p className="text-sm text-gray-500 mb-2">
            Сумісні товари:{' '}
            {good.compatibleGoods
              ?.map(cg => (typeof cg === 'string' ? cg : cg.model))
              .join(', ')}
          </p>
        )}

        <p className="text-sm text-gray-500 mb-2">
          Виробник: {good.brand?.name ?? '—'}
        </p>

        <p className="text-sm text-gray-500 mb-2">
          Категорія: {good.category?.name ?? '—'}
        </p>

        <div className="flex justify-between items-center">
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
              <span className="cursor-pointer w-8 h-8 rounded-full bg-orange-600 flex justify-center items-center hover:opacity-80">
                <FaPen size={12} color="white" />
              </span>
            </Link>
          )}
        </div>
      </Link>
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
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button
              width="32"
              type="button"
              label="-"
              onClick={() => decreaseCartQuantity(itemId)}
              small
              outline
            />
            <span>{quantity}</span>
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
