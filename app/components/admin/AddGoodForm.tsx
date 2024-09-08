'use client'

import { CustomButton, FormField, ImageUploadCloudinary, Switcher } from '@/components/index'
import { goodFormSchema } from '@/helpers/index'
import { IGood } from '@/types/good/IGood'
import { categoryList } from 'app/config/constants'
import { Form, Formik, FormikState } from 'formik'
import { toast } from 'sonner'

interface InitialStateType extends Omit<IGood, '_id'> {}

interface ResetFormProps {
	resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface GoodFormProps {
	good?: IGood
	title?: string
	action: (data: FormData) => Promise<void>
}

const GoodForm: React.FC<GoodFormProps> = ({ good, title, action }) => {
	const textareaStyles: React.CSSProperties = {
		height: '100px',
		overflowY: 'auto',
	}

	const inputs = [
		{
			id: 'category',
			label: 'Категорія',
			type: 'select',
			options: categoryList.map(category => ({ value: category.title, label: category.title })),
			required: true,
		},
		{
			id: 'title',
			label: 'Назва товару',
			type: 'text',
			required: true,
		},
		{
			id: 'brand',
			label: 'Бренд',
			type: 'text',
			required: true,
		},
		{
			id: 'model',
			label: 'Модель',
			type: 'text',
			required: true,
		},
		{
			id: 'vendor',
			label: 'Артикул',
			type: 'text',
			required: true,
		},
		{
			id: 'price',
			label: 'Ціна',
			type: 'number',
			required: true,
		},
		{
			id: 'isAvailable',
			label: 'В наявності?',
			type: 'switcher',
		},
		{
			id: 'isCompatible',
			label: 'Сумісний з іншими?',
			type: 'switcher',
		},
		{
			id: 'compatibility',
			label: 'З якими моделями?',
			type: 'text',
		},
		{
			id: 'description',
			label: 'Опис',
			type: 'textarea',
			required: true,
			style: textareaStyles,
		},
	]

	const initialValues: InitialStateType = {
		category: good?.category || categoryList[0].title,
		src: good?.src || [],
		brand: good?.brand || '',
		model: good?.model || '',
		vendor: good?.vendor || '',
		title: good?.title || '',
		description: good?.description || '',
		price: good?.price || 0,
		isAvailable: good?.isAvailable || false,
		isCompatible: good?.isCompatible || false,
		compatibility: good?.compatibility || '',
	}

	const handleSubmit = async (values: InitialStateType, { resetForm }: ResetFormProps) => {
		try {
			const formData = new FormData()

			Object.keys(values).forEach(key => {
				const value = (values as Record<string, any>)[key]

				if (Array.isArray(value)) {
					value.forEach((val: any) => formData.append(key, val))
				} else {
					formData.append(key, value)
				}
			})
			// Append the ID if available
			if (good?._id) {
				formData.append('id', good._id as string)
			}

			await action(formData)
			resetForm()
		} catch (error) {
			// Handle any errors
			toast.error('Помилка!')
			console.error(error)
		} finally {
			toast.success(good?._id ? 'Товар оновлено!' : 'Новий товар додано!')
		}
	}

	return (
		<div className='flex flex-col justify-center items-center'>
			<h2 className='text-4xl mb-4'>{title}</h2>
			<Formik
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validationSchema={goodFormSchema}
				enableReinitialize
			>
				{({ errors, setFieldValue, values }) => (
					<Form className='flex flex-col w-[600px]'>
						<ImageUploadCloudinary
							setFieldValue={setFieldValue}
							values={values.src}
							errors={errors}
						/>

						{inputs.map((item, i) => (
							<div key={i}>
								{item.type === 'switcher' ? (
									<Switcher
										id={item.id}
										label={item.label}
										checked={!!(values as Record<string, any>)[item.id]} // Ensure boolean
										onChange={checked => setFieldValue(item.id, checked)}
									/>
								) : (
									<FormField item={item} errors={errors} setFieldValue={setFieldValue} />
								)}
							</div>
						))}
						<CustomButton label={'Зберегти'} />
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default GoodForm
