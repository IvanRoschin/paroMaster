"use client"

import { FormikErrors } from "formik/dist/types"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"
import { useEffect, useState } from "react"
import { TbPhotoPlus } from "react-icons/tb"

interface ImageUploadProps {
  setFieldValue: (field: string, value: string[], shouldValidate?: boolean) => void
  values?: string[] | string
  errors?: { [key: string]: string | string[] | FormikErrors<any> | FormikErrors<any>[] }
  uploadPreset?: string
}

const ImageUploadCloudinary: React.FC<ImageUploadProps> = ({
  setFieldValue,
  values = [],
  errors,
  uploadPreset
}) => {
  const [localImages, setLocalImages] = useState<string[]>([])
  const isArray = Array.isArray(values)
  const displayImages = isArray && values.length > 0 ? values : localImages

  // ✅ Синхронізація з Formik — без ворнінгів!
  useEffect(() => {
    if (localImages.length > 0) {
      setFieldValue("src", localImages, true)
    }
  }, [localImages, setFieldValue])

  const handleSuccess = (result: any) => {
    const uploadedUrl = result?.info?.secure_url
    if (uploadedUrl) {
      setLocalImages(prev => [...prev, uploadedUrl])
    }
  }

  return (
    <CldUploadWidget
      options={{ maxFiles: 3 }}
      onSuccess={handleSuccess}
      uploadPreset={uploadPreset}
    >
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
            p-10
            border-neutral-300
            flex
            flex-col
            justify-center
            items-center
            gap-4
            text-neutral-600
            rounded-xl
            bg-white
          "
        >
          <TbPhotoPlus size={50} />
          <div className="font-semibold text-lg text-center">Завантажити</div>

          {displayImages.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {displayImages
                .filter((src): src is string => typeof src === "string" && src.length > 0)
                .map((src, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <Image
                      alt={`Upload ${index + 1}`}
                      src={src}
                      fill
                      style={{ objectFit: "cover" }}
                      className="border border-gray-400 block cursor-pointer hover:scale-105 transition-all rounded"
                    />
                  </div>
                ))}
            </div>
          )}

          {errors?.src && <span className="text-red-500 text-sm">{errors.src as any}</span>}
        </div>
      )}
    </CldUploadWidget>
  )
}

export default ImageUploadCloudinary
