'use client';

import dynamic from 'next/dynamic';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'sonner';

import { getGoodById } from '@/actions/goods';
import { getReadableGoodTitle, storageKeys } from '@/helpers/index';
import { ICartItem } from '@/types/index';

// Динамический импорт компонента корзины без SSR
const ShoppingCart = dynamic(
  () => import('../components/ui/Cart/ShoppingCart'),
  { ssr: false }
);

type ShoppingCartProviderProps = {
  children: React.ReactNode;
};

type ShoppingCartContextProps = {
  resetCart: () => void;
  getItemQuantity: (id: string) => number;
  increaseCartQuantity: (id: string) => void;
  decreaseCartQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  setCartQuantity: (id: string, quantity: number) => void;
  cartQuantity: number;
  cart: ICartItem[];
  setCart: React.Dispatch<React.SetStateAction<ICartItem[]>>;
};

const ShoppingCartContext = createContext<ShoppingCartContextProps | undefined>(
  undefined
);

export function useShoppingCart() {
  const context = useContext(ShoppingCartContext);
  if (!context)
    throw new Error('useShoppingCart must be used within ShoppingCartProvider');
  return context;
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  // Инициализация с localStorage, только на клиенте
  const [cart, setCart] = useState<ICartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const storedCart = localStorage.getItem(storageKeys.cart);
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Сохраняем изменения в localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (cart.length > 0) {
      localStorage.setItem(storageKeys.cart, JSON.stringify(cart));
    } else {
      localStorage.removeItem(storageKeys.cart);
    }
  }, [cart]);

  // Количество всех товаров в корзине
  const cartQuantity = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // Сброс корзины
  const resetCart = useCallback(() => {
    setCart([]);
    if (typeof window !== 'undefined')
      localStorage.removeItem(storageKeys.cart);
  }, []);

  // Получаем количество конкретного товара
  const getItemQuantity = useCallback(
    (id: string) => cart.find(item => item.good._id === id)?.quantity || 0,
    [cart]
  );

  // Установка конкретного количества товара
  const setCartQuantity = useCallback((id: string, quantity: number) => {
    setCart(currItems =>
      currItems.map(item =>
        item.good._id === id ? { ...item, quantity } : item
      )
    );
  }, []);

  // Добавление товара с оптимистичным апдейтом
  const increaseCartQuantity = useCallback((id: string) => {
    getGoodById(id)
      .then(newGood => {
        setCart(currItems => {
          const existing = currItems.find(item => item.good._id === id);
          const newGoodTitle = getReadableGoodTitle(newGood);
          if (!existing) {
            toast.success(`Товар "${newGoodTitle}" додано до корзини`, {
              id: `add-${id}`,
            });
            return [...currItems, { good: newGood, quantity: 1 }];
          }
          const existingGoodTitle = getReadableGoodTitle(existing.good);

          toast.info(`Кількість товару "${existingGoodTitle}" збільшено`, {
            id: `update-${id}`,
          });
          return currItems.map(item =>
            item.good._id === id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        });
      })
      .catch(() => {
        toast.error('Не вдалося додати товар до корзини');
      });
  }, []);

  // Уменьшение количества товара
  const decreaseCartQuantity = useCallback((id: string) => {
    setCart(currItems => {
      const existing = currItems.find(item => item.good._id === id);
      if (!existing) return currItems;
      const existingGoodTitle = getReadableGoodTitle(existing.good);
      if (existing.quantity === 1) {
        toast.warning(`Товар "${existingGoodTitle}" видалено з корзини`, {
          id: `remove-${id}`,
        });
        return currItems.filter(item => item.good._id !== id);
      }

      toast.info(`Кількість товару "${existingGoodTitle}" зменшено`, {
        id: `decrease-${id}`,
      });
      return currItems.map(item =>
        item.good._id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  }, []);

  // Полное удаление товара
  const removeFromCart = useCallback((id: string) => {
    setCart(currItems => currItems.filter(item => item.good._id !== id));
    toast.info('Товар видалено з корзини', { id: `delete-${id}` });
  }, []);

  const contextValue = useMemo(
    () => ({
      resetCart,
      getItemQuantity,
      increaseCartQuantity,
      decreaseCartQuantity,
      removeFromCart,
      setCartQuantity,
      cart,
      setCart,
      cartQuantity,
    }),
    [
      cart,
      cartQuantity,
      resetCart,
      increaseCartQuantity,
      decreaseCartQuantity,
      removeFromCart,
      setCartQuantity,
      getItemQuantity,
    ]
  );

  return (
    <ShoppingCartContext.Provider value={contextValue}>
      {children}
      <ShoppingCart />
    </ShoppingCartContext.Provider>
  );
}
