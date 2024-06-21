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
		.required('Треба заповнити'),
	title: Yup.string()
		.min(2, 'Мало символів')
		.max(50, 'Багато символів')
		.required('Треба заповнити'),
	description: Yup.string()
		.min(20, 'Мало символів')
		.max(200, 'Багато символів')
		.required('Треба заповнити'),
	imgUrl: Yup.string().required('Треба заповнити'),
	brand: Yup.string()
		.min(2, 'Мало символів')
		.max(20, 'Багато символів')
		.required('Треба заповнити'),
	model: Yup.string()
		.min(2, 'Мало символів')
		.max(20, 'Багато символів')
		.required('Треба заповнити'),
	vendor: Yup.string()
		.min(2, 'Мало символів')
		.max(20, 'Багато символів')
		.required('Треба заповнити'),
	price: Yup.number()
		.min(0, 'Ціна товару повинан бути вище 0')
		.required('Required'),
	isAvailable: Yup.boolean().required('Треба заповнити'),
	isCompatible: Yup.boolean().required('Треба заповнити'),
	compatibility: Yup.array()
		.of(Yup.string())
		.nullable(),
})
