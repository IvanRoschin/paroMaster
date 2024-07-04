'use client'

import { addUser } from '@/actions/users'
import { IUser } from '@/types/user/IUser'
import { Field, Form, Formik, FormikState } from 'formik'
import React from 'react'
import { userFormSchema } from '../../helpers/validationShemas'

interface InitialStateType extends Omit<IUser, '_id'> {}

interface ResetFormProps {
	resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

const AddUserForm = () => {
	const initialValues: InitialStateType = {
		name: '',
		phone: '',
		email: '',
		password: '',
		isAdmin: false,
		isActive: false,
	}

	const handleSubmit = async (values: InitialStateType, { resetForm }: ResetFormProps) => {
		try {
			await addUser(values)
			resetForm()
			console.log('User successfully added')
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div>
			<h2 className='text-4xl'>Додати нового користувача</h2>
			<Formik
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validationSchema={userFormSchema}
			>
				{({ errors, touched, setFieldValue }) => (
					<Form className='flex flex-col w-[600px]'>
						<div className='flex justify-between items-center'>
							<div>
								<Field
									type='text'
									name='name'
									placeholder="Ім'я"
									className='mb-5 p-2 rounded-md border border-slate-400 text-slate-400'
								/>
								{errors.name && touched.name && <div className='text-red-500'>{errors.name}</div>}
								<Field
									type='tel'
									name='phone'
									placeholder='Телефон'
									className='mb-5 p-2 rounded-md border border-slate-400 text-slate-400'
								/>
								{errors.phone && touched.phone && (
									<div className='text-red-500'>{errors.phone}</div>
								)}
								<Field
									type='email'
									name='email'
									placeholder='Email'
									className='mb-5 p-2 rounded-md border border-slate-400 text-slate-400'
								/>
								{errors.email && touched.email && (
									<div className='text-red-500'>{errors.email}</div>
								)}
								<Field
									type='password'
									name='password'
									placeholder='Password'
									className='mb-5 p-2 rounded-md border border-slate-400 text-slate-400'
								/>
								{errors.password && touched.password && (
									<div className='text-red-500'>{errors.password}</div>
								)}
							</div>
							<div>
								<Field
									as='select'
									name='isAdmin'
									className='mb-5 p-2 rounded-md border border-slate-400 text-slate-400'
									onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
										setFieldValue('isAdmin', e.target.value === 'true')
									}}
								>
									<option value='false'>Адмін?</option>
									<option value='true'>Так</option>
									<option value='false'>Ні</option>
								</Field>
								{errors.isAdmin && touched.isAdmin && (
									<div className='text-red-500'>{errors.isAdmin}</div>
								)}
								<Field
									as='select'
									name='isActive'
									className='mb-5 p-2 rounded-md border border-slate-400 text-slate-400'
									onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
										setFieldValue('status', e.target.value === 'true')
									}}
								>
									<option value='false'>Активний?</option>
									<option value='true'>Так</option>
									<option value='false'>Ні</option>
								</Field>
								{errors.isActive && touched.isActive && (
									<div className='text-red-500'>{errors.isActive}</div>
								)}
							</div>
						</div>

						<button
							type='submit'
							className='p-2 w-[100px] border border-gray-400 rounded-md self-center hover:bg-gray-300 transition ease-in-out'
						>
							Зберегти
						</button>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default AddUserForm
