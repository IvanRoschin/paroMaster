"use client"

import { deleteUser, getAllUsers, updateUser } from "@/actions/users"
import Search from "@/components/admin/AdminSearch"
import Pagination from "@/components/admin/Pagination"
import EmptyState from "@/components/EmptyState"
import Loader from "@/components/Loader"
import Button from "@/components/ui/Button"
import { useDeleteData, useFetchData } from "@/hooks/index"
import { ISearchParams, IUser } from "@/types/index"
import Link from "next/link"
import { useState } from "react"
import { FaPen, FaTrash } from "react-icons/fa"
import { toast } from "sonner"
import Switcher from "../Switcher"
import ErrorMessage from "../ui/Error"

export default function Users({ searchParams }: { searchParams: ISearchParams }) {
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const { data, isLoading, isError, error, refetch } = useFetchData(
    getAllUsers,
    ["users"],
    searchParams
  )

  const { mutate: deleteUserById } = useDeleteData(deleteUser, ["users"])

  const handleDelete = (id: string) => {
    deleteUserById(id)
  }

  const handleStatusToggle = async (_id: string | undefined, isActive: boolean) => {
    if (!_id) {
      toast.error("Invalid testimonial ID.")
      return
    }
    try {
      const values = { _id, isActive: !isActive }
      await updateUser(values as Partial<IUser> & { _id: string })
      refetch()
      toast.success("Статус користувача змінено!")
    } catch (error) {
      toast.error("Unknown error occurred.")
      console.error("Error updating testimonial status:", error)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <ErrorMessage error={error} />
  }

  if (!data?.users || data.users.length === 0) {
    return <EmptyState showReset />
  }

  const usersCount = data?.count || 0

  const page = searchParams.page ? Number(searchParams.page) : 1
  const limit = Number(searchParams.limit) || 10
  const totalPages = Math.ceil(usersCount / limit)
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
    <div className="p-3 rounded-xl">
      <div className="flex items-center justify-between mb-8">
        <Search placeholder="Знайти користувача" />
        <Link href="/admin/users/add">
          <Button type={"submit"} label="Додати" small outline color="border-green-400" />
        </Link>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-slate-300 font-semibold">
            <td className="p-2 border-r-2 text-center">Ім&apos;я</td>
            <td className="p-2 border-r-2 text-center">Email</td>
            <td className="p-2 border-r-2 text-center">Телефон</td>
            <td className="p-2 border-r-2 text-center">Створений</td>
            <td className="p-2 border-r-2 text-center">Роль</td>
            <td className="p-2 border-r-2 text-center">Статус</td>
            <td className="p-2 border-r-2 text-center">Редагувати</td>
            <td className="p-2 border-r-2 text-center">Видалити</td>
          </tr>
        </thead>
        <tbody>
          {data.users.map((user: IUser) => {
            return (
              <tr key={user._id} className="border-b-2">
                <td className="p-2 border-r-2 text-center">{user.name}</td>
                <td className="p-2 border-r-2 text-center">{user.email}</td>
                <td className="p-2 border-r-2 text-center">{user.phone}</td>
                <td className="p-2 border-r-2 text-center">
                  {new Date(user.createdAt).toLocaleDateString("uk-UA")}
                </td>
                <td className="p-2 border-r-2 text-center">{user.isAdmin ? "admin" : "user"}</td>
                <td className="p-2 border-r-2 text-center">
                  <Switcher
                    checked={user.isActive}
                    onChange={() => user._id && handleStatusToggle(user._id, user.isActive)}
                  />
                </td>
                <td className="p-2 border-r-2 text-center">
                  <Link
                    href={`/admin/users/${user._id}`}
                    className="flex items-center justify-center"
                  >
                    <Button type={"submit"} icon={FaPen} small outline color="border-yellow-400" />
                  </Link>
                </td>
                <td className="p-2 text-center">
                  <Button
                    type="button"
                    icon={FaTrash}
                    small
                    outline
                    color="border-red-400"
                    onClick={() => user._id && handleDelete(user._id.toString())}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {totalPages > 1 && <Pagination count={usersCount} pageNumbers={pageNumbers} />}
    </div>
  )
}
