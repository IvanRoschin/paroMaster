"use client"

import { FormikErrors } from "formik/dist/types"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"
import { useState } from "react"
import { TbPhotoPlus } from "react-icons/tb"

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
  errors
}) => {
  const [resource, setResource] = useState<string[]>([])
  const isArray = Array.isArray(values)

  const handleSuccess = (result: any) => {
    const uploadedImageUrl = result?.info?.secure_url
    setResource(prevResources => {
      const updatedResources = [...prevResources, uploadedImageUrl]
      setFieldValue("src", updatedResources)

      return updatedResources
    })
  }

  const imagesToDisplay = isArray && values.length > 0 ? values : resource

  return (
    <CldUploadWidget options={{ maxFiles: 3 }} onSuccess={handleSuccess}>
      {({ open }) => (
        <div
          onClick={() => open?.()}
          className="
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
          "
        >
          <TbPhotoPlus size={50} />
          <div className="font-semibold text-lg text-center">Завантажити</div>
          {/* Render Image */}
          {imagesToDisplay && imagesToDisplay.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {imagesToDisplay.map((src, index) => (
                <div key={index} className="relative w-24 h-24">
                  <Image
                    alt={`Upload ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    src={src}
                    className="border border-gray-400 block cursor-pointer hover:shadow-[10px_10px_15px_-3px_rgba(0,0,0,0.3)] hover:scale-105 transition-all"
                  />
                </div>
              ))}
            </div>
          )}
          {errors?.src && <span className="text-red-500">{errors?.src as any}</span>}
        </div>
      )}
    </CldUploadWidget>
  )
}

export default ImageUploadCloudinary
