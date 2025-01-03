"use server"

import { IGood } from "@/types/index"
import sendgrid from "@sendgrid/mail"
import { generateEmailContent, NewOrderTemplateProps } from "app/templates/email/NewOrderTemplate"

if (!process.env.NEXT_PUBLIC_SENDGRID_API_KEY || !process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
  throw new Error("SENDGRID_API_KEY or ADMIN_EMAIL is not defined in the environment variables")
}

sendgrid.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY)

interface IGetSendData {
  name: string
  surname?: string
  email: string
  phone: string
  city: string
  warehouse: string
  payment: string
  orderNumber: string
  orderedGoods: IGood[]
  totalPrice: number
}

export async function sendAdminEmail(data: IGetSendData) {
  console.log("this is sendgrid admin email")
  const {
    name,
    surname,
    email,
    phone,
    city,
    warehouse,
    payment,
    orderNumber,
    orderedGoods,
    totalPrice
  } = data

  // Validate input data
  if (
    !name ||
    !surname ||
    !email ||
    !phone ||
    !city ||
    !warehouse ||
    !payment ||
    !orderNumber ||
    !orderedGoods ||
    !totalPrice ||
    !Array.isArray(orderedGoods) ||
    orderedGoods.length === 0 ||
    totalPrice <= 0
  ) {
    return { success: false, error: "Validation Error: Missing or invalid data." }
  }

  try {
    const emailContent = generateEmailContent({
      email,
      name,
      surname,
      phone,
      city,
      warehouse,
      payment,
      orderedGoods,
      orderNumber,
      totalPrice
    } as NewOrderTemplateProps)

    const fromEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL

    console.log("Using fromEmail:", fromEmail)

    if (!fromEmail) return

    // Send email
    await sendgrid.send({
      from: fromEmail,
      to: "ivan.roschin86@gmail.com", // Admin email receiving the order
      subject: `Нове замовлення на сайті від ${name} ${surname}, контактний email: ${email}`,
      text: `Замовлення від: ${name} ${surname}, Телефон: ${phone}`,
      html: emailContent
    })

    console.log("Admin email successfully sent.")
    return { success: true }
  } catch (error: any) {
    const errorMessage = error.response?.body?.errors || error.message || "Unknown error occurred."
    console.error("Error sending email:", errorMessage)
    return { success: false, error: errorMessage }
  }
}
