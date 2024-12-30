"use server"
import { IGood } from "@/types/index"
import {
  generateCustomerEmailContent,
  NewCustomerTemplateProps
} from "app/templates/email/NewCustomerTemplate"
import { FieldValues } from "react-hook-form"
import { Resend } from "resend"
import { generateLidEmailContent, NewLidTemplateProps } from "../templates/email/NewLidTemplate"
import { generateEmailContent, NewOrderTemplateProps } from "../templates/email/NewOrderTemplate"

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

const resend = new Resend(process.env.RESEND_API)

export async function sendEmail(data: IGetSendData) {
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
    throw new Error("Error not all data passed")
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

    const { data: responseData, error } = await resend.emails.send({
      from: `${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`,
      to: [`${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`],
      subject: `Нове замовлення на сайті від ${name} ${surname}, контактний email: ${email}`,
      text: phone,
      html: emailContent
    })

    if (error) {
      console.error("Error sending email:", error)
      return { success: false, error }
    }
    console.log("Email sent successfully:", responseData)
    return { success: true, data: responseData }
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
;``

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

    const { data: responseData, error } = await resend.emails.send({
      from: `Acme <onboarding@resend.dev>`,
      to: [`${email}`],
      subject: `Ваше замовлення на сайті ParoMaster`,
      html: emailContent
    })

    if (error) {
      console.error("Error sending email:", error)
      return { success: false, error }
    }
    console.log("Email sent successfully:", responseData)
    return { success: true, data: responseData }
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

    const { data: responseData, error } = await resend.emails.send({
      from: `Acme <onboarding@resend.dev>`,
      to: [`${process.env.NEXT_PUBLIC_}`],
      subject: `Заповнена форма зв'язку  на сайті від ${name}, контактний email: ${email}`,
      text: phone,
      html: emailContent
    })

    if (error) {
      console.error("Error sending email:", error)
      return { success: false, error }
    }
    console.log("Email sent successfully:", responseData)
    return { success: true, data: responseData }
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
