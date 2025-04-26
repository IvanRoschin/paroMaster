"use client"

import { deleteOrder, getAllOrders } from "@/actions/orders"
import Pagination from "@/components/admin/Pagination"
import EmptyState from "@/components/EmptyState"
import { Loader } from "@/components/index"
import Button from "@/components/ui/Button"
import { useDeleteData, useFetchData } from "@/hooks/index"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { FaPen, FaTrash } from "react-icons/fa"
import Breadcrumbs from "../Breadcrumbs"
import ErrorMessage from "../ui/Error"

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const searchParams = useSearchParams()

  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")

  const { mutate: deleteOrderById } = useDeleteData(deleteOrder, ["orders"])

  const { data, isLoading, isError, error } = useFetchData(getAllOrders, ["orders"], {
    limit,
    page,
    status: statusFilter
  })

  if (!data || isLoading) {
    return <Loader />
  }

  if (isError) {
    return <ErrorMessage error={error} />
  }

  if (!data?.orders || data?.orders.length === 0) {
    return (
      <EmptyState
        showReset
        title="Відсутні замовлення 🤷‍♂️"
        onReset={() => {
          setStatusFilter(null)
        }}
      />
    )
  }

  const handleDelete = (id: string) => {
    deleteOrderById(id)
  }

  const ordersCount = data?.count || 0
  // const page = searchParams.page ? Number(searchParams.page) : 1
  // const limit = Number(searchParams.limit) || 10
  const totalPages = Math.ceil(ordersCount / limit)
  const pageNumbers = []
  const offsetNumber = 3

  if (page) {
    for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
      if (i >= 1 && i <= totalPages) {
        pageNumbers.push(i)
      }
    }
  }

  return (
    <div className="p-3">
      <Breadcrumbs />

      <div className="flex items-center justify-between mb-8">
        {/* <Search placeholder="Знайти товар" /> */}{" "}
        <p className=" text-lg">
          {" "}
          Всього в базі <span className="subtitle text-lg">{ordersCount}</span> замовлення(-нь)
        </p>
        <div className="flex items-center">
          {/* Status Filter Dropdown */}
          <select
            value={statusFilter || ""}
            onChange={e => setStatusFilter(e.target.value || null)}
            className="border border-gray-300 rounded p-2 text-sm mr-4"
          >
            <option value="">Всі статуси</option>
            <option value="Новий">Новий</option>
            <option value="Опрацьовується">Опрацьовується</option>
            <option value="Оплачений">Оплачений</option>
            <option value="На відправку">На відправку</option>
            <option value="Закритий">Закритий</option>
          </select>

          <Link href="/admin/orders/add">
            <Button label="Додати" small outline color="border-green-400" />
          </Link>
        </div>
      </div>
      <div className="p-3">
        <table className="w-full text-xs mb-8">
          <thead>
            <tr className="bg-slate-300 font-semibold">
              <td className="p-2 border-r-2 text-center">Номер замовлення</td>
              <td className="p-2 border-r-2 text-center">Дані клієнта</td>
              <td className="p-2 border-r-2 text-center">Товари</td>
              <td className="p-2 border-r-2 text-center">Загальна сума</td>
              <td className="p-2 border-r-2 text-center">Статус</td>
              <td className="p-2 border-r-2 text-center">Редагувати</td>
              <td className="p-2 text-center">Видалити</td>
            </tr>
          </thead>
          <tbody>
            {data.orders.map(order => (
              <tr key={order.number} className="border-b-2">
                <td className="p-2 border-r-2 text-center">{order.number}</td>
                <td className="p-2 border-r-2 text-left">
                  <strong>Ім&apos;я:</strong> {order.customer.name} <br />
                  <strong>Телефон:</strong> {order.customer.phone} <br />
                  <strong>Email:</strong> {order.customer.email} <br />
                  <strong>Місто:</strong> {order.customer.city} <br />
                  <strong>Склад:</strong> {order.customer.warehouse} <br />
                  <strong>Оплата:</strong> {order.customer.payment}
                </td>
                <td className="p-2 border-r-2 text-start">
                  <ul className="list-disc pl-4">
                    {order.orderedGoods.map(good => (
                      <li key={good._id}>
                        <strong>{good.title}</strong> - {good.brand}, {good.model}, {good.vendor}
                        (Кількість: {good.quantity}, Ціна: {good.price})
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-2 border-r-2 text-center">{order.totalPrice}</td>
                <td className="p-2 border-r-2 text-center">{order.status}</td>
                <td className="p-2 border-r-2 text-center">
                  <Link href={`/admin/orders/${order._id}`}>
                    <Button icon={FaPen} small outline color="border-yellow-400" />
                  </Link>
                </td>
                <td className="p-2 text-center">
                  <Button
                    icon={FaTrash}
                    small
                    outline
                    color="border-red-400"
                    onClick={() => order._id && handleDelete(order._id.toString())}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && <Pagination count={ordersCount} pageNumbers={pageNumbers} />}
    </div>
  )
}
