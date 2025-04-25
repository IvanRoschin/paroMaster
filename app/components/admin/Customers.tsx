"use client"

import { deleteCustomer, getAllCustomers } from "@/actions/customers"
import Pagination from "@/components/admin/Pagination"
import EmptyState from "@/components/EmptyState"
import { Loader } from "@/components/index"
import Button from "@/components/ui/Button"
import { useDeleteData, useFetchData } from "@/hooks/index"
import { ISearchParams } from "@/types/searchParams"
import Link from "next/link"
import { FaPen, FaTrash } from "react-icons/fa"
import ErrorMessage from "../ui/Error"

export default function Customers({ params }: { params: ISearchParams }) {
  const { data, isLoading, isError, error } = useFetchData(getAllCustomers, ["customers"], params)
  const { mutate: deleteCustomerById } = useDeleteData(deleteCustomer, ["customers"])

  const handleDelete = (id: string) => {
    deleteCustomerById(id)
  }

  if (!data || isLoading) {
    return <Loader />
  }

  if (isError) {
    return <ErrorMessage error={error} />
  }

  if (!data?.customers || data.customers.length === 0) {
    return <EmptyState showReset />
  }

  const customersCount = data?.count || 0
  const page = params.page ? Number(params.page) : 1
  const limit = Number(params.limit) || 10
  const totalPages = Math.ceil(customersCount / limit)
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
        {/* <Search placeholder="Знайти товар" /> */}{" "}
        <p className=" text-lg">
          {" "}
          Всього в базі <span className="subtitle text-lg">{customersCount}</span> клієнта(-ів)
        </p>{" "}
        <Link href="/admin/customers/add">
          <Button type="button" label="Додати" small outline color="border-green-400" />
        </Link>
      </div>
      <table className="w-full text-xs mb-8">
        <thead>
          <tr className="bg-slate-300 font-semibold">
            <td className="p-2 border-r-2 text-center">Ім&apos;я та Прізвище</td>
            <td className="p-2 border-r-2 text-center">Телефон</td>
            <td className="p-2 border-r-2 text-center">E-mail</td>
            <td className="p-2 border-r-2 text-center">Місто</td>
            <td className="p-2 border-r-2 text-center">Склад</td>
            <td className="p-2 border-r-2 text-center">Спосіб оплати</td>
            <td className="p-2 border-r-2 text-center">Редагувати</td>
            <td className="p-2 border-r-2 text-center">Видалити</td>
          </tr>
        </thead>
        <tbody>
          {data.customers.map(customer => (
            <tr key={customer._id} className="border-b-2 ">
              <td className="p-2 border-r-2 text-start">{customer.name}</td>
              <td className="p-2 border-r-2 text-start">{customer.phone}</td>
              <td className="p-2 border-r-2 text-start">{customer.email}</td>
              <td className="p-2 border-r-2 text-center">{customer.city}</td>
              <td className="p-2 border-r-2 text-center">{customer.warehouse}</td>
              <td className="p-2 border-r-2 text-center">{customer.payment}</td>

              <td className="p-2 border-r-2 text-center">
                <Link
                  href={`/admin/customers/${customer._id}`}
                  className="flex items-center justify-center"
                >
                  <Button type="button" icon={FaPen} small outline color="border-yellow-400" />
                </Link>
              </td>
              <td className="p-2 text-center">
                <Button
                  type="button"
                  icon={FaTrash}
                  small
                  outline
                  color="border-red-400"
                  onClick={() => customer._id && handleDelete(customer._id.toString())}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && <Pagination count={customersCount} pageNumbers={pageNumbers} />}
    </div>
  )
}
