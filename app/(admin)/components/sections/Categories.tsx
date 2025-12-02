'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FaPen, FaSortAlphaDown, FaSortAlphaUp, FaTrash } from 'react-icons/fa';

import {
  deleteCategoryAction,
  getAllCategoriesAction,
} from '@/actions/categories';
import {
  Breadcrumbs,
  Button,
  DeleteConfirmation,
  EmptyState,
  ErrorMessage,
  Loader,
  Modal,
  NextImage,
  Pagination,
} from '@/components/index';
import { useDeleteData, useDeleteModal, useFetchData } from '@/hooks/index';
import { ISearchParams } from '@/types/index';

export default function Categories({
  searchParams,
}: {
  searchParams: ISearchParams;
}) {
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { data, isLoading, isError, error } = useFetchData(
    getAllCategoriesAction,
    ['categories'],
    searchParams
  );

  const deleteModal = useDeleteModal();

  const { mutate: deleteCategoryById } = useDeleteData(deleteCategoryAction, [
    'categories',
    categoryToDelete?.id,
  ]);

  const handleDelete = (id: string, name: string) => {
    setCategoryToDelete({ id, name });
    deleteModal.onOpen();
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete?.id) {
      deleteCategoryById(categoryToDelete.id);
      deleteModal.onClose();
    }
  };

  if (!data || isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  if (!data?.categories || data.categories.length === 0) {
    return (
      <EmptyState
        title="Категорії відсутні"
        actionLabel="Додати категорію"
        actionHref="/admin/categories/add"
      />
    );
  }

  const handleSort = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const categoriesCount = data?.count || 0;

  const page = searchParams.page ? Number(searchParams.page) : 1;

  const limit = Number(searchParams.limit) || 10;

  const totalPages = Math.ceil(categoriesCount / limit);
  const pageNumbers = [];
  const offsetNumber = 3;

  if (page) {
    for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
      if (i >= 1 && i <= totalPages) {
        pageNumbers.push(i);
      }
    }
  }

  const sortedCategories = [...(data?.categories || [])].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  return (
    <div className="p-3">
      <Breadcrumbs />

      <div className="flex items-center justify-between mb-8">
        {/* <Search placeholder="Знайти товар" /> */}{' '}
        <p className=" text-lg">
          {' '}
          Всього в базі{' '}
          <span className="subtitle text-lg">{categoriesCount}</span>{' '}
          категорія(-й)
        </p>{' '}
        <Link href="/admin/categories/add">
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
            <td className="p-2 border-r-2 text-center flex items-center">
              <Button
                label="Назва категорії"
                small
                width="80"
                type="button"
                icon={sortOrder === 'asc' ? FaSortAlphaUp : FaSortAlphaDown}
                onClick={handleSort}
                aria-label={`Sort categories ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              />
            </td>
            <td className="p-2 border-r-2 text-center">SVG іконка</td>
            <td className="p-2 border-r-2 text-center">Редагувати</td>
            <td className="p-2 border-r-2 text-center">Видалити</td>
          </tr>
        </thead>
        <tbody>
          {sortedCategories.map(category => (
            <tr key={category._id} className="border-b-2">
              <td className="p-2 border-r-2 text-start">{category.name}</td>
              <td className="p-2 border-r-2 text-start">
                <div className="flex justify-center">
                  <NextImage
                    src={category.src}
                    alt={category.name}
                    width={24}
                    height={24}
                    priority={true}
                  />
                </div>
              </td>
              <td className="p-2 border-r-2 text-center">
                <Link
                  href={`/admin/categories/${category._id}`}
                  className="flex items-center justify-center"
                >
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
                  onClick={() =>
                    category?._id &&
                    handleDelete(category?._id.toString(), category.name)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <Pagination count={categoriesCount} pageNumbers={pageNumbers} />
      )}
      {/* Модалка для підтвердження видалення */}
      <Modal
        body={
          <DeleteConfirmation
            onConfirm={handleDeleteConfirm}
            onCancel={() => deleteModal.onClose()}
            title={`категорію: ${categoryToDelete?.name}`}
          />
        }
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
      />
    </div>
  );
}
