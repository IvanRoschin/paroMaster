import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { useScreenSize } from "../hooks"

interface CategoryPage {
  categories: { src: string; title: string }[]
}

const Category: React.FC<CategoryPage> = ({ categories }) => {
  const { width } = useScreenSize()
  const isMobile = width <= 767

  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  return (
    <div className="pt-0 mr-4 text-sm w-full md:w-[250px] mb-4">
      <h2 className="subtitle-main">Категорії товарів</h2>

      {/* Conditional rendering based on isMobile */}
      <ul
        className={`bg-secondaryBackground p-4 rounded-lg ${
          isMobile ? "grid grid-cols-2 gap-3" : ""
        }`}
      >
        {categories.map(({ src, title }, index) => (
          <li key={index} className="mb-3 nav">
            <Link
              href={`/category/?${createQueryString("category", title)}`}
              className="flex justify-start items-start group"
            >
              <Image
                alt={title}
                src={src}
                width={20}
                height={20}
                className="w-5 h-5 mr-3 transition-filter duration-300 ease-in-out group-hover:filter-primary"
              />
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Category
