'use client';

import { useEffect, useState } from 'react';

interface Transaction {
  createdDate: number;
  amount: number;
  currency: string;
  transactionStatus: string;
  email: string;
  phone: string;
  paymentSystem: string;
}

const statusColors: Record<string, string> = {
  Approved: 'bg-green-500 text-white',
  Pending: 'bg-yellow-500 text-black',
  Declined: 'bg-red-500 text-white',
};

const PaymentsList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch('/api/transactions');
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || 'Ошибка при загрузке транзакций');
        setTransactions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  if (loading) return <p className="p-6">Загрузка транзакций...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Список транзакций за последние 6 месяцев
      </h1>

      {transactions.length > 0 ? (
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Дата</th>
                <th className="p-2 border">Сумма</th>
                <th className="p-2 border">Статус</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Телефон</th>
                <th className="p-2 border">Метод</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => {
                const date = new Date(t.createdDate * 1000).toLocaleString();
                const statusClass =
                  statusColors[t.transactionStatus] || 'bg-gray-300 text-black';

                return (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-2 border">{date}</td>
                    <td className="p-2 border">
                      {t.amount} {t.currency}
                    </td>
                    <td className={`p-2 border text-center ${statusClass}`}>
                      {t.transactionStatus}
                    </td>
                    <td className="p-2 border">{t.email}</td>
                    <td className="p-2 border">{t.phone}</td>
                    <td className="p-2 border">{t.paymentSystem}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">
          Транзакций не найдено за указанный период.
        </p>
      )}
    </div>
  );
};

export default PaymentsList;
