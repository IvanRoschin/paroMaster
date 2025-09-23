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
import { useDeleteData, useFetchData } from '@/hooks/index';

// interface Props {
//   goods: IGood[]
//   searchParams: ISearchParams
// }

type SortKey = 'category' | 'brand' | 'price' | 'availability' | 'condition';

const getPageNumbers = (
  page: number,
  totalPages: number,
  offset = 3
): number[] => {
  const pages = [];
  for (let i = page - offset; i <= page + offset; i++) {
    if (i >= 1 && i <= totalPages) pages.push(i);
  }
  return pages;
};

export default function Goods() {
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<SortKey>('category');

  const { data, isLoading, isError, error } = useFetchData(
    getAllGoods,
    ['goods'],
    {
      page,
      limit,
      sortOrder,
      sortBy,
    }
  );
  const { mutate: deleteGoodById } = useDeleteData(deleteGood, ['goods']);

  const handleDelete = (id: string) => {
    deleteGoodById(id);
  };

  const goodsCount = data?.count || 0;
  const totalPages = Math.ceil(goodsCount / limit);
  const pageNumbers = getPageNumbers(page, totalPages);

  const sortedGoods = useMemo(() => {
    return [...(data?.goods || [])].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'brand':
          comparison = a.brand.localeCompare(b.brand);
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
  }, [data?.goods, sortBy, sortOrder]);

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage error={error} />;
  if (!data?.goods || data.goods.length === 0) return <EmptyState showReset />;

  const handleSort = (sortKey: SortKey) => {
    setSortBy(sortKey);
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const getSortIcon = (key: SortKey) => {
    if (key === sortBy) {
      if (['price', 'availability'].includes(key)) {
        return sortOrder === 'asc' ? FaSortAmountUp : FaSortAmountDown;
      } else {
        return sortOrder === 'asc' ? FaSortAlphaUp : FaSortAlphaDown;
      }
    }
    return undefined;
  };

  return (
    <div className="p-3">
      <Breadcrumbs />

      {/* <div className="flex justify-end mb-8">
        <Link href="/admin/goods/add">
          <Button type="button" label="Додати" small outline color="border-green-400" />
        </Link>
      </div> */}
      <div className="flex items-center justify-between mb-8">
        {/* <Search placeholder="Знайти товар" /> */}{' '}
        <p className=" text-lg">
          {' '}
          Всього в базі <span className="subtitle text-lg">
            {goodsCount}
          </span>{' '}
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
            {(
              [
                { label: 'Категорія', key: 'category' },
                { label: 'Бренд', key: 'brand' },
                { label: 'Ціна', key: 'price' },
                { label: 'В наявності', key: 'availability' },
                { label: 'Стан', key: 'condition' },
              ] as { label: string; key: SortKey }[]
            ).map(({ label, key }) => (
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
            <th className="p-2 border-r-2 text-center">Артикул</th>
            <th className="p-2 border-r-2 text-center">Редагувати</th>
            <th className="p-2 border-r-2 text-center">Видалити</th>
          </tr>
        </thead>
        <tbody>
          {sortedGoods.map(good => (
            <tr key={good._id} className="border-b-2">
              <td className="p-2 border-r-2 text-start">{good.category}</td>
              <td className="p-2 border-r-2 text-start">{good.brand}</td>
              <td className="p-2 border-r-2 text-center">{good.price} грн</td>
              <td className="p-2 border-r-2 text-center">
                {good.isAvailable ? 'Так' : 'Ні'}
              </td>
              <td className="p-2 border-r-2 text-center">
                {good.isCondition ? 'Б/У' : 'Нова'}
              </td>
              <td className="p-2 border-r-2 text-center">{good.model}</td>
              <td className="p-2 border-r-2 text-center">{good.vendor}</td>
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
                  onClick={() => good._id && handleDelete(good._id.toString())}
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
