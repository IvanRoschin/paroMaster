'use client'

import { useAddData } from '@/hooks/useAddData'
import { useUpdateData } from '@/hooks/useUpdateData'
import { ICategory } from '@/types/category/ICategory'
import { Field, Form, Formik, FormikState } from 'formik'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { toast } from 'sonner'
import ImageUploadCloudinary from '../ImageUploadCloudinary'
import CustomButton from './CustomFormikButton'

interface InitialStateType extends Omit<ICategory, '_id'> {}

interface ResetFormProps {
	resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface CategoryFormProps {
	category?: ICategory
	title?: string
	action: (
		data: FormData,
	) => Promise<{
		success: boolean
		message: string
		category?: ICategory
	}>
}

const AddCategoryForm: React.FC<CategoryFormProps> = ({ category, title, action }) => {
	const initialValues: InitialStateType = {
		src: category?.src || '',
		title: category?.title || '',
	}
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const isUpdating = Boolean(category?._id)

	const addCategoryMutation = useAddData(action, 'categories')
	const updateCategoryMutation = useUpdateData(action, 'categories')

	const handleSubmit = async (values: InitialStateType, { resetForm }: ResetFormProps) => {
		try {
			setIsLoading(true)

			const formData = new FormData()
			Object.keys(values).forEach(key => {
				const value = (values as Record<string, any>)[key]
				if (Array.isArray(value)) {
					value.forEach(val => formData.append(key, val))
				} else {
					formData.append(key, value)
				}
			})
			if (isUpdating && category) {
				formData.append('id', category._id as string)
			}

			if (isUpdating) {
				await updateCategoryMutation.mutateAsync(formData)
			} else {
				await addCategoryMutation.mutateAsync(formData)
			}
			resetForm()
			toast.success(isUpdating ? 'Категорію оновлено!' : 'Нову категорію додано!')
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message)
				console.error(error.message)
			} else {
				toast.error('An unknown error occurred')
				console.error(error)
			}
		} finally {
			setIsLoading(false)
			router.push('/admin/categories')
		}
	}

	return (
		<div className='my-10'>
			<h3 className='text-lg mb-4'>{title || 'Додати категорію'}</h3>
			<Formik initialValues={initialValues} onSubmit={handleSubmit}>
				{({ setFieldValue, values, errors }) => (
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
						<ImageUploadCloudinary
							setFieldValue={setFieldValue}
							values={values.src}
							errors={errors}
						/>
						<CustomButton label='Зберегти' disabled={isLoading} />
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default AddCategoryForm
