'use client';
import { useRouter } from 'next/navigation';

import { CartClient, Modal } from '@/components';
import { useModal } from '@/hooks/useModal';

export function ShoppingCart() {
  const { isOpen, close } = useModal('cart');
  const { push } = useRouter();

  const onConfirm = () => {
    close();
    push('/checkout');
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      body={<CartClient onConfirm={onConfirm} onCancel={close} />}
    />
  );
}

export default ShoppingCart;
