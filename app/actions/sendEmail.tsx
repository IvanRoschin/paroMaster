'use server'
import {
	generateCustomerEmailContent,
	NewCustomerTemplateProps,
} from 'app/templates/email/NewCustomerTemplate'
import { FieldValues } from 'react-hook-form'
import { Resend } from 'resend'
import { generateLidEmailContent, NewLidTemplateProps } from '../templates/email/NewLidTemplate'
import { generateEmailContent, NewOrderTemplateProps } from '../templates/email/NewOrderTemplate'

console.log('process.env.RESEND_API', process.env.RESEND_API)
const resend = new Resend(process.env.RESEND_API)

export async function sendEmail(data: FieldValues, orderNumber: string) {
	console.log('data', data)

	const {
		email,
		name,
		surname,
		phone,
		city,
		warehouse,
		payment,
		cartItems,
		totalAmount,
		quantity,
	} = data

	if (
		!email ||
		!name ||
		!surname ||
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
			surname,
			phone,
			city,
			warehouse,
			payment,
			cartItems,
			totalAmount,
			quantity,
			orderNumber,
		} as NewOrderTemplateProps)

		const { data: responseData, error } = await resend.emails.send({
			from: 'onboarding@resend.dev',
			to: [`${process.env.ADMIN_EMAIL}`],
			subject: `Нове замовлення на сайті від ${name} ${surname}, контактний email: ${email}`,
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
		if (error instanceof Error) {
			console.error('Error in sendEmail function:', error)
			throw new Error('Error in sendEmail function: ' + error.message)
		} else {
			console.error('Unknown error:', error)
			throw new Error('Error in sendEmail function: Unknown error')
		}
	}
}

export async function sendCustomerEmail(data: FieldValues, orderNumber: string) {
	const {
		email,
		name,
		surname,
		phone,
		city,
		warehouse,
		payment,
		cartItems,
		totalAmount,
		quantity,
	} = data

	if (
		!email ||
		!name ||
		!surname ||
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
		const emailContent = generateCustomerEmailContent({
			email,
			name,
			surname,
			phone,
			city,
			warehouse,
			payment,
			cartItems,
			totalAmount,
			quantity,
			orderNumber,
		} as NewCustomerTemplateProps)

		const { data: responseData, error } = await resend.emails.send({
			from: 'onboarding@resend.dev',
			to: [`${email}`],
			subject: `Ваше замовлення на сайті ParoMaster`,
			html: emailContent,
		})

		if (error) {
			console.error('Error sending email:', error)
			return { success: false, error }
		}
		console.log('Email sent successfully:', responseData)
		return { success: true, data: responseData }
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error in sendEmail function:', error)
			throw new Error('Error in sendEmail function: ' + error.message)
		} else {
			console.error('Unknown error:', error)
			throw new Error('Error in sendEmail function: Unknown error')
		}
	}
}

export async function sendEmailToLid(data: FieldValues) {
	console.log('data', data)

	const { email, name, phone } = data

	if (!email || !name || !phone) {
		throw new Error('Error not all data passed')
	}
	try {
		const emailContent = generateLidEmailContent({
			email,
			name,
			phone,
		} as NewLidTemplateProps)

		const { data: responseData, error } = await resend.emails.send({
			from: 'onboarding@resend.dev',
			to: [`${process.env.ADMIN_EMAIL}`],
			subject: `Заповнена форма зв'язку  на сайті від ${name}, контактний email: ${email}`,
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
		if (error instanceof Error) {
			console.error('Error in sendEmail function:', error)
			throw new Error('Error in sendEmail function: ' + error.message)
		} else {
			console.error('Unknown error:', error)
			throw new Error('Error in sendEmail function: Unknown error')
		}
	}
}
