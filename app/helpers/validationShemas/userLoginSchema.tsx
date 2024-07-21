import * as Yup from 'yup'

const emailRegex = /^(?=.{1,63}$)(?=.{2,}@)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const passwordRegexp = /^\S+$/

export const userLoginSchema = Yup.object().shape({
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
})
