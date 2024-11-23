import { PaymentMethod } from '@/types/paymentMethod'
import * as Yup from 'yup'
const phoneRegex = /^\+380\d{9}$/
const nameRegex = /^[а-яА-ЯіІїЇєЄґҐ']+$/

const orderFormSchema = Yup.object().shape({
	number: Yup.string().required(`Обов'язкове поле`),
	customer: Yup.object().shape({
		name: Yup.string()
			.min(2, 'Мінімум 2 символи')
			.max(20, 'Максимум 20 символів')
			.matches(nameRegex, {
				message: 'Тільки українські букви',
			})
			.required(`Обов'язкове поле`),
		surname: Yup.string()
			.min(2, 'Мінімум 2 символи')
			.max(20, 'Максимум 20 символів')
			.matches(nameRegex, {
				message: 'Тільки українські букви',
			})
			.required(`Обов'язкове поле`),
		email: Yup.string()
			.email('Некоректний e-mail')
			.required(`Обов'язкове поле`),
		phone: Yup.string()
			.matches(phoneRegex, {
				message: 'Має починатись на +380 та 9 цифр номеру',
			})
			.required(`Обов'язкове поле`),
		city: Yup.string().required(`Обов'язкове поле`),
		warehouse: Yup.string().required(`Обов'язкове поле`),
		payment: Yup.string()
			.oneOf(Object.values(PaymentMethod))
			.required(`Обов'язкове поле`),
	}),
	orderedGoods: Yup.array().of(
		Yup.object().shape({
			id: Yup.string().required(`Обов'язкове поле`),
			title: Yup.string().required(`Обов'язкове поле`),
			brand: Yup.string().required(`Обов'язкове поле`),
			model: Yup.string().required(`Обов'язкове поле`),
			vendor: Yup.string().required(`Обов'язкове поле`),
			quantity: Yup.number()
				.positive()
				.integer(),
			price: Yup.number()
				.positive()
				.required(`Обов'язкове поле`),
		}),
	),
	totalPrice: Yup.number().positive(),
	status: Yup.string().required(`Обов'язкове поле`),
})

export default orderFormSchema
