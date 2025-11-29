'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  FaPen,
  FaRegStar,
  FaStar,
  FaStarHalfAlt,
  FaTrash,
} from 'react-icons/fa';

import {
  deleteTestimonialAction,
  getGoodTestimonialsAction,
} from '@/actions/testimonials';
import { useAppStore } from '@/app/store/appStore';
import { formatCurrency } from '@/app/utils/formatCurrency';
import {
  Breadcrumbs,
  Button,
  DeleteConfirmation,
  ErrorMessage,
  ImagesBlock,
  Loader,
  Modal,
  NextImage,
  TestimonialForm,
} from '@/components/index';
import { useDeleteModal, useTestimonialModal } from '@/hooks/index';
import useDeleteData from '@/hooks/useDeleteData';
import useFetchData from '@/hooks/useFetchData';
import { IGoodUI } from '@/types/IGood';
import { UserRole } from '@/types/IUser';

interface GoodPageClientProps {
  good: IGoodUI;
  role: UserRole;
}

const GoodPageClient: React.FC<GoodPageClientProps> = ({ good, role }) => {
  const [testimonialToDelete, setTestimonialToDelete] = useState<string>('');
  const [, setAmount] = useState(0);
  const { cart } = useAppStore();

  // const {
  //   getItemQuantity,
  //   increaseCartQuantity,
  //   decreaseCartQuantity,
  //   removeFromCart,
  // } = useShoppingCart();

  const productId = good?._id;
  const testimonialModal = useTestimonialModal();
  const deleteModal = useDeleteModal();

  // Отзывы
  const {
    data: testimonials,
    isLoading: isTestimonialsLoading,
    isError: isTestimonialsError,
    error: testimonialsError,
  } = useFetchData(
    getGoodTestimonialsAction,
    ['testimonials', productId],
    productId
  );

  const { mutate: deleteTestimonialById } = useDeleteData(
    deleteTestimonialAction,
    ['testimonials', productId]
  );

  useEffect(() => {
    if (!good) return;
    const newAmount = good.price * cart.getItemQuantity(good._id);
    setAmount(newAmount);
    localStorage.setItem(`amount-${good._id}`, JSON.stringify(newAmount));
  }, [good, cart]);

  const handleDelete = (id: string) => {
    setTestimonialToDelete(id);
    deleteModal.onOpen();
  };

  const handleDeleteTestimonial = (id: string) => {
    try {
      deleteTestimonialById(id);
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  if (!good || isTestimonialsLoading || !testimonials) return <Loader />;
  if (isTestimonialsError) return <ErrorMessage error={testimonialsError} />;

  const quantity = cart.getItemQuantity(good._id);

  return (
    <div className="m-6">
      <Breadcrumbs />

      <div className="flex flex-col justify-evenly lg:flex-row mb-4 lg:mb-0">
        <ImagesBlock item={good} />

        <div className="pt-10 relative max-w-xl">
          {role === UserRole.ADMIN && (
            <Link
              href={`/admin/goods/${good._id}`}
              className="absolute top-0 right-0 flex items-center justify-center"
            >
              <span className="cursor-pointer w-[30px] h-[30px] rounded-full bg-orange-600 flex justify-center items-center hover:opacity-80">
                <FaPen size={12} color="white" />
              </span>
            </Link>
          )}

          <h2 className="subtitle mb-[40px]">{good.title}</h2>
          <p className="mb-[20px]">{good.description}</p>
          <p
            className={`mb-[30px] ${
              good.isAvailable ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {good.isAvailable ? 'В наявності' : 'Немає в наявності'}
          </p>

          <p className="mb-[10px]">Артикул: {good.sku}</p>
          <p className="text-2xl font-bold mb-[30px]">
            {good.discountPrice ? (
              <>
                <span className="line-through text-gray-400 mr-2">
                  {formatCurrency(good.price, 'uk-UA', 'UAH')}
                </span>
                <span>
                  {formatCurrency(good.discountPrice, 'uk-UA', 'UAH')}
                </span>
              </>
            ) : (
              `${formatCurrency(good.price, 'uk-UA', 'UAH')}`
            )}
          </p>

          {/* Кнопки корзины */}
          <div className="mb-4">
            {quantity === 0 ? (
              <Button
                width="40"
                type="button"
                label="Купити"
                onClick={() => cart.increaseCartQuantity(good._id)}
                disabled={!good.isAvailable}
              />
            ) : (
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-4">
                  <Button
                    width="10"
                    label="-"
                    onClick={() => cart.decreaseCartQuantity(good._id)}
                    small
                    outline
                  />
                  <span className="text-xl">{quantity}</span>
                  <Button
                    width="10"
                    label="+"
                    onClick={() => cart.increaseCartQuantity(good._id)}
                    small
                    outline
                  />
                </div>
                <Button
                  width="40"
                  label="Видалити"
                  onClick={() => {
                    cart.removeFromCart(good._id);
                    localStorage.removeItem(`amount-${good._id}`);
                  }}
                />
              </div>
            )}
          </div>

          <ItemDetails item={good} />
        </div>
      </div>

      {/* Відгуки */}
      <div className="mt-10">
        <h3 className="subtitle">Відгуки</h3>

        {testimonials.length > 0 ? (
          <ul className="grid gap-4 md:gap-6">
            <div className="my-6">
              <Button
                width="40"
                type="button"
                label="Додати новий відгук"
                onClick={() => testimonialModal.onOpen()}
              />
            </div>
            {testimonials.map(review => (
              <div key={review._id} className="relative">
                {role === UserRole.ADMIN && (
                  <div className="absolute top-0 right-0 flex gap-2">
                    <Link
                      href={`/admin/testimonials/${review._id}`}
                      className="flex items-center justify-center"
                    >
                      <span className="cursor-pointer w-[30px] h-[30px] rounded-full bg-orange-600 flex justify-center items-center hover:opacity-80">
                        <FaPen size={12} color="white" />
                      </span>
                    </Link>
                    <Button
                      type="button"
                      icon={FaTrash}
                      small
                      outline
                      onClick={() =>
                        review._id && handleDelete(review._id.toString())
                      }
                    />
                  </div>
                )}

                <li className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    {Array.isArray(review.author)
                      ? review.author.join(' ')
                      : review.author}
                    {review.rating && <StarDisplay rating={review.rating} />}
                  </div>
                  <p className="text-gray-600 italic mb-2">“{review.text}”</p>
                  <p className="text-sm text-gray-400">
                    Додано:{' '}
                    {new Date(review.createdAt).toLocaleDateString('uk-UA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  {!review.isActive && (
                    <p className="text-xs text-red-500 mt-2">
                      * Відгук ще не опублікований
                    </p>
                  )}
                </li>
              </div>
            ))}
          </ul>
        ) : (
          <>
            <p className="text-gray-500 italic">
              Цей товар ще не має відгуків. Будь першим!
            </p>
            <div className="mt-6">
              <Button
                width="40"
                type="button"
                label="Додати перший відгук"
                onClick={() => testimonialModal.onOpen()}
              />
            </div>
          </>
        )}
      </div>

      {/* Модалки */}
      <Modal
        body={<TestimonialForm productId={good._id} />}
        isOpen={testimonialModal.isOpen}
        onClose={testimonialModal.onClose}
        disabled={isTestimonialsLoading}
      />

      <Modal
        body={
          <DeleteConfirmation
            onConfirm={() => {
              if (testimonialToDelete) {
                handleDeleteTestimonial(testimonialToDelete);
                deleteModal.onClose();
              }
            }}
            onCancel={() => deleteModal.onClose()}
            title="відгук"
          />
        }
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        disabled={isTestimonialsLoading}
      />
    </div>
  );

  // ======================== ВНУТРЕННИЕ КОМПОНЕНТЫ ========================

  function ItemDetails({ item }: { item: IGoodUI }) {
    const categoryName =
      item.category && typeof item.category === 'object'
        ? item.category.name
        : '—';

    const brandName =
      item.brand && typeof item.brand === 'object' ? item.brand.name : '—';

    return (
      <div className="space-y-2">
        <p className="font-light text-gray-500">
          Категорія: <span className="font-bold">{categoryName}</span>
        </p>

        <p className="font-light text-gray-500">
          Виробник: <span className="font-bold">{brandName}</span>
        </p>

        <p className="font-light text-gray-500">
          Модель: <span className="font-bold">{item.model}</span>
        </p>

        <p className="font-light text-gray-500">
          Сумісність з іншими моделями:{' '}
          <span className="font-bold">{item.isCompatible ? 'так' : 'ні'}</span>
        </p>
        {/* Сумісні товари - карусель */}
        {Array.isArray(good.compatibleGoods) &&
          good.compatibleGoods.length > 0 && (
            <div className="mt-10">
              <h3 className="subtitle mb-2">Сумісні товари</h3>
              <div className="flex overflow-x-auto gap-4 py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {good.compatibleGoods.map((cg, i) => {
                  // Если cg - объект, приводим _id к строке
                  const id =
                    typeof cg === 'string'
                      ? cg
                      : cg && cg._id
                        ? cg._id.toString()
                        : null;

                  if (!id) return null; // если id нет — не рендерим

                  const title =
                    typeof cg === 'string' ? cg : cg.title || 'Без назви';
                  const src = typeof cg === 'string' ? undefined : cg.src?.[0];

                  return (
                    <Link
                      key={i}
                      href={`/catalog/${id}`}
                      className="flex-shrink-0 w-40 flex flex-col items-center gap-2 p-2 border rounded hover:shadow-lg transition-shadow"
                    >
                      {src && (
                        <NextImage
                          useSkeleton
                          src={src}
                          alt={title}
                          width={120}
                          height={120}
                          className="object-cover rounded"
                        />
                      )}
                      <span className="text-center text-sm font-medium">
                        {title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
      </div>
    );
  }

  function StarDisplay({
    rating,
    size = 18,
  }: {
    rating: number;
    size?: number;
  }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-500" size={size} />
        ))}
        {hasHalfStar && (
          <FaStarHalfAlt key="half" className="text-yellow-500" size={size} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar
            key={`empty-${i}`}
            className="text-yellow-500"
            size={size}
          />
        ))}
      </div>
    );
  }
};

export default GoodPageClient;
