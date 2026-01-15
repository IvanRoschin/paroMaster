'use client';

import dynamic from 'next/dynamic';

import { useModal } from '@/app/hooks/useModal';
import { useCartStore } from '@/app/store/cartStore';
import { Icon } from '@/components/ui';

const CartButton = () => {
  const totalQuantity = useCartStore(state =>
    state.cart.reduce((sum, i) => sum + i.quantity, 0)
  );

  // const { cartQuantity } = useShoppingCart();
  const { open } = useModal('cart');

  if (totalQuantity === 0) return null;

  return (
    <button
      onClick={open}
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
        {totalQuantity}
      </span>
    </button>
  );
};

export default dynamic(() => Promise.resolve(CartButton), { ssr: false });
