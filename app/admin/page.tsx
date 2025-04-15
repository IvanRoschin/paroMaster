import { getAllCategories } from "@/actions/categories"
import { getAllCustomers } from "@/actions/customers"
import { getAllGoods } from "@/actions/goods"
import { getAllOrders } from "@/actions/orders"
import { getAllSlides } from "@/actions/slider"
import { getAllTestimonials } from "@/actions/testimonials"
import { getAllUsers } from "@/actions/users"
import Card from "@/components/admin/Card"
import { ISearchParams } from "@/types/searchParams"
import { QueryClient } from "@tanstack/react-query"
import { IconType } from "react-icons"
import { FaShoppingCart, FaUser } from "react-icons/fa"
import { FiPackage } from "react-icons/fi"
import { RiAdminLine } from "react-icons/ri"
import { SiTestinglibrary } from "react-icons/si"

interface DataCount {
  count: number
}

interface CardData {
  title: string
  count: number
  link: string
  icon: IconType
}

export default async function Admin() {
  const queryClient = new QueryClient()

  // Define wrapper functions for prefetching with default parameters
  const fetchUsers = async () => {
    const response = await getAllUsers({} as ISearchParams)
    return { success: true, users: response.users, count: response.count }
  }

  const fetchCustomers = async () => {
    const response = await getAllCustomers({} as ISearchParams)
    return { success: true, users: response.customers, count: response.count }
  }
  const fetchOrders = async () => {
    const response = await getAllOrders({} as ISearchParams)
    return { success: true, users: response.orders, count: response.count }
  }
  const fetchSlides = async () => {
    const response = await getAllSlides({} as ISearchParams)
    return { success: true, users: response.slides, count: response.count }
  }

  const fetchTestimonials = async () => {
    const response = await getAllTestimonials({} as ISearchParams)
    return { success: true, users: response.testimonials, count: response.count }
  }

  const fetchGoods = async () => {
    const response = await getAllGoods({} as ISearchParams)
    return { success: true, users: response.goods, count: response.count }
  }

  const fetchCategories = async () => {
    const response = await getAllCategories()
    return { success: true, users: response.categories, count: response.count }
  }

  // Define an array of queries to prefetch
  const queries = [
    { key: "users", fetchFn: fetchUsers },
    { key: "customers", fetchFn: fetchCustomers },
    { key: "orders", fetchFn: fetchOrders },
    { key: "slides", fetchFn: fetchSlides },
    { key: "allTestimonials", fetchFn: fetchTestimonials },
    { key: "goods", fetchFn: fetchGoods },
    { key: "categories", fetchFn: fetchCategories }
  ]

  // Prefetch all queries
  try {
    await Promise.all(
      queries.map(({ key, fetchFn }) =>
        queryClient.prefetchQuery({
          queryKey: [key],
          queryFn: fetchFn
        })
      )
    )
  } catch (error) {
    console.error("Error prefetching data:", error)
  }

  // Get query states
  const getCount = (key: string) =>
    (queryClient.getQueryState([key])?.data as DataCount)?.count || 0

  // Card data using the count fetched from queries
  const cardData: CardData[] = [
    {
      title: "Адміністратори",
      count: getCount("users"),
      link: "admin/users",
      icon: RiAdminLine
    },
    {
      title: "Клієнти",
      count: getCount("customers"),
      link: "admin/customers",
      icon: FaUser
    },
    {
      title: "Замовлення",
      count: getCount("orders"),
      link: "admin/orders",
      icon: FaShoppingCart
    },
    {
      title: "Товари",
      count: getCount("goods"),
      link: "admin/goods",
      icon: FiPackage
    },
    {
      title: "Категорії",
      count: getCount("categories"),
      link: "admin/categories",
      icon: FiPackage
    },
    {
      title: "Відгуки",
      count: getCount("AllTestimonials"),
      link: "admin/testimonials",
      icon: SiTestinglibrary
    }
  ]

  return (
    <div className="flex items-center justify-center m-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cardData.map((data, index) => (
          <Card
            key={index}
            title={data.title}
            count={data.count}
            icon={data.icon}
            link={data.link}
          />
        ))}
      </div>
    </div>
  )
}
