'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FaPen, FaPlus, FaTrash } from 'react-icons/fa';

import { deleteGoodAction, getAllGoodsAction } from '@/actions/goods';
import { EmptyState } from '@/components/common';
import DeleteConfirmation from '@/components/common/DeleteConfirmation';
import { Button, Modal } from '@/components/ui';
import useDeleteData from '@/hooks/useDeleteData';
import useDeleteModal from '@/hooks/useDeleteModal';
import useFetchData from '@/hooks/useFetchData';
import { IGetAllGoods } from '@/types/IGood';

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui';

interface Option {
  value: string;
  label: string;
}

interface GoodsProps {
  searchParams?: any;
  categories: Option[];
  brands: Option[];
}

export default function Goods({
  searchParams,
  categories,
  brands,
}: GoodsProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all'); // ✅ новый фильтр
  const [sortPrice, setSortPrice] = useState<'asc' | 'desc' | 'none'>('none');
  const [search, setSearch] = useState('');
  const [goodToDelete, setGoodToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const { data, isLoading, isError } = useFetchData<IGetAllGoods>(
    getAllGoodsAction,
    ['goods'],
    searchParams
  );

  const { mutate: deleteGoodById } = useDeleteData(deleteGoodAction, [
    'goods',
    goodToDelete?.id,
  ]);

  const deleteModal = useDeleteModal();

  const handleDelete = (id: string, title: string) => {
    setGoodToDelete({ id, title });
    deleteModal.onOpen();
  };

  const handleDeleteConfirm = () => {
    if (goodToDelete?.id) {
      deleteGoodById(goodToDelete.id);
      deleteModal.onClose();
    }
  };

  const goods = data?.goods || [];

  const normalizedGoods = goods.map(g => ({
    ...g,
    category: typeof g.category === 'string' ? null : (g.category ?? null),
    brand: typeof g.brand === 'string' ? null : (g.brand ?? null),
  }));

  const filteredGoods = useMemo(() => {
    let result = [...normalizedGoods];

    result = result.filter(g => {
      const matchCategory =
        selectedCategory === 'all' || g.category?._id === selectedCategory;
      const matchBrand =
        selectedBrand === 'all' || g.brand?._id === selectedBrand;
      const matchAvailability =
        selectedAvailability === 'all' ||
        (selectedAvailability === 'available' && g.isAvailable) ||
        (selectedAvailability === 'unavailable' && !g.isAvailable);
      const matchCondition =
        selectedCondition === 'all' ||
        (selectedCondition === 'new' && g.isUsed === g.isUsed) ||
        (selectedCondition === 'used' && g.isUsed === !g.isUsed);
      const matchSearch =
        !search || g.sku?.toLowerCase().includes(search.toLowerCase());

      return (
        matchCategory &&
        matchBrand &&
        matchAvailability &&
        matchCondition &&
        matchSearch
      );
    });

    if (sortPrice !== 'none') {
      result.sort((a, b) =>
        sortPrice === 'asc' ? a.price - b.price : b.price - a.price
      );
    }

    return result;
  }, [
    normalizedGoods,
    selectedCategory,
    selectedBrand,
    selectedAvailability,
    selectedCondition,
    sortPrice,
    search,
  ]);

  if (isLoading) return <p className="text-center mt-10">Завантаження...</p>;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">Помилка завантаження</p>
    );
  if (!goods || goods.length === 0) {
    return (
      <EmptyState
        title="Товари відсутні"
        subtitle="Додайте перший товар"
        actionLabel="Додати товар"
        actionHref="/admin/goods/add"
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Панель фильтров */}
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Пошук по артикулу (sku)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64"
        />

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Категорія" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg">
            <SelectItem value="all">Всі категорії</SelectItem>
            {categories.map(c => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Бренд" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg">
            <SelectItem value="all">Всі бренди</SelectItem>
            {brands.map(b => (
              <SelectItem key={b.value} value={b.value}>
                {b.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedAvailability}
          onValueChange={setSelectedAvailability}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Наявність" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg">
            <SelectItem value="all">Всі</SelectItem>
            <SelectItem value="available">Є в наявності</SelectItem>
            <SelectItem value="unavailable">Немає</SelectItem>
          </SelectContent>
        </Select>

        {/* ✅ новый фильтр по состоянию товара */}
        <Select value={selectedCondition} onValueChange={setSelectedCondition}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Стан" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg">
            <SelectItem value="all">Всі</SelectItem>
            <SelectItem value="new">Новий</SelectItem>
            <SelectItem value="used">Б/у</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortPrice}
          onValueChange={val => setSortPrice(val as 'asc' | 'desc' | 'none')}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Сортувати за ціною" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg">
            <SelectItem value="none">Без сортування</SelectItem>
            <SelectItem value="asc">Ціна ↑</SelectItem>
            <SelectItem value="desc">Ціна ↓</SelectItem>
          </SelectContent>
        </Select>

        <Link href="/admin/goods/add" className="ml-auto">
          <Button icon={FaPlus}>Додати товар</Button>
        </Link>
      </div>
      {/* список товаров */}
      {filteredGoods.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">Товари не знайдені</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredGoods.map(good => (
            <div
              key={good._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition flex flex-col overflow-hidden border"
            >
              {/* изображение */}
              {good.src?.length > 0 && (
                <div className="relative h-48 bg-gray-50 flex items-center justify-center">
                  <Image
                    src={good.src[0]}
                    alt={good.title}
                    fill
                    sizes="(max-width: 768px) 100vw,
             (max-width: 1200px) 50vw,
             25vw"
                    className="object-contain p-2"
                  />
                </div>
              )}

              <div className="p-4 flex flex-col flex-1">
                <h2 className="font-bold text-lg text-gray-800 truncate mb-1">
                  {good.title}
                </h2>
                <p className="text-sm text-gray-600">
                  Категорія: {good.category?.name || '-'}
                </p>
                <p className="text-sm text-gray-600">
                  Бренд: {good.brand?.name || '-'}
                </p>
                <p className="text-sm text-gray-600">
                  Артикул: {good.sku || '-'}
                </p>
                {/* ✅ отображение состояния */}
                {good.isUsed !== undefined && (
                  <span
                    className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full w-fit ${
                      good.isUsed
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {good.isUsed ? 'Новий' : 'Б/у'}
                  </span>
                )}
                <div className="mt-auto">
                  <div className="mt-4 flex justify-between items-center">
                    <span
                      className={`font-semibold ${
                        good.isAvailable ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {good.isAvailable ? 'Є в наявності' : 'Немає'}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {good.price} грн
                    </span>
                  </div>

                  <div className="mt-4 flex justify-center gap-3">
                    <Link href={`/admin/goods/${good._id}`}>
                      <Button type="button" icon={FaPen}>
                        Редагувати
                      </Button>
                    </Link>
                    <Button
                      type="button"
                      icon={FaTrash}
                      outline
                      className="text-red-500 border-red-300 hover:bg-red-50"
                      onClick={() =>
                        good._id &&
                        handleDelete(good._id.toString(), good.title)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Модалка для підтвердження видалення */}
      <Modal
        body={
          <DeleteConfirmation
            onConfirm={handleDeleteConfirm}
            onCancel={() => deleteModal.onClose()}
            title={`товар: ${goodToDelete?.title}`}
          />
        }
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
      />
    </div>
  );
}
