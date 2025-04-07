"use client"

import { getGoodById } from "@/actions/goods"
import Button from "@/components/Button"
import ImagesBlock from "@/components/ImagesBlock"
import Loader from "@/components/Loader"
import { useFetchDataById } from "@/hooks/useFetchDataById"
import { IGood, ITestimonial } from "@/types/index"
import { useShoppingCart } from "app/context/ShoppingCartContext"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FaPen } from "react-icons/fa"

import TestimonialModal from "@/components/modals/TestimonialModal"

export default function Item({ params }: { params: any }) {
  const { data: session } = useSession()
  const isAdmin = session?.user
  const [, setAmount] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart } =
    useShoppingCart()

  const { data, isLoading, isError, error } = useFetchDataById(params.id, getGoodById, "good")

  useEffect(() => {
    if (data) {
      const newAmount = data.price * getItemQuantity(data._id)
      setAmount(newAmount)
      localStorage.setItem(`amount-${data._id}`, JSON.stringify(newAmount))
    }
  }, [data, getItemQuantity])

  if (isLoading || !data) return <Loader />
  if (isError) {
    return (
      <div>
        Error fetching good data: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    )
  }

  const quantity = getItemQuantity(data._id)

  return (
    <div className="m-6">
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
          <h2 className="font-semibold text-2xl mb-[40px]">{data.title}</h2>
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

          {/* Button to open testimonial modal */}
          <div className="mt-6">
            <Button
              width="40"
              type="button"
              label="Додати відгук"
              onClick={() => setIsModalOpen(true)} // Open the modal on button click
            />
          </div>

          {/* <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-4">Відгуки</h3>
            {data.testimonials && data.testimonials.length > 0 ? (
              <ul className="space-y-6">
                {data.testimonials.map((review: ITestimonial) => (
                  <li
                    key={review._id}
                    className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-lg font-medium">{review.name}</p>
                      <span className="text-yellow-500 font-bold">{review.rating} ★</span>
                    </div>
                    <p className="text-gray-600 italic mb-2">"{review.text}"</p>
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
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">Цей товар ще не має відгуків. Будь першим!</p>
            )}
          </div> */}
        </div>
      </div>

      {/* Display reviews */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">Відгуки</h3>
        {data.testimonials && data.testimonials.length > 0 ? (
          <ul className="grid gap-4 md:gap-6">
            {data.testimonials.map((review: ITestimonial) => (
              <li
                key={review._id}
                className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-lg font-medium">{review.name}</p>
                  <span className="text-yellow-500 font-bold">{review.rating} ★</span>
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
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">Цей товар ще не має відгуків. Будь першим!</p>
        )}
      </div>
      {/* Modal for adding testimonial */}
      <TestimonialModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        productId={params.id}
      />
    </div>
  )
}

function ItemDetails({ item }: { item: IGood }) {
  return (
    <>
      <p className="font-light text-gray-500">
        Сумісність з брендами: <span className="font-bold">{item.isCompatible ? "так" : "ні"}</span>
      </p>
      <p className="font-light text-gray-500">
        Brand: <span className="font-bold"> {item.brand}</span>
      </p>
      <p className="font-light text-gray-500">
        Model: <span className="font-bold">{item.model}</span>{" "}
      </p>
      <p className="font-light text-gray-500">
        Сумісність з брендами: <span className="font-bold">{item.compatibility}</span>
      </p>
    </>
  )
}
