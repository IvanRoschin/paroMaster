'use server'

import { FieldValues } from 'react-hook-form'
import { Resend } from 'resend'
import { generateEmailContent } from '../templates/email/NewOrderTemplate'

const resend = new Resend(process.env.RESEND_API)

export async function sendEmail(data: FieldValues, orderNumber: string) {
	const { email, name, phone, city, warehouse, payment, cartItems, totalAmount, quantity } = data

	if (
		!email ||
		!name ||
		!phone ||
		!city ||
		!warehouse ||
		!payment ||
		!cartItems ||
		!totalAmount ||
		!quantity ||
		!orderNumber
	) {
		throw new Error('Error not all data passed')
	}

	try {
		const emailContent = generateEmailContent({
			email,
			name,
			phone,
			city,
			warehouse,
			payment,
			cartItems,
			totalAmount,
			quantity,
			orderNumber,
		})

		const { data: responseData, error } = await resend.emails.send({
			from: 'onboarding@resend.dev',
			to: ['ivan.roschin86@gmail.com'],
			subject: `Нове замовлення на сайті від ${name}, контактний email: ${email}`,
			text: phone,
			html: emailContent,
		})

		if (error) {
			console.error('Error sending email:', error)
			return { success: false, error }
		}
		console.log('Email sent successfully:', responseData)
		return { success: true, data: responseData }
	} catch (error) {
		console.error('Error in sendEmail function:', error)
		return { success: false, error }
	}
}
