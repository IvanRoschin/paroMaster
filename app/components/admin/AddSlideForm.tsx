"use client"

import { useAddData } from "@/hooks/useAddData"
import { useUpdateData } from "@/hooks/useUpdateData"
import { ISlider } from "@/types/index"
import { Form, Formik, FormikState } from "formik"
import React, { useState } from "react"
import { toast } from "sonner"
import ImageUploadCloudinary from "../ImageUploadCloudinary"
import FormField from "../input/FormField"
import Switcher from "../Switcher"
import CustomButton from "./CustomFormikButton"

interface InitialStateType extends Omit<ISlider, "_id"> {}

interface ResetFormProps {
  resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface SliderFormProps {
  slide?: ISlider
  title?: string
  action: (values: ISlider) => Promise<{ success: boolean; message: string }>
}

const AddSlideForm: React.FC<SliderFormProps> = ({ slide, title, action }) => {
  const textareaStyles: React.CSSProperties = {
    height: "100px",
    overflowY: "auto"
  }
  const addSlideMutation = useAddData(action, ["slides"])
  const updateSlideMutation = useUpdateData(action, ["slides"])

  const isUpdating = Boolean(slide?._id)
  const [images, setImages] = useState<File[]>([])
  const [isUploaded, setIsUploaded] = useState<boolean>(false)

  const initialValues: InitialStateType = {
    src: slide?.src || "",
    title: slide?.title || "",
    desc: slide?.desc || "",
    isActive: slide?.isActive || false
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
    },
    {
      id: "isActive",
      label: "Публікується?",
      type: "switcher",
      required: true
    }
  ]

  const handleSubmit = async (values: ISlider, { resetForm }: ResetFormProps) => {
    try {
      const updateSliderData = isUpdating ? { ...values, _id: slide?._id } : {}

      console.log("updateSliderData", updateSliderData)
      console.log("values", values)

      const result = isUpdating
        ? await updateSlideMutation.mutateAsync(updateSliderData)
        : await addSlideMutation.mutateAsync(values)

      if (result?.success === false) {
        toast.error("Something went wrong")
        return
      }
      if (result?.success === true) {
        resetForm()
        toast.success(isUpdating ? "Слайд оновлено!!" : "Новий слайд додано!")
      }
    } catch (error) {
      toast.error("Помилка!")
      console.error("Error submitting form:", error)
    }
  }

  return (
    <div className="my-10">
      <h3 className="text-lg mb-4">{title || "Додати слайд"}</h3>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
        {({ errors, setFieldValue, values }) => (
          <Form>
            {slideInputs.map((item, i) => (
              <div key={i}>
                {item.type === "switcher" ? (
                  <Switcher
                    id={item.id}
                    label={item.label}
                    checked={values[item.id as keyof InitialStateType] as boolean}
                    onChange={checked => setFieldValue(item.id as keyof InitialStateType, checked)}
                  />
                ) : (
                  <FormField item={item} errors={errors} setFieldValue={setFieldValue} />
                )}
              </div>
            ))}
            <div className="relative z-0">
              <ImageUploadCloudinary
                setFieldValue={setFieldValue}
                values={values.src}
                errors={errors}
              />
            </div>

            <CustomButton label={"Зберегти"} />
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default AddSlideForm
