// "use server"

// import axios from 'axios'
// import crypto from 'crypto'

// const account = process.env.WAYFORPAY_MERCHANT_ACCOUNT!
// const secret = process.env.WAYFORPAY_SECRET_KEY!
// const apiUrl = process.env.WAYFORPAY_URL! // https://api.wayforpay.com/api

// if (!account || !secret || !apiUrl) {
//   throw new Error("WayForPay config variables are missing")
// }

// function createTransactionListSignature(
//   merchantAccount: string,
//   dateBegin: number,
//   dateEnd: number
// ): string {
//   const str = `${merchantAccount};${dateBegin};${dateEnd}`
//   return crypto.createHmac("md5", secret).update(str).digest("hex")
// }

// export async function getTransactionList(dateBegin: number, dateEnd: number) {
//   const merchantSignature = createTransactionListSignature(account, dateBegin, dateEnd)

//   const payload = {
//     transactionType: "TRANSACTION_LIST",
//     merchantAccount: account,
//     merchantSignature,
//     apiVersion: 1, // або 2, якщо хочеш додаткову інформацію у відповіді
//     dateBegin,
//     dateEnd
//   }

//   try {
//     const response = await axios.post(apiUrl, payload, {
//       headers: { "Content-Type": "application/json" }
//     })

//     const { reason, reasonCode, transactionList } = response.data

//     if (reasonCode !== 1100) {
//       throw new Error(`WayForPay error: ${reason}`)
//     }

//     return transactionList
//   } catch (err: any) {
//     console.error("WayForPay TRANSACTION_LIST error:", err?.response?.data || err.message)
//     throw new Error("Не вдалося отримати список транзакцій.")
//   }
// }
