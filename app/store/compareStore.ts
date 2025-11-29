import { toast } from 'sonner';
import { create } from 'zustand';

// stores/compareStore.ts

interface CompareItem {
  _id: string;
  category: { slug: string };
  price: string;
  title: string;
  [key: string]: any;
}

export interface CompareState {
  items: CompareItem[];
  add: (good: CompareItem) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  items: [],
  add: good => {
    const { items } = get();
    if (items.length > 0 && items[0].category.slug !== good.category.slug) {
      toast.error('Порівнювати можна тільки товари з однієї категорії');
      return;
    }
    if (items.some(i => i._id === good._id)) {
      toast('Товар вже додано до порівняння', { description: good.title });
      return;
    }
    toast.success('Додано до порівняння', { description: good.title });
    set({ items: [...items, good] });
  },
  remove: id => {
    const { items } = get();
    const removed = items.find(i => i._id === id);
    if (removed)
      toast('Товар видалено з порівняння', { description: removed.title });
    set({ items: items.filter(i => i._id !== id) });
  },
  clear: () => {
    toast.success('Список порівняння очищено');
    set({ items: [] });
  },
}));
