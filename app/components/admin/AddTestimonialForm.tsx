'use client'

import { ITestimonial } from '@/types/index'
import { Form, Formik, FormikState } from 'formik'
import { useSession } from 'next-auth/react'
import { FaStar } from 'react-icons/fa'
import Rating from 'react-rating'
import { toast } from 'sonner'
import { testimonialFormSchema } from '../../helpers/validationShemas'
import FormField from '../input/FormField'
import Switcher from '../Switcher'
import CustomButton from './CustomFormikButton'
interface InitialStateType extends Omit<ITestimonial, '_id'> {}

interface ResetFormProps {
	resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface TestimoniaFormProps {
	testimonial?: Partial<ITestimonial>
	title?: string
	action: (data: FormData) => Promise<void>
}

const TestimonialForm: React.FC<TestimoniaFormProps> = ({ testimonial, title, action }) => {
	const textareaStyles: React.CSSProperties = {
		height: '100px',
		overflowY: 'auto',
	}
	const { data: session, status } = useSession()

	const isAdmin = !!session?.user

	const inputs = [
		{
			id: 'name',
			label: 'Ваше Ім`я',
			type: 'text',
			required: true,
		},
		{
			id: 'text',
			label: 'Відгук',
			type: 'textarea',
			required: true,
			style: textareaStyles,
		},
	]

	if (isAdmin) {
		inputs.push(
			{
				id: 'isActive',
				label: 'Публікується?',
				type: 'switcher',
			},
			// {
			// id: 'isActive',
			// label: 'Публікується?',
			// type: 'select',
			// options: [
			// 	{
			// 		value: 'true',
			// 		label: 'Так',
			// 	},
			// 	{
			// 		value: 'false',
			// 		label: 'Ні',
			// 	},
			// ],
			// }
		)
	}

	const initialValues: InitialStateType = {
		name: testimonial?.name || '',
		text: testimonial?.text || '',
		rating: testimonial?.rating || 0,
		createdAt: testimonial?.createdAt || '',
		isActive: testimonial?.isActive || false,
	}

	const handleSubmit = async (values: InitialStateType, { resetForm }: ResetFormProps) => {
		try {
			console.log('values', values)

			const formData = new FormData()
			Object.keys(values).forEach(key => {
				formData.append(key, (values as any)[key])
			})
			// Append the ID if available
			if (testimonial?._id) {
				formData.append('id', testimonial._id as string)
			}

			await action(formData)
			resetForm()
			toast.success(testimonial?._id ? 'Відгук оновлено!' : 'Новий відгук додано!')
		} catch (error) {
			toast.error('Помилка!')
			console.log(error)
		}
	}

	return (
		<div className='flex flex-col justify-center items-center'>
			<h2 className='text-4xl mb-4'>{title}</h2>
			<Formik
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validationSchema={testimonialFormSchema}
				enableReinitialize
			>
				{({ errors, setFieldValue, values }) => (
					<Form className='flex flex-col w-[600px]'>
						<div>
							{inputs.map((item, i) => (
								<div key={i}>
									{item.type === 'switcher' ? (
										<Switcher
											id={item.id}
											label={item.label}
											checked={values[item.id]}
											onChange={checked => setFieldValue(item.id, checked)}
										/>
									) : (
										<FormField item={item} errors={errors} setFieldValue={setFieldValue} />
									)}
								</div>
							))}
							<div className='mb-4'>
								<label className='block mb-2'>Ваша оцінка</label>
								<Rating
									emptySymbol={<FaStar size={24} color='#ccc' />}
									fullSymbol={<FaStar size={24} color='#ffd700' />}
									initialRating={values.rating}
									onChange={value => setFieldValue('rating', value)}
								/>
							</div>
						</div>
						<CustomButton label={'Зберегти'} />
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default TestimonialForm
