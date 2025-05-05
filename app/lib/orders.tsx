// lib/orders.ts
import crypto from "crypto"

export function generateSignature(order: any): string {
  const merchantAccount = process.env.NEXT_PUBLIC_WAYFORPAY_MERCHANT_ACCOUNT
  const merchantDomain = process.env.NEXT_PUBLIC_WAYFORPAY_MERCHANT_DOMAIN
  const secretKey = process.env.WAYFORPAY_SECRET_KEY

  const orderDate = Math.floor(new Date(order.createdAt).getTime() / 1000)

  const productNames = order.items.map((item: any) => item.title).join(";")
  const productCounts = order.items.map((item: any) => item.quantity).join(";")
  const productPrices = order.items.map((item: any) => item.price.toFixed(2)).join(";")

  const fieldsToSign = [
    merchantAccount,
    merchantDomain,
    order.orderReference,
    orderDate.toString(),
    order.amount.toFixed(2),
    "UAH",
    productNames,
    productCounts,
    productPrices
  ]

  const signatureString = fieldsToSign.join(";")

  return crypto
    .createHmac("md5", secretKey as string)
    .update(signatureString)
    .digest("hex")
}
