'use client'

import { sendEmailToLid } from '@/actions/sendEmail'
import CustomButton from '@/components/admin/CustomFormikButton'
import FormField from '@/components/input/FormField'
import { contactFormSchema } from '@/helpers/index'
import { ILid } from '@/types/lid/ILid'
import { Form, Formik, FormikState } from 'formik'
import { toast } from 'sonner'

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
	subtitle?: boolean
	icon?: React.ReactNode
}

const NewLidForm: React.FC<NewLidFormProps> = ({ lid, title, action, subtitle, icon }) => {
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
			<h2
				className={`${subtitle ? 'subtitle mb-4' : 'text-2xl mb-4'}
			${icon ? 'justify-center items-center' : 'justify-center items-center'}`}
			>
				{icon}
				{title}
			</h2>
			<Formik
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validationSchema={contactFormSchema}
				enableReinitialize
			>
				{({ errors, setFieldValue }) => (
					<Form className='flex flex-col w-full md:min-w-[400px] xl:min-w-[600px]'>
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
