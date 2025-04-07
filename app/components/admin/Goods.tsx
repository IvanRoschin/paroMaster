"use client"

import { deleteGood, getAllGoods } from "@/actions/goods"
import Pagination from "@/components/admin/Pagination"
import Button from "@/components/Button"
import EmptyState from "@/components/EmptyState"
import { Loader, Search } from "@/components/index"
import { useDeleteData, useFetchData } from "@/hooks/index"
import { ISearchParams } from "@/types/index"
import Link from "next/link"
import { useState } from "react"
import {
  FaPen,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTrash
} from "react-icons/fa"

// export default function Goods({ searchParams }: { searchParams: ISearchParams }) {
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
//   const [sortBy, setSortBy] = useState<
//     "category" | "brand" | "price" | "availability" | "condition"
//   >("category")

//   const { data, isLoading, isError } = useFetchData(
//     { ...searchParams, sortOrder, sortBy },
//     getAllGoods,
//     "goods"
//   )
//   const { mutate: deleteGoodById } = useDeleteData(deleteGood, "goods")

//   const handleDelete = (id: string) => {
//     deleteGoodById(id)
//   }

//   if (isLoading) {
//     return <Loader />
//   }

//   if (isError) {
//     return <div>Error fetching data.</div>
//   }

//   if (!data?.goods || data.goods.length === 0) {
//     return <EmptyState showReset />
//   }

//   const goodsCount = data?.count || 0

//   const page = searchParams.page ? Number(searchParams.page) : 1

//   const limit = Number(searchParams.limit) || 10

//   const totalPages = Math.ceil(goodsCount / limit)
//   const pageNumbers = []
//   const offsetNumber = 3

//   if (page) {
//     for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
//       if (i >= 1 && i <= totalPages) {
//         pageNumbers.push(i)
//       }
//     }
//   }

//   const handleSort = (sortKey: "category" | "brand" | "price" | "availability" | "condition") => {
//     setSortBy(sortKey)
//     setSortOrder(prevOrder => (prevOrder === "asc" ? "desc" : "asc"))
//   }

//   const sortedGoods = [...data.goods].sort((a, b) => {
//     let comparison = 0

//     if (sortBy === "category") {
//       comparison = a.category.localeCompare(b.category)
//     } else if (sortBy === "brand") {
//       comparison = a.brand.localeCompare(b.brand)
//     } else if (sortBy === "price") {
//       comparison = a.price - b.price
//     } else if (sortBy === "availability") {
//       comparison = a.isAvailable === b.isAvailable ? 0 : a.isAvailable ? -1 : 1
//     } else if (sortBy === "condition") {
//       comparison = a.isCondition === b.isCondition ? 0 : a.isCondition ? -1 : 1
//     }

//     return sortOrder === "asc" ? comparison : -comparison
//   })
//   return (
//     <div className="p-3">
//       <div className="flex items-center justify-between mb-8">
//         <Search placeholder="Знайти товар" />
//         <Link href="/admin/goods/add">
//           <Button type="button" label="Додати" small outline color="border-green-400" />
//         </Link>
//       </div>
//       <table className="w-full text-xs mb-8">
//         <thead>
//           <tr className="bg-slate-300 font-semibold">
//             <td className="p-2 border-r-2 text-center">
//               <div className="flex items-center">
//                 <Button
//                   type="button"
//                   label="Категорія"
//                   icon={
//                     sortBy === "category" && sortOrder === "asc" ? FaSortAlphaUp : FaSortAlphaDown
//                   }
//                   onClick={() => handleSort("category")}
//                 />
//               </div>
//             </td>
//             <td className="p-2 border-r-2 text-center">
//               <div className="flex items-center">
//                 <Button
//                   type="button"
//                   icon={sortBy === "brand" && sortOrder === "asc" ? FaSortAlphaUp : FaSortAlphaDown}
//                   onClick={() => handleSort("brand")}
//                   label="Бренд"
//                 />
//               </div>
//             </td>
//             <td className="p-2 border-r-2 text-center">Модель</td>
//             <td className="p-2 border-r-2 text-center">Артикул</td>
//             <td className="p-2 border-r-2 text-center">
//               <div className="flex items-center">
//                 <Button
//                   label="Ціна"
//                   type="button"
//                   icon={
//                     sortBy === "price" && sortOrder === "asc" ? FaSortAmountUp : FaSortAmountDown
//                   }
//                   onClick={() => handleSort("price")}
//                   aria-label={`Sort by price ${sortOrder === "asc" ? "descending" : "ascending"}`}
//                 />
//               </div>
//             </td>
//             <td className="p-2 border-r-2 text-center">
//               <div className="flex items-center">
//                 <Button
//                   label="В наявності"
//                   type="button"
//                   icon={
//                     sortBy === "availability" && sortOrder === "asc"
//                       ? FaSortAmountUp
//                       : FaSortAmountDown
//                   }
//                   onClick={() => handleSort("availability")}
//                   aria-label={`Sort by availability ${
//                     sortOrder === "asc" ? "descending" : "ascending"
//                   }`}
//                 />
//               </div>
//             </td>
//             <td className="p-2 border-r-2 text-center">Редагувати</td>
//             <td className="p-2 border-r-2 text-center">Видалити</td>
//           </tr>
//         </thead>
//         <tbody>
//           {sortedGoods.map(good => (
//             <tr key={good._id} className="border-b-2 ">
//               <td className="p-2 border-r-2 text-start">{good.category}</td>
//               <td className="p-2 border-r-2 text-start">{good.brand}</td>
//               <td className="p-2 border-r-2 text-center">{good.model}</td>
//               <td className="p-2 border-r-2 text-center">{good.vendor}</td>
//               <td className="p-2 border-r-2 text-center">{good.price}</td>
//               <td className="p-2 border-r-2 text-center">{good.isAvailable ? "Так" : "Ні"}</td>
//               <td className="p-2 border-r-2 text-center">
//                 <Link
//                   href={`/admin/goods/${good._id}`}
//                   className="flex items-center justify-center"
//                 >
//                   <Button type="button" icon={FaPen} small outline color="border-yellow-400" />
//                 </Link>
//               </td>
//               <td className="p-2 text-center">
//                 <Button
//                   type="button"
//                   icon={FaTrash}
//                   small
//                   outline
//                   color="border-red-400"
//                   onClick={() => good._id && handleDelete(good._id.toString())}
//                 />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {totalPages > 1 && <Pagination count={goodsCount} pageNumbers={pageNumbers} />}{" "}
//     </div>
//   )
// }

