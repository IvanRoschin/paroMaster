'use client'

import { testimonialFormSchema } from '@/helpers/index'
import { useAddData } from '@/hooks/useAddData'
import { useUpdateData } from '@/hooks/useUpdateData'
import { ITestimonial } from '@/types/index'
import { Form, Formik, FormikState } from 'formik'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { toast } from 'sonner'
import FormField from '../input/FormField'
import Switcher from '../Switcher'
import CustomButton from './CustomFormikButton'

interface InitialStateType extends Omit<ITestimonial, '_id'> {}

interface ResetFormProps {
	resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface TestimonialFormProps {
	testimonial?: Partial<ITestimonial>
	title?: string
	action: (values: ITestimonial) => Promise<{ success: boolean; message: string }>
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ testimonial, title, action }) => {
	const Rating: any = require('react-rating')
	const [isLoading, setIsLoading] = useState(false)
	const { push } = useRouter()
	const { data: session } = useSession()
	const addTestimonialMutation = useAddData(action, 'testimonials')
	const updateTestimonialMutation = useUpdateData(action, 'testimonials')

	const isUpdating = Boolean(testimonial?._id)

	const textareaStyles: React.CSSProperties = {
		height: '100px',
		overflowY: 'auto',
	}

	const isAdmin = !!session?.user

	const inputs = [
		{
			id: 'name',
			label: 'Ваше Ім`я',
			type: 'text',
			required: true, // Ensure all fields have required
		},
		{
			id: 'text',
			label: 'Відгук',
			type: 'textarea',
			required: true, // Ensure textarea has required
			style: textareaStyles,
		},
	]

	if (isAdmin) {
		inputs.push({
			id: 'isActive',
			label: 'Публікується?',
			type: 'switcher',
			required: true, // Include required
		})
	}

	const initialValues: InitialStateType = {
		name: testimonial?.name || '',
		text: testimonial?.text || '',
		rating: testimonial?.rating || 0,
		createdAt: testimonial?.createdAt || '',
		isActive: testimonial?.isActive || false,
	}

	const handleSubmit = async (values: ITestimonial, { resetForm }: ResetFormProps) => {
		setIsLoading(true)

		try {
			let updateTestimonialData = {}

			if (isUpdating && testimonial) {
				updateTestimonialData = {
					...values,
					_id: testimonial._id,
				}
			}
			const result = isUpdating
				? await updateTestimonialMutation.mutateAsync(updateTestimonialData)
				: await addTestimonialMutation.mutateAsync(values)

			if (result?.success === false) {
				toast.error('Something went wrong')
				return
			}
			resetForm()
			toast.success(isUpdating ? 'Відгук оновлено!' : 'Новий відгук додано!')
			push('/admin/orders')
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred'
			toast.error(errorMsg)
			console.error(error)
		} finally {
			setIsLoading(false)
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
											checked={values[item.id as keyof InitialStateType] as boolean} // Fix type issue
											onChange={checked =>
												setFieldValue(item.id as keyof InitialStateType, checked)
											}
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
									onChange={(value: number) => setFieldValue('rating', value)}
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
