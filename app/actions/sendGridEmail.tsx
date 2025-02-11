"use server"

import { CartItem } from "@/types/cart/ICartItem"
import { IGood } from "@/types/index"
import sendgrid from "@sendgrid/mail"
import {
  generateCustomerEmailContent,
  NewCustomerTemplateProps
} from "app/templates/email/NewCustomerTemplate"
import { generateLidEmailContent, NewLidTemplateProps } from "app/templates/email/NewLidTemplate"
import { generateEmailContent, NewOrderTemplateProps } from "app/templates/email/NewOrderTemplate"
import { FieldValues } from "react-hook-form"

if (!process.env.NEXT_PUBLIC_SENDGRID_API_KEY || !process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
  throw new Error("SENDGRID_API_KEY or ADMIN_EMAIL is not defined in the environment variables")
}

sendgrid.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY)
const fromEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL

interface IGetSendData {
  name: string
  surname?: string
  email: string
  phone: string
  city: string
  warehouse: string
  payment: string
  orderNumber: string
  orderedGoods: CartItem[]
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

    if (!fromEmail) return

    // Send email
    await sendgrid.send({
      from: fromEmail,
      to: fromEmail,
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

export async function sendCustomerEmail(data: IGetSendData) {
  const {
    email,
    name,
    surname,
    phone,
    city,
    warehouse,
    payment,
    orderNumber,
    orderedGoods,
    totalPrice
  } = data

  if (
    !email ||
    !name ||
    !surname ||
    !phone ||
    !city ||
    !warehouse ||
    !payment ||
    !orderedGoods ||
    !orderNumber ||
    !totalPrice
  ) {
    throw new Error("Error not all data passed")
  }

  try {
    const emailContent = generateCustomerEmailContent({
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
    } as NewCustomerTemplateProps)

    if (!fromEmail || !email) return

    await sendgrid.send({
      from: fromEmail,
      to: [`${email}`],
      subject: `Ваше замовлення на сайті ParoMaster`,
      html: emailContent
    })

    // const { data: responseData, error } = await resend.emails.send({
    //   from: `Acme <onboarding@resend.dev>`,
    //   to: [`${email}`],
    //   subject: `Ваше замовлення на сайті ParoMaster`,
    //   html: emailContent
    // })

    console.log("Customer Email sent successfully")
    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in sendEmail function:", error)
      throw new Error("Error in sendEmail function: " + error.message)
    } else {
      console.error("Unknown error:", error)
      throw new Error("Error in sendEmail function: Unknown error")
    }
  }
}

export async function sendEmailToLid(data: FieldValues) {
  const { email, name, phone } = data

  if (!email || !name || !phone) {
    throw new Error("Error not all data passed")
  }
  try {
    const emailContent = generateLidEmailContent({
      email,
      name,
      phone
    } as NewLidTemplateProps)

    if (!phone || !email) return

    await sendgrid.send({
      from: fromEmail,
      to: fromEmail,
      subject: `Заповнена форма зв'язку  на сайті від ${name}, контактний email: ${email}`,
      html: emailContent
    })

    console.log("Email sent successfully")
    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in sendEmail function:", error)
      throw new Error("Error in sendEmail function: " + error.message)
    } else {
      console.error("Unknown error:", error)
      throw new Error("Error in sendEmail function: Unknown error")
    }
  }
}
