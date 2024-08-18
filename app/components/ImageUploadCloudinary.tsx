'use client'

import { FormikErrors } from 'formik/dist/types'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { useState } from 'react'
import { TbPhotoPlus } from 'react-icons/tb'

declare global {
	var cloudinary: any
}

interface ImageUploadProps {
	setFieldValue: (field: string, value: string[], shouldValidate?: boolean) => void
	values?: string[] | string
	errors?: { [key: string]: string | string[] | FormikErrors<any> | FormikErrors<any>[] }
}

const ImageUploadCloudinary: React.FC<ImageUploadProps> = ({
	setFieldValue,
	values = [],
	errors,
}) => {
	const [resource, setResource] = useState<string[]>(Array.isArray(values) ? values : [values])

	const handleSuccess = (result: any) => {
		const uploadedImageUrl = result?.info?.secure_url
		const updatedImages = [...resource, uploadedImageUrl]

		setResource(updatedImages)
		setFieldValue('src', updatedImages)
	}

	return (
		<CldUploadWidget options={{ maxFiles: 3 }} onSuccess={handleSuccess}>
			{({ open }) => {
				return (
					<div
						onClick={() => open?.()}
						className='
        relative
        cursor-pointer
        hover:opacity-70
        transition
        border-dashed
        border-2
        p-20
        border-neutral-300
        flex
        flex-col
        justify-center
        items-center
        gap-4
        text-neutral-600
        '
					>
						<TbPhotoPlus size={50} />
						<div className='font-semibold text-lg text-center'>Завантажити</div>
						<div className='flex flex-wrap gap-2 mt-4'>
							{resource.map((src, index) => (
								<div key={index} className='relative w-24 h-24'>
									<Image
										alt={`Upload ${index + 1}`}
										fill
										style={{ objectFit: 'cover' }}
										src={src}
									/>
								</div>
							))}
						</div>

						{errors?.src && <span className='text-red-500'>{errors?.src as any}</span>}
					</div>
				)
			}}
		</CldUploadWidget>
	)
}

export default ImageUploadCloudinary
