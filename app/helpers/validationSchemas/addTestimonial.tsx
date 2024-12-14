import * as Yup from 'yup'

const nameRegex = /^[А-Яа-яЇїІіЄєҐґ']+(?:\s[А-Яа-яЇїІіЄєҐґ']+)?$/

const testimonialFormSchema = Yup.object().shape({
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
