'use client'

import { addGood } from '@/actions/goods'
import { Field, Form, Formik, FormikState } from 'formik'
import * as Yup from 'yup'

import React, { useState } from 'react'
import { ImagesUpload } from '.'
// import { useGlobalContext } from "@/context/store";
// import { useRouter } from "next/navigation";
import { categoryList } from './Category'

const GoodFormSchema = Yup.object().shape({
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

interface initialStateType {
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
	resetForm: (nextState?: Partial<FormikState<initialStateType>>) => void
}

const AdminForm = () => {
	//   const { isLoggedIn } = useGlobalContext();
	//   const router = useRouter();
	const [description, setDescription] = useState<string>('')
	const [category, setCategory] = useState<string>('')

	const initialValues: initialStateType = {
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

	//   useEffect(() => {
	//     isLoggedIn ? router.replace("/admin") : router.replace("/login");
	//   }, [isLoggedIn, router]);

	const handleSubmit = (values: initialStateType, { resetForm }: ResetFormProps) => {
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
				validationSchema={GoodFormSchema}
			>
				{({ values, setFieldValue, errors, touched }) => (
					<Form className='flex flex-col w-[600px]'>
						<div>
							<ImagesUpload setFieldValue={setFieldValue} />
						</div>
						<div className='flex flex-col'>
							className=
							{`
                peer
                w-full
                h-10
                p-6
                bg-white
                border-2
                rounded-md
                outline-none
                transition
                disabled:opacity-70 disabled:cursor-not-allowed
                text-neutral-700
                placeholder-white
                placeholder:b-black
                placeholder:text-base 
                ${errors[id] && touched[id] ? 'border-rose-300' : 'border-neutral-300'} ${
								errors[id] && touched[id] ? 'focus:border-rose-300' : 'focus:border-neutral-500'
							}`}
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
								{categoryList.map(({ categoryName }, index) => {
									return (
										<option value={categoryName} label={categoryName} key={index}>
											{categoryName}
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

export default AdminForm
