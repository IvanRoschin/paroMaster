import Link from "next/link"
import { FaPen, FaRegStar, FaStar, FaStarHalfAlt, FaTrash } from "react-icons/fa"

import Button from "@/components/ui/Button" // або свій компонент кнопки
import { ITestimonial } from "@/types/index"

type StarProps = {
  rating?: number
  size?: number
}

const StarDisplay = ({ rating, size = 18 }: StarProps) => {
  const fullStars = rating ? Math.floor(rating) : 0
  const hasHalfStar = rating ? rating - fullStars >= 0.5 : false
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="text-yellow-500" size={size} />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-yellow-500" size={size} />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="text-yellow-500" size={size} />
      ))}
    </div>
  )
}

type Props = {
  data: {
    testimonials: ITestimonial[]
  }
  isAdmin?: boolean
  handleDelete: (id: string) => void
}

const ReviewList = ({ data, isAdmin = false, handleDelete }: Props) => {
  console.log("reviewsInReviewList", data)
  return (
    <div className="mt-10">
      <h3 className="text-2xl font-semibold mb-4">Відгуки</h3>
      {data.testimonials && data.testimonials.length > 0 ? (
        <ul className="grid gap-4 md:gap-6">
          {data.testimonials.map(review => (
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
                      onClick={() => {
                        if (review?._id) {
                          handleDelete(review._id.toString())
                        }
                      }}
                    />
                  </div>
                </div>
              )}
              <li className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-lg font-medium">{review.name}</p>
                  <StarDisplay rating={review?.rating ?? undefined} />
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
  )
}

export default ReviewList
