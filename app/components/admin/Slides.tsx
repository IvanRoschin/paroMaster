"use client"

import { deleteSlide, getAllSlides, updateSlide } from "@/actions/slider"
import Pagination from "@/components/admin/Pagination"
import EmptyState from "@/components/EmptyState"
import Loader from "@/components/Loader"
import Button from "@/components/ui/Button"
import { useDeleteData, useFetchData } from "@/hooks/index"
import { ISlider } from "@/types/index"
import { ISearchParams } from "@/types/searchParams"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { FaPen, FaTrash } from "react-icons/fa"
import { toast } from "sonner"
import Switcher from "../Switcher"
import ErrorMessage from "../ui/Error"

export default function Slides({ searchParams }: { searchParams: ISearchParams }) {
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 10

  const { data, isLoading, isError, error, refetch } = useFetchData(getAllSlides, ["slides"], {
    ...searchParams,
    status: statusFilter
  })

  const { mutate: deleteSliderById } = useDeleteData(deleteSlide, ["slides"])

  const handleDelete = (id: string) => {
    deleteSliderById(id)
  }

  const handleStatusToggle = async (_id: string | undefined, isActive: boolean) => {
    if (!_id) return toast.error("Неправильний ID слайда.")
    try {
      const values = { _id, isActive: !isActive }
      await updateSlide(values as Partial<ISlider> & { _id: string })
      toast.success("Статус слайду оновлено!")
      refetch()
    } catch (error) {
      console.error("Помилка оновлення статусу слайду:", error)
      toast.error("Помилка зміни статусу.")
    }
  }

  if (isLoading) return <Loader />
  if (isError) return <ErrorMessage error={error} />
  if (!data?.slides || data.slides.length === 0)
    return (
      <EmptyState
        showReset
        onReset={() => {
          setStatusFilter(null)
        }}
      />
    )

  const slidesCount = data.count || 0
  const totalPages = Math.ceil(slidesCount / limit)
  const pageNumbers = []
  const offsetNumber = 3
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) pageNumbers.push(i)
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-8">
        {/* <Search placeholder="Знайти слайд" /> */}
        <p className=" text-lg">
          {" "}
          Всього в базі <span className="subtitle text-lg">{slidesCount}</span> слайди(-ів)
        </p>
        <div className="flex items-center gap-4">
          <select
            value={statusFilter || ""}
            onChange={e => setStatusFilter(e.target.value || null)}
            className="border border-gray-300 rounded p-2 text-sm"
          >
            <option value="">Всі статуси</option>
            <option value="Опублікований">Опублікований</option>
            <option value="Не публікується">Не публікується</option>
          </select>
          <Link href="/admin/slider/add">
            <Button type="button" label="Додати" small outline color="border-green-400" />
          </Link>
        </div>
      </div>
      <table className="w-full text-xs mb-8">
        <thead>
          <tr className="bg-slate-300 font-semibold">
            <td className="p-2 border-r-2 text-center">Заголовок</td>
            <td className="p-2 border-r-2 text-center">Опис</td>
            <td className="p-2 border-r-2 text-center">Зображення</td>
            <td className="p-2 border-r-2 text-center">Статус</td>
            <td className="p-2 border-r-2 text-center">Редагувати</td>
            <td className="p-2 text-center">Видалити</td>
          </tr>
        </thead>
        <tbody>
          {data.slides.map(slide => (
            <tr key={slide._id} className="border-b-2">
              <td className="p-2 border-r-2 text-start">{slide.title}</td>
              <td className="p-2 border-r-2 text-start">{slide.desc}</td>
              <td className="p-2 border-r-2">
                <div className="flex justify-center">
                  <Image src={slide.src[0]} alt={slide.title} width={100} height={100} priority />
                </div>
              </td>
              <td className="p-2 border-r-2 text-center">
                <Switcher
                  checked={slide.isActive}
                  onChange={() =>
                    slide._id && handleStatusToggle(slide._id.toString(), slide.isActive)
                  }
                />
              </td>
              <td className="p-2 border-r-2 text-center">
                <Link href={`/admin/slider/${slide._id}`} className="flex justify-center">
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
                  onClick={() => slide._id && handleDelete(slide._id.toString())}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={slidesCount} pageNumbers={pageNumbers} />
    </div>
  )
}
