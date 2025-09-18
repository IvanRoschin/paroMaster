import { getTransactionList } from "@/actions/wayForPay"

type Props = {}

async function getTransactionsForPeriod(dateBegin: number, dateEnd: number) {
  const results: any[] = []
  const maxPeriod = 31 * 24 * 60 * 60 // 31 день в секундах

  let start = dateBegin
  while (start < dateEnd) {
    const end = Math.min(start + maxPeriod, dateEnd)

    console.log(`Запрашиваю WayForPay с ${start} по ${end}`)

    try {
      const part = await getTransactionList(start, end)
      results.push(...part)
    } catch (err) {
      console.error(`Ошибка при загрузке транзакций за период ${start}-${end}`, err)
    }

    start = end // сдвигаем начало на конец предыдущего периода
  }

  return results
}

const PaymentsList = async (props: Props) => {
  const now = Math.floor(Date.now() / 1000)
  const halfYearAgo = now - 182 * 24 * 60 * 60 // полгода назад

  let transactions: any[] = []
  try {
    transactions = await getTransactionsForPeriod(halfYearAgo, now)
  } catch (err) {
    console.error("Помилка при завантаженні транзакцій:", err)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Список транзакцій за тиждень</h1>

      {transactions?.length ? (
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Дата</th>
              <th className="p-2 border">Сума</th>
              <th className="p-2 border">Статус</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Телефон</th>
              <th className="p-2 border">Метод</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t: any, i: number) => (
              <tr key={i} className="border-t">
                <td className="p-2 border">{new Date(t.createdDate * 1000).toLocaleString()}</td>
                <td className="p-2 border">
                  {t.amount} {t.currency}
                </td>
                <td className="p-2 border">{t.transactionStatus}</td>
                <td className="p-2 border">{t.email}</td>
                <td className="p-2 border">{t.phone}</td>
                <td className="p-2 border">{t.paymentSystem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Транзакцій не знайдено за вказаний період.</p>
      )}
    </div>
  )
}

export default PaymentsList
