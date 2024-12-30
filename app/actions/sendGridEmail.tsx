"use server"

import { IGood } from "@/types/index"
import sendgrid from "@sendgrid/mail"
import { generateEmailContent, NewOrderTemplateProps } from "app/templates/email/NewOrderTemplate"

if (!process.env.NEXT_PUBLIC_SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY is not defined in the environment variables")
}
const key = process.env.NEXT_PUBLIC_SENDGRID_API_KEY

sendgrid.setApiKey(key)

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
    throw new Error("Error: Not all data passed.")
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

    // Ensure the "from" email is valid
    const fromEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
    if (!fromEmail || !fromEmail.includes("@")) {
      throw new Error("Invalid 'from' email address configured in environment variables.")
    }
    console.log("fromEmail", fromEmail)

    // Send email
    await sendgrid.send({
      from: `${fromEmail}`,
      to: fromEmail,
      subject: `Нове замовлення на сайті від ${name} ${surname}, контактний email: ${fromEmail}`,
      text: `Замовлення від: ${name} ${surname}, Телефон: ${phone}`,
      html: emailContent
    })
    console.log("AdminEmail successfyly sended")
    return { success: true }
  } catch (error: any) {
    if (error.response) {
      console.error("SendGrid response error:", error.response.body.errors)
    } else {
      console.error("Error sending email:", error)
    }
    return { success: false, error: error.message || "Error sending email" }
  }
}
