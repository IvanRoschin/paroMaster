'use server'

import { FieldValues } from 'react-hook-form'
import { Resend } from 'resend'
import { generateEmailContent } from '../templates/email/NewOrderTemplate'

const resend = new Resend(process.env.RESEND_API)

export async function sendEmail(data: FieldValues) {
	const { email, name, phone, address, payment, cartItems, totalAmount, quantity } = data

	const parsedCartItems = cartItems.map((item: string) => JSON.parse(item))

	try {
		const emailContent = generateEmailContent({
			email,
			name,
			phone,
			address,
			payment,
			cartItems: parsedCartItems,
			totalAmount,
			quantity,
		})

		const { data, error } = await resend.emails.send({
			from: 'onboarding@resend.dev',
			to: ['ivan.roschin86@gmail.com'],
			subject: `Нове замовлення на сайті від ${name}, контактний email: ${email}`,
			text: phone,
			html: emailContent,
		})
		console.log(error)
		return { success: true, data }
	} catch (error) {
		return { success: false, error }
	}
}
