'use client';

import { useShoppingCart } from 'app/context/ShoppingCartContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Button, Icon } from '@/components/index';
import { IGood } from '@/types/index';

type CartItemProps = {
  good: IGood;
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

  const { _id, title, price, src } = good;

  return (
    <div
      className="relative w-full rounded-xl border border-gray-200 bg-white 
             shadow-sm hover:shadow-lg transition-all duration-300 group p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25 }}
      >
        {/* Image */}
        <div className="relative w-full h-[180px] flex items-center justify-center rounded-lg overflow-hidden mb-4">
          <Image
            src={src[0]}
            alt={title}
            width={200}
            height={200}
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-3 line-clamp-2">
          {title}
        </h3>

        {/* Controls & Price */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center gap-3">
            <Button
              label="-"
              onClick={() => _id && decreaseCartQuantity(_id)}
              small
              outline
            />
            <span className="text-xl font-medium">{quantity}</span>
            <Button
              label="+"
              onClick={() => _id && increaseCartQuantity(_id)}
              small
              outline
            />
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-700">
            <span>{price} ₴</span>
            <span>×</span>
            <span>{quantity}</span>
            <span>=</span>
            <span className="font-semibold text-primaryAccentColor">
              {amount} ₴
            </span>
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => {
            _id && removeFromCart(_id);
            _id && sessionStorage.removeItem(`amount-${_id}`);
          }}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Icon name="icon_trash" className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};

export default CartItem;
