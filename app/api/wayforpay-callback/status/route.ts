import crypto from "crypto"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { orderReference } = (await request.json()) as { orderReference: string }

  const merchantAccount = process.env.WFP_MERCHANT_ACCOUNT!
  const merchantSecret = process.env.WFP_MERCHANT_SECRET!

  // Підпис для CHECK_STATUS (merchantAccount;orderReference)&#8203;:contentReference[oaicite:11]{index=11}
  const signatureString = `${merchantAccount};${orderReference}`
  const merchantSignature = crypto
    .createHmac("md5", merchantSecret)
    .update(signatureString, "utf-8")
    .digest("hex")

  const body = {
    transactionType: "CHECK_STATUS",
    merchantAccount,
    orderReference,
    merchantSignature,
    apiVersion: 1
  }

  const response = await fetch("https://api.wayforpay.com/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
  const result = await response.json()

  return NextResponse.json(result)
}
