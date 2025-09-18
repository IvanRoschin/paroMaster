import { getTransactionList } from "@/actions/wayForPay"

type Props = {}

const PaymentsList = async (props: Props) => {
  const now = Date.now()
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000 // тиждень тому

  const transactions = await getTransactionList(
    Math.floor(oneWeekAgo / 1000),
    Math.floor(now / 1000)
  )

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