// ... imports залишаються без змін

export default function Goods({ searchParams }: { searchParams: ISearchParams }) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [sortBy, setSortBy] = useState<
    "category" | "brand" | "price" | "availability" | "condition"
  >("category")

  const { data, isLoading, isError } = useFetchData(
    { ...searchParams, sortOrder, sortBy },
    getAllGoods,
    "goods"
  )
  const { mutate: deleteGoodById } = useDeleteData(deleteGood, "goods")

  const handleDelete = (id: string) => {
    deleteGoodById(id)
  }

  if (isLoading) return <Loader />
  if (isError) return <div>Ой, щось пішло не так 🥲</div>
  if (!data?.goods || data.goods.length === 0) return <EmptyState showReset />

  const goodsCount = data?.count || 0
  const page = searchParams.page ? Number(searchParams.page) : 1
  const limit = Number(searchParams.limit) || 10
  const totalPages = Math.ceil(goodsCount / limit)
  const offsetNumber = 3
  const pageNumbers = []

  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) pageNumbers.push(i)
  }

  const handleSort = (sortKey: "category" | "brand" | "price" | "availability" | "condition") => {
    setSortBy(sortKey)
    setSortOrder(prevOrder => (prevOrder === "asc" ? "desc" : "asc"))
  }

  const sortedGoods = [...data.goods].sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case "category":
        comparison = a.category.localeCompare(b.category)
        break
      case "brand":
        comparison = a.brand.localeCompare(b.brand)
        break
      case "price":
        comparison = a.price - b.price
        break
      case "availability":
        comparison = a.isAvailable === b.isAvailable ? 0 : a.isAvailable ? -1 : 1
        break
      case "condition":
        comparison = a.isCondition === b.isCondition ? 0 : a.isCondition ? -1 : 1
        break
    }
    return sortOrder === "asc" ? comparison : -comparison
  })

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-8">
        <Search placeholder="Знайти товар" />
        <Link href="/admin/goods/add">
          <Button type="button" label="Додати" small outline color="border-green-400" />
        </Link>
      </div>

      <table className="w-full text-xs mb-8">
        <thead>
          <tr className="bg-slate-300 font-semibold">
            <th className="p-2 border-r-2 text-center">
              <Button
                type="button"
                label="Категорія"
                icon={
                  sortBy === "category" && sortOrder === "asc" ? FaSortAlphaUp : FaSortAlphaDown
                }
                onClick={() => handleSort("category")}
              />
            </th>
            <th className="p-2 border-r-2 text-center">
              <Button
                type="button"
                label="Бренд"
                icon={sortBy === "brand" && sortOrder === "asc" ? FaSortAlphaUp : FaSortAlphaDown}
                onClick={() => handleSort("brand")}
              />
            </th>
            <th className="p-2 border-r-2 text-center">Модель</th>
            <th className="p-2 border-r-2 text-center">Артикул</th>
            <th className="p-2 border-r-2 text-center">
              <Button
                type="button"
                label="Ціна"
                icon={sortBy === "price" && sortOrder === "asc" ? FaSortAmountUp : FaSortAmountDown}
                onClick={() => handleSort("price")}
              />
            </th>
            <th className="p-2 border-r-2 text-center">
              <Button
                type="button"
                label="В наявності"
                icon={
                  sortBy === "availability" && sortOrder === "asc"
                    ? FaSortAmountUp
                    : FaSortAmountDown
                }
                onClick={() => handleSort("availability")}
              />
            </th>
            <th className="p-2 border-r-2 text-center">
              <Button
                type="button"
                label="Стан"
                icon={
                  sortBy === "condition" && sortOrder === "asc" ? FaSortAlphaUp : FaSortAlphaDown
                }
                onClick={() => handleSort("condition")}
              />
            </th>
            <th className="p-2 border-r-2 text-center">Редагувати</th>
            <th className="p-2 border-r-2 text-center">Видалити</th>
          </tr>
        </thead>
        <tbody>
          {sortedGoods.map(good => (
            <tr key={good._id} className="border-b-2">
              <td className="p-2 border-r-2 text-start">{good.category}</td>
              <td className="p-2 border-r-2 text-start">{good.brand}</td>
              <td className="p-2 border-r-2 text-center">{good.model}</td>
              <td className="p-2 border-r-2 text-center">{good.vendor}</td>
              <td className="p-2 border-r-2 text-center">{good.price} грн</td>
              <td className="p-2 border-r-2 text-center">{good.isAvailable ? "Так" : "Ні"}</td>
              <td className="p-2 border-r-2 text-center">{good.isCondition ? "Б/У" : "Нова"}</td>
              <td className="p-2 border-r-2 text-center">
                <Link href={`/admin/goods/${good._id}`}>
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
                  onClick={() => good._id && handleDelete(good._id.toString())}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && <Pagination count={goodsCount} pageNumbers={pageNumbers} />}
    </div>
  )
}
