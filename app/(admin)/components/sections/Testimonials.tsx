'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';

import {
  deleteTestimonial,
  getAllTestimonials,
  updateTestimonial,
} from '@/actions/testimonials';
import {
  Breadcrumbs,
  Button,
  DeleteConfirmation,
  EmptyState,
  ErrorMessage,
  Loader,
  Modal,
  Pagination,
  Switcher,
} from '@/components/index';
import { useDeleteData, useDeleteModal, useFetchData } from '@/hooks/index';
import { ITestimonial } from '@/types/index';

export default function Testimonials() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [testimonialToDelete, setTestimonialToDelete] = useState<{
    id: string;
    author: string[];
    text: string;
  } | null>(null);

  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '4');

  const { data, isLoading, isError, error, refetch } = useFetchData(
    getAllTestimonials,
    ['testimonials'],
    { limit, page, status: statusFilter }
  );
  const { mutate: deleteTestimonialById } = useDeleteData(deleteTestimonial, [
    'testimonials',
    testimonialToDelete?.id,
  ]);

  const deleteModal = useDeleteModal();

  const handleDelete = (id: string, author: string[], text: string) => {
    setTestimonialToDelete({ id, author, text });
    deleteModal.onOpen();
  };

  const handleDeleteConfirm = () => {
    if (testimonialToDelete?.id) {
      deleteTestimonialById(testimonialToDelete.id);
      deleteModal.onClose();
    }
  };

  // const handleDelete = (id: string) => {
  //   deleteTestimonialById(id);
  // };

  const handleStatusToggle = async (
    _id: string | undefined,
    isActive: boolean
  ) => {
    if (!_id) {
      toast.error('Invalid testimonial ID.');
      return;
    }
    try {
      const values = { _id, isActive: !isActive };
      await updateTestimonial(
        values as Partial<ITestimonial> & { _id: string }
      );
      refetch();
      toast.success('Статус відгуку змінено!');
    } catch (error) {
      toast.error('Unknown error occurred.');
      console.error('Error updating testimonial status:', error);
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage error={error} />;
  if (!data?.testimonials || data.testimonials.length === 0)
    return (
      <EmptyState
        title="Відгуки відсутні"
        actionLabel="Додати відгук"
        actionHref="/admin/testimonials/add"
      />
    );

  // Pagination setup
  const testimonialsCount = data?.count || 0;
  // const page = searchParams.page ? Number(searchParams.page) : 1
  // const limit = Number(searchParams.limit) || 10
  const totalPages = Math.ceil(testimonialsCount / limit);
  const pageNumbers = [];
  const offsetNumber = 3;

  if (page) {
    for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
      if (i >= 1 && i <= totalPages) {
        pageNumbers.push(i);
      }
    }
  }
  return (
    <div className="p-3">
      <Breadcrumbs />

      <div className="flex items-center justify-between mb-8">
        <p className=" text-lg">
          {' '}
          Всього в базі{' '}
          <span className="subtitle text-lg">{testimonialsCount}</span> відгуки
          (-ів)
        </p>
        <div className="flex items-center">
          <select
            value={statusFilter || ''}
            onChange={e => setStatusFilter(e.target.value || null)}
            className="border border-gray-300 rounded p-2 text-sm mr-4"
          >
            <option value="">Всі статуси</option>
            <option value="Опублікований">Опублікований</option>
            <option value="Не публікується">Не публікується</option>
          </select>

          <Link href="/admin/testimonials/add">
            <Button
              type="button"
              label="Додати"
              small
              outline
              color="border-green-400"
            />
          </Link>
        </div>
      </div>
      <div className="p-3">
        <table className="w-full text-xs mb-8">
          <thead>
            <tr className="bg-slate-300 font-semibold">
              <td className="p-2 border-r-2 text-center">
                Ім&apos;я користувача
              </td>
              <td className="p-2 border-r-2 text-center">Текст відгуку</td>
              <td className="p-2 border-r-2 text-center">Рейтинг</td>
              <td className="p-2 border-r-2 text-center">Дата додавання</td>
              <td className="p-2 border-r-2 text-center">Публікується?</td>
              <td className="p-2 border-r-2 text-center">Редагувати</td>
              <td className="p-2 text-center">Видалити</td>
            </tr>
          </thead>
          <tbody>
            {data.testimonials.map((testimonial, index) => (
              <tr key={`${testimonial._id}-${index}`} className="border-b-2">
                <td className="p-2 border-r-2 text-center">
                  {testimonial.author}
                </td>
                <td className="p-2 border-r-2 text-start">
                  {testimonial.text}
                </td>
                <td className="p-2 border-r-2 text-center">
                  {testimonial.rating}
                </td>
                <td className="p-2 border-r-2 text-center">
                  {new Date(testimonial.createdAt).toLocaleDateString('uk-UA')}
                </td>
                <td className="p-2 border-r-2 text-center">
                  <Switcher
                    checked={testimonial.isActive}
                    onChange={() =>
                      testimonial._id &&
                      handleStatusToggle(testimonial._id, testimonial.isActive)
                    }
                  />
                </td>
                <td className="p-2 text-center">
                  <Link href={`/admin/testimonials/${testimonial._id}`}>
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
                      testimonial._id &&
                      handleDelete(
                        testimonial._id.toString(),
                        testimonial.author,
                        testimonial.text
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <Pagination count={testimonialsCount} pageNumbers={pageNumbers} />
      )}
      {/* Модалка для підтвердження видалення */}
      <Modal
        body={
          <DeleteConfirmation
            onConfirm={handleDeleteConfirm}
            onCancel={() => deleteModal.onClose()}
            title={`відгук aвтора ${testimonialToDelete?.author} &nbsp; текст: ${testimonialToDelete?.text} `}
          />
        }
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
      />
    </div>
  );
}
