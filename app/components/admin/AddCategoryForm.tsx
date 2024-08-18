'use client'

import { ICategory } from '@/types/category/ICategory'
import { uploadCloudinary } from '@/utils/uploadCloudinary'
import { Field, Form, Formik, FormikState } from 'formik'
import React, { ChangeEvent, useState } from 'react'
import { toast } from 'sonner'

interface InitialStateType extends Omit<ICategory, '_id'> {}

interface ResetFormProps {
	resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface CategoryFormProps {
	category?: ICategory
	title?: string
	action: (data: FormData) => Promise<void>
}

const AddCategoryForm: React.FC<CategoryFormProps> = ({ category, title, action }) => {
	const [images, setImages] = useState<File[]>([])
	const [isUploaded, setIsUploaded] = useState<boolean>(false)

	const initialValues: InitialStateType = {
		src: category?.src || '',
		title: category?.title || '',
	}

	const upload = async (setFieldValue: (field: string, value: any) => void) => {
		try {
			let arr: string[] = []
			for (let i = 0; i < images.length; i++) {
				const data = await uploadCloudinary(images[i])
				if (data?.url) arr.push(data.url)
			}
			setFieldValue('src', arr)
			setIsUploaded(true)
		} catch (error) {
			console.error('Error uploading images:', error)
		}
	}

	const handleSubmit = async (values: InitialStateType, { resetForm }: ResetFormProps) => {
		try {
			const formData = new FormData()

			Object.keys(values).forEach(key => {
				const value = (values as Record<string, any>)[key]
				if (Array.isArray(value)) {
					value.forEach(val => formData.append(key, val))
				} else {
					formData.append(key, value)
				}
			})

			if (category?._id) {
				formData.append('id', category._id as string)
			}

			await action(formData)
			resetForm()
			toast.success(category?._id ? 'Категорію оновлено!' : 'Нову категорію додано!')
		} catch (error) {
			toast.error('Помилка!')
			console.error('Error submitting form:', error)
		}
	}

	return (
		<div className='my-10'>
			<h3 className='text-lg mb-4'>{title || 'Додати категорію'}</h3>
			<Formik initialValues={initialValues} onSubmit={handleSubmit}>
				{({ setFieldValue }) => (
					<Form>
						<div className='mb-4'>
							<label htmlFor='title' className='block text-gray-700'>
								Назва категорії
							</label>
							<Field
								id='title'
								name='title'
								type='text'
								className='mt-1 block w-full p-2 border rounded-md'
								placeholder='Введіть назву категорії'
								required
							/>
						</div>

						<div className='mb-4'>
							<label className='block text-gray-700'>Додати фото категорії</label>
							<input
								type='file'
								multiple
								className='mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100'
								onChange={(e: ChangeEvent<HTMLInputElement>) => {
									if (e.target.files) {
										const fileList = Array.from(e.target.files)
										setImages(fileList)
									}
								}}
							/>
							<button
								type='button'
								onClick={() => upload(setFieldValue)}
								className='mt-2 p-2 border border-gray-400 rounded-md hover:bg-gray-300 transition ease-in-out'
							>
								Завантажити{isUploaded && '...'}
							</button>
						</div>

						<div className='flex justify-between'>
							<button
								type='submit'
								className='p-2 w-[150px] border border-gray-400 rounded-md hover:bg-gray-300 transition ease-in-out'
							>
								Зберегти
							</button>
							<button
								type='button'
								onClick={() => {
									setImages([])
									setIsUploaded(false)
								}}
								className='p-2 w-[150px] border border-gray-400 rounded-md hover:bg-gray-300 transition ease-in-out'
							>
								Скасувати
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default AddCategoryForm
