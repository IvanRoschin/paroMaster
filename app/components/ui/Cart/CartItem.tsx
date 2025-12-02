'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import { useAppStore } from '@/app/store/appStore';
import { formatCurrency } from '@/app/utils/formatCurrency';
import { Button, Icon, NextImage } from '@/components/index';
import { IGoodUI } from '@/types/index';

type CartItemProps = {
  good: IGoodUI;
  quantity: number;
};

const CartItem: React.FC<CartItemProps> = ({ good, quantity }) => {
  const { cart } = useAppStore();
  const { _id, price, discountPrice, src } = good;

  const effectivePrice = useMemo(
    () => (discountPrice && discountPrice < price ? discountPrice : price),
    [price, discountPrice]
  );

  const [amount, setAmount] = useState<number>(effectivePrice * quantity);

  useEffect(() => {
    const newAmount = effectivePrice * quantity;
    setAmount(newAmount);
    if (_id) {
      sessionStorage.setItem(`amount-${_id}`, JSON.stringify(newAmount));
    }
  }, [_id, effectivePrice, quantity]);

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 p-3 w-full max-w-[160px]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="w-full flex flex-col items-center gap-2 relative"
      >
        {/* Image */}
        <div className="relative w-[120px] h-[120px] rounded-lg overflow-hidden bg-gray-50">
          <NextImage
            useSkeleton
            src={src[0] ?? '/placeholder.png'}
            alt={good.title}
            sizes="120px"
            classNames={{
              wrapper: 'w-full h-full bg-gray-50 rounded-lg overflow-hidden',
              image: 'object-contain p-2',
            }}
            fill
          />
        </div>

        {/* Title + remove */}
        <div className=" w-full text-center">
          <h3 className="text-xs font-semibold text-gray-800 line-clamp-2">
            {good.title}
          </h3>
          <button
            onClick={() => {
              _id && cart.removeFromCart(_id);
              _id && sessionStorage.removeItem(`amount-${_id}`);
            }}
            className="absolute top-0 right-0 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Icon name="icon_trash" className="w-4 h-4" />
          </button>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-1 w-full">
          <Button
            label="-"
            onClick={() => _id && cart.decreaseCartQuantity(_id)}
            small
            outline
          />
          <span className="text-sm font-medium w-5 text-center">
            {quantity}
          </span>
          <Button
            label="+"
            onClick={() => _id && cart.increaseCartQuantity(_id)}
            small
            outline
          />
        </div>

        {/* Price */}
        <div className="flex flex-col items-center text-center">
          <span className="font-semibold text-primaryAccentColor text-sm">
            {formatCurrency(amount, 'uk-UA', 'UAH')}
          </span>
          <span className="text-[10px] text-gray-500">
            {quantity} × {formatCurrency(price, 'uk-UA', 'UAH')} за шт.
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default CartItem;
