"use client"

import { getGoodById } from "@/actions/goods"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { FaChevronRight } from "react-icons/fa"

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const customNames: Record<string, string> = {
  catalog: "Каталог",
  category: "Категорії",
  services: "Послуги",
  ourworks: "Наші роботи",
  delivery: "Доставка",
  guarantee: "Гарантія",
  contact: "Контакти",
  good: "Товари",
  admin: "Cторінка адміна",
  orders: "Замовлення",
  goods: "Товари",
  users: "Адміни",
  сategories: "Категорії",
  testimonials: "Відгуки",
  slider: "Слайди",
  checkout: "Оформлення Замовлення",
  privacypolicy: "Політика Конфіденційності",
  publicoffer: "Публічна Оферта"
}

const Breadcrumbs = () => {
  const pathname = usePathname()
  const [category, setCategory] = useState<string | null>(null)
  const [dynamicTitle, setDynamicTitle] = useState<string | null>(null)

  const pathSegments = pathname
    .split("/")
    .filter(Boolean)
    .map(seg => decodeURIComponent(seg))

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search)
      setCategory(searchParams.get("category"))
    }

    const lastSegment = pathSegments[pathSegments.length - 1]

    if (/^[0-9a-fA-F]{24}$/.test(lastSegment)) {
      const fetchGood = async () => {
        try {
          const good = await getGoodById(lastSegment)

          if (good?.title && good?.brand && good?.model) {
            setDynamicTitle(`${good.brand} ${good.title} ${good.model}`)
          } else if (good?.title) {
            setDynamicTitle(good.title)
          } else {
            setDynamicTitle("Товар")
          }
        } catch (error) {
          console.error("Error fetching good data:", error)
          setDynamicTitle("Товар")
        }
      }

      fetchGood()
    }
  }, [pathname, pathSegments])

  let segmentCrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/")
    let name

    if (index === pathSegments.length - 1 && dynamicTitle) {
      name = dynamicTitle
    } else {
      name = customNames[segment] || capitalize(segment.replace(/-/g, " "))
    }

    return { name, href }
  })

  if (category && !pathSegments.includes(category)) {
    const insertIndex = dynamicTitle ? segmentCrumbs.length - 1 : segmentCrumbs.length

    segmentCrumbs.splice(insertIndex, 0, {
      name: capitalize(category),
      href: `/catalog?category=${category}`
    })
  }
  const crumbs = [...segmentCrumbs]

  // const crumbs = [{ name: "Головна", href: "/" }, ...segmentCrumbs]

  return (
    <nav aria-label="breadcrumbs" className="text-sm text-gray-600 mb-4">
      <ol className="flex items-center flex-wrap space-x-2">
        <li>
          <Link href="/" className="nav text-gray-600 hover:text-gray-600  ">
            Головна
          </Link>
        </li>
        {crumbs.map((crumb, idx) => (
          <li key={crumb.href} className="flex items-center space-x-2 ">
            <FaChevronRight className="mx-1 text-gray-400 text-xs" />
            <Link
              href={crumb.href}
              className={`nav text-gray-800 font-medium hover:text-gray-800  ${
                idx === crumbs.length - 1 ? "text-gray-800 font-medium" : "text-blue-600"
              }`}
            >
              {crumb.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
