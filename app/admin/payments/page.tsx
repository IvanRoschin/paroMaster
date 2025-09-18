import { getTransactionList } from "@/actions/wayForPay"
import { Badge, Card, CardContent, CardHeader, CardTitle, ScrollArea } from "@/admin/components/ui"

async function getTransactionsForPeriod(dateBegin: number, dateEnd: number) {
  const results: any[] = []
  const maxPeriod = 31 * 24 * 60 * 60 // 31 день в секундах

  let start = dateBegin
  while (start < dateEnd) {
    const end = Math.min(start + maxPeriod, dateEnd)

    try {
      const part = await getTransactionList(start, end)
      if (Array.isArray(part)) results.push(...part)
    } catch (err) {
      console.error(`Ошибка при загрузке транзакций за период ${start}-${end}`, err)
    }

    start = end
  }

  return results
}

const statusColors: Record<string, string> = {
  Approved: "bg-green-500 text-white",
  Pending: "bg-yellow-500 text-white",
  Declined: "bg-red-500 text-white"
}

const PaymentsList = async () => {
  const now = Math.floor(Date.now() / 1000)
  const halfYearAgo = now - 182 * 24 * 60 * 60

  let transactions: any[] = []
  try {
    transactions = await getTransactionsForPeriod(halfYearAgo, now)
  } catch (err) {
    console.error("Помилка при завантаженні транзакцій:", err)
    transactions = []
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Список транзакцій за останні 6 місяців</h1>

      {transactions.length > 0 ? (
        <ScrollArea className="max-h-[70vh] rounded-md border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {transactions.map((t: any, i: number) => {
              const date =
                t?.createdDate && !isNaN(t.createdDate)
                  ? new Date(Number(t.createdDate) * 1000).toLocaleString()
                  : "—"

              const statusClass = statusColors[t?.transactionStatus] || "bg-gray-300 text-black"

              return (
                <Card
                  key={i}
                  className="shadow-md border border-gray-200 hover:shadow-lg transition"
                >
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                      {t?.amount ?? "—"} {t?.currency ?? ""}
                    </CardTitle>
                    <Badge className={statusClass}>{t?.transactionStatus ?? "—"}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Дата:</span> {date}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {t?.email ?? "—"}
                    </p>
                    <p>
                      <span className="font-medium">Телефон:</span> {t?.phone ?? "—"}
                    </p>
                    <p>
                      <span className="font-medium">Метод:</span> {t?.paymentSystem ?? "—"}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </ScrollArea>
      ) : (
        <p className="text-gray-600">Транзакцій не знайдено за вказаний період.</p>
      )}
    </div>
  )
}

export default PaymentsList

// import { getTransactionList } from '@/actions/wayForPay'

// async function getTransactionsForPeriod(dateBegin: number, dateEnd: number) {
//   const results: any[] = []
//   const maxPeriod = 31 * 24 * 60 * 60 // 31 день в секундах

//   let start = dateBegin
//   while (start < dateEnd) {
//     const end = Math.min(start + maxPeriod, dateEnd)

//     try {
//       const part = await getTransactionList(start, end)
//       if (Array.isArray(part)) {
//         results.push(...part)
//       }
//     } catch (err) {
//       console.error(`Ошибка при загрузке транзакций за период ${start}-${end}`, err)
//     }

//     start = end
//   }

//   return results
// }

// const PaymentsList = async () => {
//   const now = Math.floor(Date.now() / 1000)
//   const halfYearAgo = now - 182 * 24 * 60 * 60 // полгода назад

//   let transactions: any[] = []
//   try {
//     transactions = await getTransactionsForPeriod(halfYearAgo, now)
//   } catch (err) {
//     console.error("Помилка при завантаженні транзакцій:", err)
//     transactions = [] // fallback, чтобы не было undefined
//   }

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">
//         Список транзакцій за останні 6 місяців
//       </h1>

//       {transactions.length > 0 ? (
//         <table className="min-w-full border text-sm">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="p-2 border">Дата</th>
//               <th className="p-2 border">Сума</th>
//               <th className="p-2 border">Статус</th>
//               <th className="p-2 border">Email</th>
//               <th className="p-2 border">Телефон</th>
//               <th className="p-2 border">Метод</th>
//             </tr>
//           </thead>
//           <tbody>
//             {transactions.map((t: any, i: number) => {
//               const date =
//                 t?.createdDate && !isNaN(t.createdDate)
//                   ? new Date(Number(t.createdDate) * 1000).toLocaleString()
//                   : "—"

//               return (
//                 <tr key={i} className="border-t">
//                   <td className="p-2 border">{date}</td>
//                   <td className="p-2 border">
//                     {t?.amount ?? "—"} {t?.currency ?? ""}
//                   </td>
//                   <td className="p-2 border">{t?.transactionStatus ?? "—"}</td>
//                   <td className="p-2 border">{t?.email ?? "—"}</td>
//                   <td className="p-2 border">{t?.phone ?? "—"}</td>
//                   <td className="p-2 border">{t?.paymentSystem ?? "—"}</td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       ) : (
//         <p>Транзакцій не знайдено за вказаний період.</p>
//       )}
//     </div>
//   )
// }

// export default PaymentsList
