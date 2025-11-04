'use client';
import { useRouter } from 'next/navigation';

import { CartClient, Modal } from '@/components/index';
import { useCartModal } from '@/hooks/index';

export function ShoppingCart() {
  const cartModal = useCartModal();
  const { push } = useRouter();

  const onConfirm = () => {
    cartModal.onClose();
    push('/checkout');
  };

  return (
    <Modal
      isOpen={cartModal.isOpen}
      onClose={cartModal.onClose}
      body={
        <CartClient
          onConfirm={onConfirm}
          onCancel={() => cartModal.onClose()}
        />
      }
    />
  );
}

export default ShoppingCart;
