// app/api/wfp-callback/route.ts

import crypto from "crypto"
import { NextRequest, NextResponse } from "next/server"

import Order from "@/models/Order"
import { connectToDB } from "@/utils/dbConnect"

const SECRET_KEY = process.env.NEXT_PUBLIC_WAYFORPAY_SECRET_KEY!

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      orderReference,
      amount,
      currency,
      authCode,
      cardPan,
      transactionStatus,
      reason,
      reasonCode,
      orderDate,
      merchantSignature
    } = body

    // ✅ 1. Перевірка підпису
    const signatureFields = [
      orderReference,
      amount,
      currency,
      authCode,
      cardPan,
      transactionStatus,
      reason,
      reasonCode
    ]
    const generatedSignature = crypto
      .createHash("sha1")
      .update(signatureFields.join(";") + ";" + SECRET_KEY)
      .digest("hex")

    if (generatedSignature !== merchantSignature) {
      return NextResponse.json({ status: "refused", reason: "Invalid signature" }, { status: 403 })
    }

    // ✅ 2. Оновлення статусу замовлення
    await connectToDB()
    const order = await Order.findOne({ orderReference })

    if (!order) {
      return NextResponse.json({ status: "refused", reason: "Order not found" }, { status: 404 })
    }

    if (transactionStatus === "Approved") {
      order.status = "Оплачено"
      await order.save()
    }

    // ✅ 3. Повернення відповіді у форматі WayForPay
    const responseSignatureFields = [orderReference, "accept", orderDate]
    const responseSignature = crypto
      .createHash("sha1")
      .update(responseSignatureFields.join(";") + ";" + SECRET_KEY)
      .digest("hex")

    return NextResponse.json({
      orderReference,
      status: "accept",
      time: orderDate,
      signature: responseSignature
    })
  } catch (error) {
    console.error("WayForPay callback error:", error)
    return NextResponse.json({ status: "error", message: "Internal Server Error" }, { status: 500 })
  }
}
