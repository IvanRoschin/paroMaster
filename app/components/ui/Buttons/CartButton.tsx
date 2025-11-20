'use client';

import { useShoppingCart } from 'app/context/ShoppingCartContext';
import dynamic from 'next/dynamic';

import { Icon } from '@/components/ui';
import { useCartModal } from '@/hooks/index';

const CartButton = () => {
  const { cartQuantity } = useShoppingCart();
  const cartModal = useCartModal();

  if (cartQuantity === 0) return null;

  return (
    <button
      onClick={cartModal.onOpen}
      className="relative flex items-center justify-center"
    >
      <Icon
        name="lucide/shopping-cart"
        className="w-7 h-7 cursor-pointer hover:text-primaryAccentColor transition-colors"
      />
      <span
        className="
          absolute -top-2 -right-2
          w-5 h-5
          flex items-center justify-center
          rounded-full
          bg-primaryAccentColor text-white
          text-[10px] font-semibold
        "
      >
        {cartQuantity}
      </span>
    </button>
  );
};

export default dynamic(() => Promise.resolve(CartButton), { ssr: false });
