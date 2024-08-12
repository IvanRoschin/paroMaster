import * as Yup from 'yup'

const nameRegex = /^[а-яА-ЯіІїЇєЄґҐ']+$/
const emailRegex = /^(?=.{1,63}$)(?=.{2,}@)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const phoneRegex = /^\+380\d{9}$/
const passwordRegexp = /^\S+$/

export const userFormSchema = Yup.object().shape({
	name: Yup.string()
		.max(20)
		.min(3)
		.matches(nameRegex, {
			message: 'Тільки українські букви від 3 до 20 символів',
		})
		.required(`Обов'язкове поле`),
	phone: Yup.string()
		.matches(phoneRegex, {
			message: 'Має починатись на +380 та 9 цифр номеру',
		})
		.required(`Обов'язкове поле`),
	email: Yup.string()
		.max(63)
		.min(3)
		.email()
		.matches(emailRegex, {
			message: 'Має включати @, від 3 до 63 символів',
		})
		.required(`Обов'язкове поле`),
	password: Yup.string().matches(passwordRegexp, {
		message: 'Password can`t contain white spaces',
	}),

	isAdmin: Yup.boolean(),
	isActive: Yup.boolean(),
})
