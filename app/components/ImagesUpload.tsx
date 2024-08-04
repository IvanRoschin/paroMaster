'use client'

import { IGood } from '@/types/good/IGood'
import { CldUploadWidget } from 'next-cloudinary'
import { useCallback } from 'react'
import { TbPhotoPlus } from 'react-icons/tb'
import ImagesBlock from './ImagesBlock'

declare global {
	var cloudinary: any
}

interface ImageUploadProps {
	onChange: (value: string) => void
	good?: IGood
	values?: string[]
}

const ImagesUpload: React.FC<ImageUploadProps> = ({ onChange, good, values }) => {
	console.log('values', values)
	const handleUpload = useCallback(
		(result: any) => {
			onChange(result.info.secure_url)
		},
		[onChange],
	)
	return (
		<div>
			{good && (
				<div>
					{/* Display uploaded images */}
					<ImagesBlock item={good} />
				</div>
			)}
			<CldUploadWidget
				onUpload={handleUpload}
				uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
				options={{ maxFiles: 3 }}
			>
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
							<div className='font-semibold text-lg'>Click to upload</div>
							{/* {values && values.length > 0 && (
								<div className='absolute inset-0 w-full h-full'>
									<Image alt='Upload' fill style={{ objectFit: 'cover' }} src={values[0]} />
								</div>
							)} */}
						</div>
					)
				}}
			</CldUploadWidget>
		</div>
	)
}

export default ImagesUpload

// 'use client'

// import { uploadCloudinary } from '@/utils/uploadCloudinary'
// import { FormikErrors } from 'formik'
// import Image from 'next/image'
// import { ChangeEvent, useState } from 'react'

// interface FormikProps {
// 	setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
// 	values?: { imgUrl: string[] }
// 	errors?: { [key: string]: string | string[] | FormikErrors<any> | FormikErrors<any>[] }
// }

// const ImagesUpload: React.FC<FormikProps> = ({ setFieldValue, values, errors }) => {
// 	const [images, setImages] = useState<File[]>([])
// 	const [isUploaded, setIsUploaded] = useState<boolean>(false)

// 	const upload = async () => {
// 		try {
// 			let arr: string[] = []
// 			for (let i = 0; i < images.length; i++) {
// 				const data = await uploadCloudinary(images[i])
// 				if (data?.url) arr.push(data.url)
// 			}
// 			setFieldValue('imgUrl', arr)
// 			setIsUploaded(true)
// 		} catch (error) {
// 			console.log(error)
// 		}
// 	}

// 	return (
// 		<div>
// 			{/* Display uploaded images */}
// 			<div className='flex flex-wrap justify-between items-center'>
// 				{values?.map((url, i) => (
// 					<div key={i} className='relative w-[100px] h-[100px] m-2 '>
// 						<Image
// 							src={url}
// 							alt={`Uploaded image ${i}`}
// 							width={100}
// 							height={100}
// 							className='object-cover w-full h-full'
// 						/>
// 					</div>
// 				))}
// 			</div>

// 			<div className='my-10'>
// 				<h3 className='text-lg mb-4'>Додати фото товару</h3>
// 				<input
// 					type='file'
// 					placeholder='Додати фото'
// 					multiple
// 					className='mb-5'
// 					onChange={(e: ChangeEvent<HTMLInputElement>) => {
// 						if (e.target.files) {
// 							const fileList = Array.from(e.target.files)
// 							setImages(fileList)
// 						}
// 					}}
// 				/>
// 				<button
// 					type='button'
// 					onClick={upload}
// 					className='p-2 mr-8 w-[100px] border border-gray-400 rounded-md hover:bg-gray-300 transition ease-in-out relative'
// 				>
// 					Upload
// 					{isUploaded && (
// 						<span className="bg-[url('/success-check.png')] bg-no-repeat bg-center bg-cover w-[20px] h-[20px] absolute top-[-10px] right-[-10px]"></span>
// 					)}
// 				</button>
// 				<button
// 					type='button'
// 					onClick={() => {
// 						setImages([])
// 						setIsUploaded(false)
// 					}}
// 					className='p-2 w-[100px] border border-gray-400 rounded-md hover:bg-gray-300 transition ease-in-out'
// 				>
// 					Reset
// 				</button>
// 			</div>
// 		</div>
// 	)
// }

// export default ImagesUpload
