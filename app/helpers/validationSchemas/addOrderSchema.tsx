import { PaymentMethod } from '@/types/paymentMethod'
import * as Yup from 'yup'

const orderFormSchema = Yup.object().shape({
	number: Yup.string().required(`Обов'язкове поле`),
	customer: Yup.object().shape({
		name: Yup.string().required(`Обов'язкове поле`),
		email: Yup.string()
			.email('Некоректний e-mail')
			.required(`Обов'язкове поле`),
		phone: Yup.string().required(`Обов'язкове поле`),
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
				.integer()
				.required(`Обов'язкове поле`),
			price: Yup.number()
				.positive()
				.required(`Обов'язкове поле`),
		}),
	),
	totalPrice: Yup.number()
		.positive()
		.required(`Обов'язкове поле`),
	status: Yup.string().required(`Обов'язкове поле`),
})

export default orderFormSchema
