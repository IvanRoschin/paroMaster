'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface CompareItem {
  _id: string;
  category: { slug: string };
  price: string;
  [key: string]: any;
}

interface CompareContextType {
  items: CompareItem[];
  add: (good: CompareItem) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [items, setItems] = useState<CompareItem[]>([]);
  const isAdding = useRef(false); // ← защита от двойных вызовов

  useEffect(() => {
    const raw = localStorage.getItem('compare');
    if (raw) setItems(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem('compare', JSON.stringify(items));
  }, [items]);

  const add = (good: CompareItem) => {
    if (isAdding.current) return; // ← блокируем повторный вызов
    isAdding.current = true;
    setTimeout(() => (isAdding.current = false), 50); // снимаем блокировку

    setItems(prev => {
      if (prev.length > 0 && prev[0].category.slug !== good.category.slug) {
        toast.error('Порівнювати можна тільки товари з однієї категорії');
        return prev;
      }

      if (prev.find(i => i._id === good._id)) {
        toast('Товар вже додано до порівняння', {
          description: good.title,
        });
        return prev;
      }

      toast.success('Додано до порівняння', {
        description: good.title,
      });

      return [...prev, good];
    });
  };

  const remove = (id: string) => {
    setItems(prev => {
      const removed = prev.find(i => i._id === id);
      if (removed) {
        toast('Товар видалено з порівняння', {
          description: removed.title,
        });
      }
      return prev.filter(i => i._id !== id);
    });
  };

  const clear = () => {
    setItems([]);
    toast.success('Список порівняння очищено');
  };

  return (
    <CompareContext.Provider value={{ items, add, remove, clear }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be inside CompareProvider');
  return ctx;
};
