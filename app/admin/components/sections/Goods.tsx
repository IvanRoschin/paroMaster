'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  FaPen,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTrash,
} from 'react-icons/fa';

import { deleteGood, getAllGoods } from '@/actions/goods';
import {
  Breadcrumbs,
  Button,
  EmptyState,
  ErrorMessage,
  Loader,
  Pagination,
} from '@/components/index';
import { getReadableGoodTitle } from '@/helpers/index';
import { useDeleteData, useFetchData } from '@/hooks/index';
import { IGood } from '@/types/IGood';

type SortKey = 'category' | 'brand' | 'price' | 'availability' | 'condition';

interface Category {
  _id: string;
  title: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface GoodsProps {
  categories?: Category[];
  brands?: Brand[];
}

export default function Goods({ categories = [], brands = [] }: GoodsProps) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<SortKey>('category');

  const { data, isLoading, isError, error } = useFetchData(
    getAllGoods,
    ['goods'],
    { page, limit, sortOrder, sortBy }
  );

  const { mutate: deleteGoodById } = useDeleteData(deleteGood, ['goods']);
  const handleDelete = (id: string) => deleteGoodById(id);

  const goodsCount = data?.count || 0;
  const totalPages = Math.ceil(goodsCount / limit);

  const pageNumbers = Array.from({ length: 7 }, (_, i) => i + page - 3).filter(
    n => n >= 1 && n <= totalPages
  );

  // Мапы для lookup по ID
  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map(cat => [cat._id, cat.title])),
    [categories]
  );
  const brandMap = useMemo(
    () => Object.fromEntries(brands.map(brand => [brand._id, brand.name])),
    [brands]
  );

  const sortedGoods = useMemo(() => {
    return [...(data?.goods || [])].sort((a: IGood, b: IGood) => {
      let comparison = 0;
      switch (sortBy) {
        case 'category':
          comparison = (categoryMap[a.category] || '').localeCompare(
            categoryMap[b.category] || ''
          );
          break;
        case 'brand':
          comparison = (brandMap[a.brand] || '').localeCompare(
            brandMap[b.brand] || ''
          );
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'availability':
          comparison =
            a.isAvailable === b.isAvailable ? 0 : a.isAvailable ? -1 : 1;
          break;
        case 'condition':
          comparison =
            a.isCondition === b.isCondition ? 0 : a.isCondition ? -1 : 1;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [data?.goods, sortBy, sortOrder, categoryMap, brandMap]);

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage error={error} />;
  if (!data?.goods || goodsCount === 0)
    return (
      <EmptyState
        title="Товари відсутні"
        subtitle="Додайте перший товар у систему"
        actionLabel="Додати товар"
        actionHref="/admin/goods/add"
      />
    );

  const handleSort = (sortKey: SortKey) => {
    setSortBy(sortKey);
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const getSortIcon = (key: SortKey) => {
    if (key !== sortBy) return undefined;
    if (['price', 'availability'].includes(key)) {
      return sortOrder === 'asc' ? FaSortAmountUp : FaSortAmountDown;
    }
    return sortOrder === 'asc' ? FaSortAlphaUp : FaSortAlphaDown;
  };

  const columns: { label: string; key: SortKey }[] = [
    { label: 'Категорія', key: 'category' },
    { label: 'Бренд', key: 'brand' },
    { label: 'Ціна', key: 'price' },
    { label: 'В наявності', key: 'availability' },
    { label: 'Стан', key: 'condition' },
  ];

  return (
    <div className="p-3">
      <Breadcrumbs />

      <div className="flex items-center justify-between mb-8">
        <p className="text-lg">
          Всього в базі <span className="subtitle text-lg">{goodsCount}</span>{' '}
          товара(-ів)
        </p>
        <Link href="/admin/goods/add">
          <Button
            type="button"
            label="Додати"
            small
            outline
            color="border-green-400"
          />
        </Link>
      </div>

      <table className="w-full text-xs mb-8">
        <thead>
          <tr className="bg-slate-300 font-semibold">
            {columns.map(({ label, key }) => (
              <th key={key} className="p-2 border-r-2 text-center">
                <Button
                  type="button"
                  label={label}
                  icon={getSortIcon(key)}
                  onClick={() => handleSort(key)}
                />
              </th>
            ))}
            <th className="p-2 border-r-2 text-center">Модель</th>
            <th className="p-2 border-r-2 text-center">Назва</th>
            <th className="p-2 border-r-2 text-center">Редагувати</th>
            <th className="p-2 border-r-2 text-center">Видалити</th>
          </tr>
        </thead>
        <tbody>
          {sortedGoods.map((good, index) => (
            <tr key={`${good._id}-${index}`} className="border-b-2">
              <td className="p-2 border-r-2 text-start">
                {categoryMap[good.category] || good.category}
              </td>
              <td className="p-2 border-r-2 text-start">
                {brandMap[good.brand] || good.brand}
              </td>
              <td className="p-2 border-r-2 text-center">{good.price} грн</td>
              <td className="p-2 border-r-2 text-center">
                {good.isAvailable ? 'Так' : 'Ні'}
              </td>
              <td className="p-2 border-r-2 text-center">
                {good.isCondition ? 'Б/У' : 'Нова'}
              </td>
              <td className="p-2 border-r-2 text-center">{good.model}</td>
              <td className="p-2 border-r-2 text-center">
                {getReadableGoodTitle(good)}
              </td>
              <td className="p-2 border-r-2 text-center">
                <Link href={`/admin/goods/${good._id}`}>
                  <Button
                    type="button"
                    icon={FaPen}
                    small
                    outline
                    color="border-yellow-400"
                  />
                </Link>
              </td>
              <td className="p-2 text-center">
                <Button
                  type="button"
                  icon={FaTrash}
                  small
                  outline
                  color="border-red-400"
                  onClick={() => handleDelete(good._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <Pagination count={goodsCount} pageNumbers={pageNumbers} />
      )}
    </div>
  );
}
