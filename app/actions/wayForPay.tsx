// actions/wayForPay.ts
"use server"

import axios from "axios"
import crypto from "crypto"

const apiUrl = "https://api.wayforpay.com/api"

function createTransactionListSignature(
  merchantAccount: string,
  dateBegin: number,
  dateEnd: number,
  secret: string
): string {
  const str = `${merchantAccount};${dateBegin};${dateEnd}`
  return crypto.createHmac("md5", secret).update(str).digest("hex")
}

export async function getTransactionList(dateBegin: number, dateEnd: number) {
  const account = process.env.WAYFORPAY_MERCHANT_ACCOUNT
  const secret = process.env.WAYFORPAY_SECRET_KEY

  if (!account || !secret) {
    console.error("WayForPay config variables are missing")
    throw new Error("WayForPay config variables are missing")
  }

  const merchantSignature = createTransactionListSignature(account, dateBegin, dateEnd, secret)

  const payload = {
    transactionType: "TRANSACTION_LIST",
    merchantAccount: account,
    merchantSignature,
    apiVersion: 1,
    dateBegin,
    dateEnd
  }

  try {
    const response = await axios.post(apiUrl, payload, {
      headers: { "Content-Type": "application/json" }
    })

    const { reason, reasonCode, transactionList } = response.data

    if (reasonCode !== 1100) {
      throw new Error(`WayForPay error: ${reason}`)
    }

    return transactionList
  } catch (err: any) {
    console.error("WayForPay TRANSACTION_LIST error:", err?.response?.data || err.message)
    throw new Error("Не вдалося отримати список транзакцій.")
  }
}
