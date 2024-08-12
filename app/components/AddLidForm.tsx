'use client'

import { sendEmailToLid } from '@/actions/sendEmail'
import CustomButton from '@/components/admin/CustomFormikButton'
import FormField from '@/components/input/FormField'
import { ILid } from '@/types/lid/ILid'
import { Form, Formik, FormikState } from 'formik'
import { toast } from 'sonner'
import { contactFormSchema } from '../helpers//validationShemas/contactForm'

interface InitialStateType extends Omit<ILid, '_id'> {}

interface ResetFormProps {
	resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface NewLidFormProps {
	lid?: Partial<ILid>
	action: (
		data: FormData,
	) => Promise<{
		success: boolean
		data: {
			name: FormDataEntryValue
			phone: FormDataEntryValue
			email: FormDataEntryValue
		}
	}>
	title?: string
}

const NewLidForm: React.FC<NewLidFormProps> = ({ lid, title, action }) => {
	const inputs = [
		{
			id: 'name',
			label: 'Ім`я',
			type: 'text',
			required: true,
		},
		{
			id: 'phone',
			label: 'Телефон',
			type: 'tel',
			required: true,
		},
		{
			id: 'email',
			label: 'Email',
			type: 'email',
			required: true,
		},
	]

	const initialValues: InitialStateType = {
		name: '',
		phone: '+380',
		email: '',
		createdAt: lid?.createdAt || '',
	}

	const handleSubmit = async (values: InitialStateType, { resetForm }: ResetFormProps) => {
		try {
			const formData = new FormData()
			Object.keys(values).forEach(key => {
				formData.append(key, (values as any)[key])
			})
			const emailResult = await sendEmailToLid(values)
			if (emailResult.success) {
				await action(formData)
				resetForm()
				toast.success(lid?._id ? 'Користувача оновлено!' : 'Ваше повідомлення направлено!')
			}
		} catch (error) {
			toast.error('Помилка!')
			console.log(error)
		}
	}

	return (
		<div className='flex flex-col justify-center items-center '>
			<h2 className='text-4xl mb-4'>{title}</h2>

			<Formik
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validationSchema={contactFormSchema}
				enableReinitialize
			>
				{({ errors, setFieldValue }) => (
					<Form className='flex flex-col w-[600px]'>
						<div>
							{inputs.map((item, i) => (
								<FormField item={item} key={i} errors={errors} setFieldValue={setFieldValue} />
							))}
						</div>
						<CustomButton label={'Відправити'} />
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default NewLidForm
