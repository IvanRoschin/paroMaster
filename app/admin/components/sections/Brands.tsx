'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaPen, FaSortAlphaDown, FaSortAlphaUp, FaTrash } from 'react-icons/fa';

import { deleteBrand, getAllBrands } from '@/actions/brands';
import {
  Breadcrumbs,
  Button,
  DeleteConfirmation,
  EmptyState,
  ErrorMessage,
  Loader,
  Modal,
  Pagination,
} from '@/components/index';
import { useDeleteData, useDeleteModal, useFetchData } from '@/hooks/index';
import { ISearchParams } from '@/types/index';

export default function Brands({
  searchParams,
}: {
  searchParams: ISearchParams;
}) {
  const [brandToDelete, setBrandToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { data, isLoading, isError, error } = useFetchData(
    getAllBrands,
    ['brands'],
    searchParams
  );

  const deleteModal = useDeleteModal();

  const { mutate: deleteBrandById } = useDeleteData(deleteBrand, [
    'brands',
    brandToDelete?.id,
  ]);

  const handleDelete = (id: string, name: string) => {
    setBrandToDelete({ id, name });
    deleteModal.onOpen();
  };

  const handleDeleteConfirm = () => {
    if (brandToDelete?.id) {
      deleteBrandById(brandToDelete.id);
      deleteModal.onClose();
    }
  };

  if (!data || isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  const brandsCount = data?.count || 0;

  if (!data?.brands || brandsCount === 0) {
    return (
      <EmptyState
        title="Бренди відсутні"
        subtitle="Додайте перший бренд у систему"
        actionLabel="Додати бренд"
        actionHref="/admin/brands/add"
      />
    );
  }

  const handleSort = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = Number(searchParams.limit) || 10;
  const totalPages = Math.ceil(brandsCount / limit);
  const pageNumbers = [];
  const offsetNumber = 3;

  if (page) {
    for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
      if (i >= 1 && i <= totalPages) {
        pageNumbers.push(i);
      }
    }
  }

  const sortedBrands = [...(data?.brands || [])].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="p-3">
      <Breadcrumbs />

      <div className="flex items-center justify-between mb-8">
        <p className="text-lg">
          Всього в базі <span className="subtitle text-lg">{brandsCount}</span>{' '}
          бренд(-ів)
        </p>
        <Link href="/admin/brands/add">
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
                label="Назва бренду"
                small
                width="80"
                type="button"
                icon={sortOrder === 'asc' ? FaSortAlphaUp : FaSortAlphaDown}
                onClick={handleSort}
                aria-label={`Sort brands ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              />
            </td>
            <td className="p-2 border-r-2 text-center">Логотип</td>
            <td className="p-2 border-r-2 text-center">Редагувати</td>
            <td className="p-2 border-r-2 text-center">Видалити</td>
          </tr>
        </thead>
        <tbody>
          {sortedBrands.map(brand => (
            <tr key={brand._id} className="border-b-2">
              <td className="p-2 border-r-2 text-start">{brand.name}</td>
              <td className="p-2 border-r-2 text-start">
                {brand.src && (
                  <div className="flex justify-center">
                    <Image
                      src={brand.src}
                      alt={brand.name}
                      width={40}
                      height={40}
                      priority
                    />
                  </div>
                )}
              </td>
              <td className="p-2 border-r-2 text-center">
                <Link
                  href={`/admin/brands/${brand._id}`}
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
                    brand._id && handleDelete(brand._id.toString(), brand.name)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <Pagination count={brandsCount} pageNumbers={pageNumbers} />
      )}

      {/* Модалка для підтвердження видалення */}
      <Modal
        body={
          <DeleteConfirmation
            onConfirm={handleDeleteConfirm}
            onCancel={() => deleteModal.onClose()}
            title={`бренд: ${brandToDelete?.name}`}
          />
        }
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
      />
    </div>
  );
}
