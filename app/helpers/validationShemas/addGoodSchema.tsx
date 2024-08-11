import * as Yup from 'yup'

export const goodFormSchema = Yup.object().shape({
	category: Yup.string()
		.oneOf(
			[
				'Корпус станції',
				'Корпус для прасок',
				'Підошви для прасок',
				'Плати керування',
				'Електроклапани',
				'Насоси(помпи)',
				'Резервуари для води',
				'Провода та шланги',
				'Аксесуари та комплектуючі',
			],
			'Немає такої категорії',
		)
		.required(`Обов'язкове поле`),
	title: Yup.string()
		.min(2, 'Мінімум 2 символи')
		.max(50, 'Максимум 50 символів')
		.required(`Обов'язкове поле`),
	description: Yup.string()
		.min(20, 'Мінімум 20 символів')
		.max(200, 'Максимум 200 символів')
		.required(`Обов'язкове поле`),
	imgUrl: Yup.array()
		.of(Yup.string().url('Некоректне посилання'))
		.required(`Обов'язкове поле`),
	brand: Yup.string()
		.min(2, 'Мінімум 2 символи')
		.max(20, 'Максимум 20 символів')
		.required(`Обов'язкове поле`),
	model: Yup.string()
		.min(2, 'Мінімум 2 символи')
		.max(20, 'Максимум 20 символів')
		.required(`Обов'язкове поле`),
	vendor: Yup.string()
		.min(2, 'Мінімум 2 символи')
		.max(20, 'Максимум 20 символів')
		.required(`Обов'язкове поле`),
	price: Yup.number()
		.min(0, 'Ціна товару повинан бути вище 0')
		.required(`Обов'язкове поле`)
		.nullable(),
	isAvailable: Yup.boolean().required(`Обов'язкове поле`),
	isCompatible: Yup.boolean().required(`Обов'язкове поле`),
	compatibility: Yup.string().nullable(),
})
