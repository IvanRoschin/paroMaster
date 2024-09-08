import * as Yup from 'yup'

const nameRegex = /^(?:[а-яА-Я]+(?:\s[а-яА-Я]+)?|[а-яА-Я]+)$/

const testimonialFormSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, 'Мінімум 2 символи')
		.max(10, 'Максимум 10 символів')
		.matches(nameRegex, {
			message: 'Тільки кирилиця',
		})
		.required(`Обов'язкове поле`),
	text: Yup.string()
		.min(20, 'Мінімум 20 символів')
		.max(200, 'Максимум 200 символів')
		.required(`Обов'язкове поле`),
	rating: Yup.number()
		.min(0, 'Ціна товару повинна бути вище 0')
		.required(`Обов'язкове поле`)
		.nullable(),
	isActive: Yup.boolean().required(`Обов'язкове поле`),
})

export default testimonialFormSchema
