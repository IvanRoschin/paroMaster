import crypto from "crypto"
import { NextResponse } from "next/server"

// Дані корзини: name, quantity, price для кожного товару
type CartItem = { name: string; quantity: number; price: number }

export async function POST(request: Request) {
  const { items, orderReference } = (await request.json()) as {
    items: CartItem[]
    orderReference: string
  }

  const merchantAccount = process.env.WFP_MERCHANT_ACCOUNT!
  const merchantDomainName = process.env.WFP_MERCHANT_DOMAIN!
  const merchantSecret = process.env.WFP_MERCHANT_SECRET!

  const orderDate = Math.floor(Date.now() / 1000)
  // Загальна сума з точністю до копійок
  const amount = items.reduce((sum, it) => sum + it.price * it.quantity, 0).toFixed(2)

  const currency = "UAH"
  const productName = items.map(item => item.name)
  const productCount = items.map(item => item.quantity)
  const productPrice = items.map(item => item.price.toFixed(2))

  // Складаємо рядок для підпису; порядок полів – як у документації&#8203;:contentReference[oaicite:10]{index=10}
  const signatureString = [
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate,
    amount,
    currency,
    ...productName,
    ...productCount.map(String),
    ...productPrice
  ].join(";")

  const merchantSignature = crypto
    .createHmac("md5", merchantSecret)
    .update(signatureString, "utf-8")
    .digest("hex")

  // Повертаємо JSON з полями форми; клієнт може згенерувати форму на основі цих даних
  return NextResponse.json({
    merchantAccount,
    merchantDomainName,
    merchantSignature,
    orderReference,
    orderDate,
    amount,
    currency,
    productName,
    productCount,
    productPrice,
    returnUrl: "https://your.site.com/payment/result" // опційно
  })
}
