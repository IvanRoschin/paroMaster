"use client"

import { ISlider } from "@/types/index"
import { Form, Formik, FormikState } from "formik"
import React, { useState } from "react"
import { toast } from "sonner"
import ImageUploadCloudinary from "../ImageUploadCloudinary"
import FormField from "../input/FormField"
import CustomButton from "./CustomFormikButton"

interface InitialStateType extends Omit<ISlider, "_id"> {}

interface ResetFormProps {
  resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface SliderFormProps {
  slide?: ISlider
  title?: string
  action: (data: FormData) => Promise<{ success: boolean; message: string }>
}

const AddSlideForm: React.FC<SliderFormProps> = ({ slide, title, action }) => {
  const textareaStyles: React.CSSProperties = {
    height: "100px",
    overflowY: "auto"
  }
  const [images, setImages] = useState<File[]>([])
  const [isUploaded, setIsUploaded] = useState<boolean>(false)

  const initialValues: InitialStateType = {
    src: slide?.src || "",
    title: slide?.title || "",
    desc: slide?.desc || ""
  }

  const slideInputs = [
    {
      id: "title",
      label: "Заголовок слайду",
      type: "text",
      required: true
    },
    {
      id: "desc",
      label: "Опис",
      type: "textarea",
      required: true,
      style: textareaStyles
    }
  ]

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

      if (slide?._id) {
        formData.append("id", slide._id as string)
      }

      await action(formData)
      resetForm()
      toast.success(slide?._id ? "Слайд оновлено!" : "Новий слайд додано!")
    } catch (error) {
      toast.error("Помилка!")
      console.error("Error submitting form:", error)
    }
  }

  return (
    <div className="my-10">
      <h3 className="text-lg mb-4">{title || "Додати слайд"}</h3>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ setFieldValue, values, errors }) => (
          <Form>
            {slideInputs.map((item, i) => (
              <FormField key={i} item={item} errors={errors} setFieldValue={setFieldValue} />
            ))}
            <ImageUploadCloudinary
              setFieldValue={setFieldValue}
              values={values.src}
              errors={errors}
            />
            <CustomButton label={"Зберегти"} />
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default AddSlideForm
