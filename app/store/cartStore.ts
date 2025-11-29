import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getGoodByIdAction } from '@/app/actions/goods';
import toPlain from '@/helpers/server/toPlain';
import { ICartItem } from '@/types/ICartItem';
import { storageKeys } from '../helpers';

interface CartState {
  cart: ICartItem[];
  cartQuantity: () => number;
  resetCart: () => void;
  getItemQuantity: (id: string) => number;
  setCartQuantity: (id: string, quantity: number) => void;
  increaseCartQuantity: (id: string) => Promise<void>;
  decreaseCartQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      cartQuantity: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),
      resetCart: () => set({ cart: [] }),
      getItemQuantity: id =>
        get().cart.find(item => item.good._id === id)?.quantity || 0,
      setCartQuantity: (id, quantity) =>
        set({
          cart: get().cart.map(item =>
            item.good._id === id
              ? { good: toPlain(item.good), quantity }
              : { good: toPlain(item.good), quantity: item.quantity }
          ),
        }),
      increaseCartQuantity: async id => {
        try {
          const good = await getGoodByIdAction(id);
          if (!good) {
            toast.error('Товар не знайдено');
            return;
          }

          const plainGood = toPlain(good);
          const cart = get().cart;
          const existing = cart.find(item => item.good._id === id);

          if (!existing) {
            toast.success(`Товар "${plainGood.title}" додано до корзини`);
            set({ cart: [...cart, { good: plainGood, quantity: 1 }] });
            return;
          }

          toast.info(`Кількість товару "${existing.good.title}" збільшено`);
          set({
            cart: cart.map(item =>
              item.good._id === id
                ? { good: toPlain(item.good), quantity: item.quantity + 1 }
                : { good: toPlain(item.good), quantity: item.quantity }
            ),
          });
        } catch {
          toast.error('Не вдалося додати товар до корзини');
        }
      },
      decreaseCartQuantity: id => {
        const cart = get().cart;
        const existing = cart.find(item => item.good._id === id);
        if (!existing) return;

        if (existing.quantity === 1) {
          toast.warning(`Товар "${existing.good.title}" видалено з корзини`);
          set({ cart: cart.filter(i => i.good._id !== id) });
          return;
        }

        toast.info(`Кількість товару "${existing.good.title}" зменшено`);
        set({
          cart: cart.map(item =>
            item.good._id === id
              ? { good: toPlain(item.good), quantity: item.quantity - 1 }
              : { good: toPlain(item.good), quantity: item.quantity }
          ),
        });
      },
      removeFromCart: id => {
        set({ cart: get().cart.filter(i => i.good._id !== id) });
        toast.info('Товар видалено з корзини');
      },
    }),
    {
      name: storageKeys.cart,
      partialize: state => ({ cart: state.cart }),
    }
  )
);
