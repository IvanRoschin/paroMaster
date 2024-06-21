import * as Yup from 'yup'

const nameRegex = /^[а-яА-ЯіІїЇєЄґҐ']+ [а-яА-ЯіІїЇєЄґҐ']+$/u
const emailRegex = /^(?=.{1,63}$)(?=.{2,}@)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const phoneRegex = /^\+380\d{9}$/

export const orderFormSchema = Yup.object().shape({
	name: Yup.string()
		.max(20)
		.min(3)
		.matches(nameRegex, {
			message: 'Тільки українські букви від 3 до 20 символів',
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
	phone: Yup.string()
		.matches(phoneRegex, {
			message: 'Має починатись на +380 та 9 цифр номеру',
		})
		.required(`Обов'язкове поле`),
	city: Yup.string()
		.matches(/^[\u0400-\u04FF\s]+$/, 'Підтримується пошук тільки українською мовою...')
		.required('Поле "Назва" є обов\'язковим'),
	warehouse: Yup.string().required('Поле "Відділення" є обов\'язковим'),
})
