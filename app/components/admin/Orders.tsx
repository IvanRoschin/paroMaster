"use client"

import { deleteOrder, getAllOrders } from "@/actions/orders"
import Pagination from "@/components/admin/Pagination"
import Button from "@/components/Button"
import EmptyState from "@/components/EmptyState"
import { Loader, Search } from "@/components/index"
import { useDeleteData, useFetchData } from "@/hooks/index"
import { ISearchParams } from "@/types/searchParams"
import Link from "next/link"
import { useState } from "react"
import { FaPen, FaTrash } from "react-icons/fa"

export default function Orders({
  searchParams,
  limit
}: {
  searchParams: ISearchParams
  limit: number
}) {
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  // Вызов хуков на верхнем уровне
  const { mutate: deleteOrderById } = useDeleteData(deleteOrder, "orders")

  // Получаем данные с сервера
  const { data, isLoading, isError, refetch } = useFetchData(
    { ...searchParams, status: statusFilter },
    limit,
    getAllOrders,
    "orders"
  )

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <div>Error fetching data.</div>
  }

  if (!data?.orders || data?.orders.length === 0) {
    return <EmptyState showReset title="Відсутні замовлення 🤷‍♂️" />
  }

  const handleDelete = (id: string) => {
    // Удаляем заказ
    deleteOrderById(id, {
      onSuccess: () => {
        // После удаления перезагружаем данные
        refetch() // Это перезагружает запрос с сервера и обновляет данные
      }
    })
  }

  const ordersCount = data?.count || 0
  const page = searchParams.page ? Number(searchParams.page) : 1
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
      <div className="flex items-center justify-between mb-8">
        <Search placeholder="Знайти замовлення" />

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
