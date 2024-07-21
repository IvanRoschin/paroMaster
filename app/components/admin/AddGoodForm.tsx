'use client'

import { addGood } from '@/actions/goods'
import { Field, Form, Formik, FormikState } from 'formik'

import { ImagesUpload } from '@/components/index'
import React, { useState } from 'react'
// import { useGlobalContext } from "@/context/store";
// import { useRouter } from "next/navigation";
import { goodFormSchema } from 'app/helpers/validationShemas/addGoodShema'
import { categoryList } from '../Category'

interface InitialStateType {
	category: string
	imgUrl: string[]
	brand: string
	model: string
	vendor: string
	title: string
	description: string
	price: number
	isAvailable: boolean
	isCompatible: boolean
	compatibility: string[]
}

interface ResetFormProps {
	resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

const AddGoodForm = () => {
	const [description, setDescription] = useState<string>('')
	const [category, setCategory] = useState<string>('')

	const initialValues: InitialStateType = {
		category: '',
		imgUrl: [],
		brand: '',
		model: '',
		vendor: '',
		title: '',
		description: '',
		price: 0,
		isAvailable: true,
		isCompatible: true,
		compatibility: ['Philips', 'Bosh', 'Kenwood'],
	}

	const handleSubmit = (values: InitialStateType, { resetForm }: ResetFormProps) => {
		try {
			addGood(values)
			setDescription('')
			setCategory('')
			resetForm()
			console.log('Success send')
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className=''>
			<h2 className='text-4xl'>Додати товар</h2>
			<Formik
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validationSchema={goodFormSchema}
			>
				{({ values, setFieldValue, errors, touched }) => (
					<Form className='flex flex-col w-[600px]'>
						<div>
							<ImagesUpload setFieldValue={setFieldValue} />
						</div>
						<div className='flex justify-between items-center'>
							<div>
								<select
									name='category'
									className='mb-5 p-2 rounded-md border border-slate-400 text-slate-400'
									style={{ display: 'block' }}
									value={values.category}
									onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
										setFieldValue('category', e.currentTarget.value)
									}}
								>
									<option value='' disabled>
										Вибір категорії
									</option>
									{categoryList.map(({ title }, index) => {
										return (
											<option value={title} title={title} key={index}>
												{title}
											</option>
										)
									})}
								</select>
								{errors.category && touched.category && (
									<div className='text-red-500'>{errors.category}</div>
								)}
								<Field
									type='text'
									name='title'
									placeholder='Назва товару'
									className='mb-5 p-2 rounded-md border border-slate-400 text-slate-400'
								/>
								{errors.title && touched.title ? (
									<div className='text-red-500'>{errors.title}</div>
								) : null}
								<Field
									type='text'
									name='brand'
									placeholder='Бренд'
									className='mb-5 p-2 rounded-md border border-slate-400 text-slate-400'
								/>
								{errors.brand && touched.brand ? (
									<div className='text-red-500'>{errors.brand}</div>
								) : null}
							</div>
							<div>
								<Field
									type='text'
									name='model'
									placeholder='Модель'
									className='mb-5 p-2 rounded-md border border-slate-400 text-slate-400'
								/>
								{errors.model && touched.model ? (
									<div className='text-red-500'>{errors.model}</div>
								) : null}
								<Field
									type='number'
									name='price'
									placeholder='Ціна'
									className='mb-5 p-2 rounded-md border border-slate-400 text-slate-400'
								/>
								{errors.price && touched.price ? (
									<div className='text-red-500'>{errors.price}</div>
								) : null}
								<Field
									type='text'
									name='vendor'
									placeholder='Артикул'
									className='mb-5 p-2 rounded-md border border-slate-400 text-slate-400'
								/>
								{errors.vendor && touched.vendor ? (
									<div className='text-red-500'>{errors.vendor}</div>
								) : null}
							</div>
						</div>

						<Field
							type='text'
							as='textarea'
							value={description}
							name='description'
							placeholder='Опис'
							className='mb-5 p-2 rounded-md border border-slate-400 text-slate-400'
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
								setFieldValue('description', e.currentTarget.value)
								setDescription(e.currentTarget.value)
							}}
						/>
						{errors.description && touched.description ? (
							<div className='text-red-500'>{errors.description}</div>
						) : null}

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

export default AddGoodForm
