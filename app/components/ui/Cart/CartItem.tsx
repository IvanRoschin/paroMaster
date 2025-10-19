'use client';

import { useShoppingCart } from 'app/context/ShoppingCartContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Button, Icon } from '@/components/index';
import { IGoodUI } from '@/types/index';

type CartItemProps = {
  good: IGoodUI;
  quantity: number;
};

const CartItem: React.FC<CartItemProps> = ({ good, quantity }) => {
  const { increaseCartQuantity, decreaseCartQuantity, removeFromCart } =
    useShoppingCart();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (good) {
      const newAmount = good.price * quantity;
      setAmount(newAmount);
      sessionStorage.setItem(`amount-${good._id}`, JSON.stringify(newAmount));
    }
  }, [good, quantity]);

  const { _id, price, src } = good;

  return (
    <div className="relative flex items-center gap-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25 }}
      >
        {/* Image */}
        <div className="relative w-[120px] h-[120px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
          <Image
            src={src[0]}
            alt={good.title}
            fill
            className="object-contain p-2"
            priority
          />
        </div>

        {/* Right content */}
        <div className="flex flex-1 flex-col justify-between min-w-0">
          {/* Title + remove */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-800 line-clamp-2 pr-6">
              {good.title}
            </h3>
            <button
              onClick={() => {
                _id && removeFromCart(_id);
                _id && sessionStorage.removeItem(`amount-${_id}`);
              }}
              className="text-gray-400 hover:text-red-500 transition-colors absolute top-2 right-2"
            >
              <Icon name="icon_trash" className="w-5 h-5" />
            </button>
          </div>

          {/* Controls + price */}
          <div className="flex items-center justify-between">
            {/* Buttons */}
            <div className="flex items-center gap-2">
              <Button
                label="-"
                onClick={() => _id && decreaseCartQuantity(_id)}
                small
                outline
              />
              <span className="text-lg font-medium">{quantity}</span>
              <Button
                label="+"
                onClick={() => _id && increaseCartQuantity(_id)}
                small
                outline
              />
            </div>

            {/* Price */}
            <div className="text-right text-gray-700 text-sm whitespace-nowrap">
              <span>
                {price} ₴ × {quantity}
              </span>
              <div className="font-semibold text-primaryAccentColor text-base">
                {amount} ₴
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CartItem;
