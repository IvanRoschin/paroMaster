// import * as Yup from 'yup'

// const nameRegex = /^[а-яА-ЯіІїЇєЄґҐ']+$/

// const surnameRegex = /^[а-яА-ЯіІїЇєЄґҐ']+$/

// const emailRegex = /^(?=.{1,63}$)(?=.{2,}@)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
// const phoneRegex = /^\+380\d{9}$/

// const orderFormSchema = Yup.object().shape({
// 	name: Yup.string()
// 		.max(20, 'Максимум 20 символів')
// 		.min(3, 'Мінімум 3 символи')
// 		.matches(nameRegex, {
// 			message: 'Тільки українські букви від 3 до 20 символів',
// 		})
// 		.required(`Обов'язкове поле`),
// 	surname: Yup.string()
// 		.max(20, 'Максимум 20 символів')
// 		.min(3, 'Мінімум 3 символи')
// 		.matches(surnameRegex, {
// 			message: 'Тільки українські букви від 3 до 20 символів',
// 		})
// 		.required(`Обов'язкове поле`),
// 	email: Yup.string()
// 		.max(63, 'Максимуму 63 символи')
// 		.min(3, 'Мінімум 3 символи')
// 		.email()
// 		.matches(emailRegex, {
// 			message: 'Має включати @, від 3 до 63 символів',
// 		})
// 		.required(`Обов'язкове поле`),
// 	phone: Yup.string()
// 		.matches(phoneRegex, {
// 			message: 'Має починатись на +380 та 9 цифр номеру',
// 		})
// 		.required(`Обов'язкове поле`),
// 	city: Yup.string()
// 		.matches(/^[\u0400-\u04FF\s]+$/, 'Підтримується пошук тільки українською мовою...')
// 		.required('Поле "Назва" є обов\'язковим'),
// 	warehouse: Yup.string().required('Поле "Відділення" є обов\'язковим'),
// })

// export default orderFormSchema
