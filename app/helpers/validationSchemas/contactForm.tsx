import * as Yup from 'yup'

const nameRegex = /^[а-яА-ЯіІїЇєЄґҐ']+$/
const emailRegex = /^(?=.{1,63}$)(?=.{2,}@)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const phoneRegex = /^\+380\d{9}$/

const contactFormSchema = Yup.object().shape({
	name: Yup.string()
		.min(3, 'Мінімум 3 символи')
		.max(20, 'Максимум 20 символів')
		.matches(nameRegex, {
			message: 'Тільки українські букви',
		})
		.required(`Обов'язкове поле`),
	phone: Yup.string()
		.matches(phoneRegex, {
			message: 'Має починатись на +380 та 9 цифр номеру',
		})
		.required(`Обов'язкове поле`),
	email: Yup.string()
		.max(63, 'Максимум 63 символи')
		.min(3, 'Мінімум 3 символи')
		.email()
		.matches(emailRegex, {
			message: 'Має включати @, від 3 до 63 символів',
		})
		.required(`Обов'язкове поле`),
})

export default contactFormSchema
