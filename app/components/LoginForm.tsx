'use client'

import { authenticate } from '@/actions/authenticate'
import { userLoginSchema } from 'app/helpers/validationShemas'
import { Form, Formik, FormikHelpers } from 'formik'
import { toast } from 'sonner'
import Button from './Button'
import FormField from './input/FormField'

interface InitialStateType {
	email: string
	password: string
}

const LoginForm = () => {
	const initialValues: InitialStateType = {
		email: '',
		password: '',
	}

	const handleSubmit = async (
		values: InitialStateType,
		{ resetForm }: FormikHelpers<InitialStateType>,
	) => {
		try {
			const formData = new FormData()
			formData.append('email', values.email)
			formData.append('password', values.password)

			await authenticate(formData)
			resetForm()
			toast.success('Login successful!')
		} catch (error) {
			toast.error('Error logging in!')
			console.log(error)
		}
	}

	const inputs = [
		{
			label: 'Email',
			type: 'text',
			id: 'email',
			required: true,
		},
		{
			label: 'Password',
			type: 'password',
			id: 'password',
			required: true,
		},
	]

	return (
		<div className='flex flex-col justify-center items-center'>
			<h2 className='text-4xl mb-4'>Login</h2>

			<Formik
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validationSchema={userLoginSchema}
				enableReinitialize
			>
				{({ errors, setFieldValue }) => (
					<Form className='flex flex-col w-[600px]'>
						{inputs.map((item, i) => (
							<FormField item={item} key={i} errors={errors} />
						))}
						<Button type={'submit'} label='Login' />
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default LoginForm
