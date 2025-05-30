"use client"

import { useShoppingCart } from "app/context/ShoppingCartContext"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FaPen, FaRegStar, FaStar, FaStarHalfAlt, FaTrash } from "react-icons/fa"

import { getGoodById } from "@/actions/goods"
import { deleteTestimonial, getGoodTestimonials } from "@/actions/testimonials"
import DeleteConfirmation from "@/components/common/DeleteConfirmation"
import {
  Breadcrumbs,
  ErrorMessage,
  Loader,
  Modal,
  ProductList,
  TestimonialForm
} from "@/components/index"
import ImagesBlock from "@/components/sections/ImagesBlock"
import Button from "@/components/ui/Button"
import {
  useDeleteData,
  useDeleteModal,
  useFetchData,
  useFetchDataById,
  useTestimonialModal
} from "@/hooks/index"
import { IGood, ITestimonial } from "@/types/index"

export default function GoodPage({ params }: { params: any }) {
  const { data: session } = useSession()
  const isAdmin = session?.user
  const [, setAmount] = useState(0)

  const [testimonialToDelete, setTestimonialToDelete] = useState<string>("")

  const { getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart } =
    useShoppingCart()

  const { data, isLoading, isError, error } = useFetchDataById(getGoodById, ["goodById"], params.id)

  const {
    data: testimonials,
    isLoading: isTestimonialsLoading,
    isError: isTestimonialsError,
    error: testimonialsError
  } = useFetchData(() => getGoodTestimonials(params.id), ["testimonials"])

  const { mutate: deleteTestimonialById } = useDeleteData(deleteTestimonial, ["testimonials"])

  const testimonialModal = useTestimonialModal()
  const deleteModal = useDeleteModal()

  useEffect(() => {
    if (!data) {
      return
    }
    const newAmount = data.price * getItemQuantity(data._id)
    setAmount(newAmount)
    localStorage.setItem(`amount-${data._id}`, JSON.stringify(newAmount))
  }, [data, getItemQuantity])

  const handleDelete = (id: string) => {
    setTestimonialToDelete(id)
    deleteModal.onOpen()
  }

  const handleDeleteTestimonial = (id: string) => {
    try {
      deleteTestimonialById(id)
    } catch (error) {
      console.error("Error deleting testimonial:", error)
    }
  }

  if (isLoading || isTestimonialsLoading || !data || !testimonials) {
    return <Loader />
  }

  if (isError || isTestimonialsError) {
    return <ErrorMessage error={error || testimonialsError} />
  }

  const quantity = getItemQuantity(data._id)

  return (
    <div className="m-6">
      <Breadcrumbs />

      <div className="flex flex-col justify-evenly lg:flex-row mb-4 lg:mb-0">
        <ImagesBlock item={data} />
        <div className="pt-10 relative">
          {isAdmin && (
            <Link
              href={`/admin/goods/${data._id}`}
              className="absolute top-0 right-0 flex items-center justify-center"
            >
              <span className="cursor-pointer w-[30px] h-[30px] rounded-full bg-orange-600 flex justify-center items-center hover:opacity-80">
                <FaPen size={12} color="white" />
              </span>
            </Link>
          )}
          <h2 className="subtitle mb-[40px]">{data.title}</h2>
          <p className="mb-[20px]">{data.description}</p>
          <p className={`mb-[30px] ${data.isAvailable ? "text-green-600" : "text-red-600"}`}>
            {data.isAvailable ? "В наявності" : "Немає в наявності"}
          </p>
          <p className="mb-[20px]">Артикул: {data.vendor}</p>
          <p className="text-2xl font-bold mb-[30px]">{data.price} грн</p>

          <div className="mb-4">
            {quantity === 0 ? (
              <Button
                width="40"
                type="button"
                label="Купити"
                onClick={() => increaseCartQuantity(data._id)}
                disabled={!data.isAvailable}
              />
            ) : (
              <div className="flex items-center flex-col gap-10">
                <div className="flex items-center justify-center gap-20">
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      width="40"
                      type="button"
                      label="-"
                      onClick={() => decreaseCartQuantity(data._id)}
                      small
                      outline
                    />
                    <span className="text-xl">{quantity}</span> в корзині
                    <Button
                      width="40"
                      type="button"
                      label="+"
                      onClick={() => increaseCartQuantity(data._id)}
                      small
                      outline
                    />
                  </div>
                </div>
                <Button
                  width="40"
                  type="button"
                  label="Видалити"
                  disabled={data.isAvailable === "false"}
                  onClick={() => {
                    removeFromCart(data._id)
                    localStorage.removeItem(`amount-${data._id}`)
                  }}
                />
              </div>
            )}
          </div>

          <ItemDetails item={data} />

          <div className="mt-6">
            <Button
              width="40"
              type="button"
              label="Додати відгук"
              onClick={() => {
                testimonialModal.onOpen()
              }}
            />
          </div>
        </div>
      </div>

      {/* Display reviews */}
      <div className="mt-10">
        <h3 className="subtitle">Відгуки</h3>
        {testimonials && testimonials.length > 0 ? (
          <ul className="grid gap-4 md:gap-6">
            {testimonials.map((review: ITestimonial) => (
              <div key={review._id} className="relative">
                {isAdmin && (
                  <div className="absolute top-0 right-0">
                    <div className="grid grid-cols-2 gap-2">
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
                        bg="bg"
                        onClick={() => review._id && handleDelete(review._id.toString())}
                      />
                    </div>
                  </div>
                )}
                <li
                  key={review._id}
                  className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-lg font-medium">{review.name}</p>
                    {review.rating && <StarDisplay rating={review.rating} />}
                    {/* <span className="text-yellow-500 font-bold">{review.rating} ★</span> */}
                  </div>
                  <p className="text-gray-600 italic mb-2">&ldquo;{review.text}&rdquo;</p>
                  <p className="text-sm text-gray-400">
                    Додано:{" "}
                    {new Date(review.createdAt).toLocaleDateString("uk-UA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                  {!review.isActive && (
                    <p className="text-xs text-red-500 mt-2">* Відгук ще не опублікований</p>
                  )}
                </li>
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">Цей товар ще не має відгуків. Будь першим!</p>
        )}
      </div>

      {/* Display compatibleGoods */}
      {data.compatibleGoods.length > 0 && (
        <div className="mt-10">
          <h3 className="subtitle">Сумісні товари</h3>
          <ProductList goods={data.compatibleGoods} />
        </div>
      )}

      {/* Модалка для відгуку */}
      <Modal
        body={<TestimonialForm productId={data._id} />}
        isOpen={testimonialModal.isOpen}
        onClose={testimonialModal.onClose}
        disabled={isLoading}
      />

      {/* Модалка для підтвердження видалення */}
      <Modal
        body={
          <DeleteConfirmation
            onConfirm={() => {
              if (testimonialToDelete) {
                handleDeleteTestimonial(testimonialToDelete)
                deleteModal.onClose()
              }
            }}
            onCancel={() => deleteModal.onClose()}
            title="відгук"
          />
        }
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        disabled={isLoading}
      />
    </div>
  )
  function ItemDetails({ item }: { item: IGood }) {
    return (
      <>
        <p className="font-light text-gray-500">
          Сумісність з іншими моделями:{" "}
          <span className="font-bold">{item.isCompatible ? "так" : "ні"}</span>
        </p>
        <p className="font-light text-gray-500">
          Виробник: <span className="font-bold"> {item.brand}</span>
        </p>
        <p className="font-light text-gray-500">
          Модель: <span className="font-bold">{item.model}</span>{" "}
        </p>
        <p className="font-light text-gray-500">
          Сумісний з моделями:{" "}
          <span className="font-bold">
            {data.compatibleGoods.map((product: IGood, i: number) => (
              <span key={product._id}>
                <Link
                  href={`/good/${product._id}`}
                  className="text-primaryAccentColor hover:underline"
                >
                  {product.model}
                </Link>
                {i < data.compatibleGoods.length - 1 ? ", " : ""}
              </span>
            ))}
          </span>
        </p>
      </>
    )
  }
  function StarDisplay({ rating, size = 18 }: { rating: number; size?: number }) {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating - fullStars >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center space-x-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-500" size={size} />
        ))}
        {hasHalfStar && <FaStarHalfAlt key="half" className="text-yellow-500" size={size} />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-yellow-500" size={size} />
        ))}
      </div>
    )
  }
}
