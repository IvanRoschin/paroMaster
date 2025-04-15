"use client"

import { testimonialFormSchema } from "@/helpers/index"
import { useAddData } from "@/hooks/useAddData"
import { useUpdateData } from "@/hooks/useUpdateData"
import { ITestimonial } from "@/types/index"
import { useQueryClient } from "@tanstack/react-query"
import { Form, Formik, FormikState } from "formik"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import Rating from "react-rating"
import ReactStars from "react-stars"
import { toast } from "sonner"
import FormField from "../input/FormField"
import Switcher from "../Switcher"
import CustomButton from "./CustomFormikButton"

interface InitialStateType extends Omit<ITestimonial, "_id"> {}

interface ResetFormProps {
  resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface TestimonialFormProps {
  testimonial?: ITestimonial
  title?: string
  action: (values: ITestimonial) => Promise<{ success: boolean; message: string }>
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ testimonial, title, action }) => {
  const ReactRating = Rating as unknown as React.FC<any>
  const [isLoading, setIsLoading] = useState(false)
  const { push } = useRouter()
  const { data: session } = useSession()
  const addTestimonialMutation = useAddData(action, ["allTestimonials"])
  const updateTestimonialMutation = useUpdateData(action, ["allTestimonials"])
  const [name, surname] = testimonial?.name?.split(" ") || ["", ""]
  const isUpdating = Boolean(testimonial?._id)
  const queryClient = useQueryClient()

  const textareaStyles: React.CSSProperties = {
    height: "100px",
    overflowY: "auto"
  }

  const isAdmin = !!session?.user

  const inputs = [
    {
      id: "name",
      label: "Ваше Ім`я",
      type: "text",
      required: true
    },
    {
      id: "surname",
      label: "Ваше Прізвище",
      type: "text",
      required: true
    },
    {
      id: "text",
      label: "Відгук",
      type: "textarea",
      required: true,
      style: textareaStyles
    }
  ]

  if (isAdmin) {
    inputs.push({
      id: "isActive",
      label: "Публікується?",
      type: "switcher",
      required: true
    })
  }

  const initialValues: InitialStateType = {
    name: name || "",
    surname: surname || "",
    text: testimonial?.text || "",
    rating: testimonial?.rating || 0,
    createdAt: testimonial?.createdAt || "",
    isActive: testimonial?.isActive || false,
    product: testimonial?.product || ""
  }

  const handleSubmit = async (values: ITestimonial, { resetForm }: ResetFormProps) => {
    try {
      if (isLoading) return
      setIsLoading(true)

      const fullName = `${values.name} ${values.surname}`.trim()
      const newestimonialData = {
        ...values,
        name: fullName
      }

      const updateTestimonialData = isUpdating
        ? { ...newestimonialData, _id: testimonial?._id }
        : {}

      const result = isUpdating
        ? await updateTestimonialMutation.mutateAsync(updateTestimonialData)
        : await addTestimonialMutation.mutateAsync(values)

      if (result?.success === false) {
        toast.error("Something went wrong")
        return
      }

      // await queryClient.invalidateQueries({ queryKey: ["allTestimonials"] })
      // await queryClient.refetchQueries({ queryKey: ["allTestimonials"] })
      resetForm()
      toast.success(isUpdating ? "Відгук оновлено!" : "Новий відгук додано!")
      push("/admin/testimonials")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
        console.error(error.message)
      } else {
        toast.error("An unknown error occurred")
        console.error(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-4xl mb-4">{title}</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={testimonialFormSchema}
        enableReinitialize
      >
        {({ errors, setFieldValue, values }) => (
          <Form className="flex flex-col w-[600px]">
            <div>
              {inputs.map((item, i) => (
                <div key={i}>
                  {item.type === "switcher" ? (
                    <Switcher
                      id={item.id}
                      label={item.label}
                      checked={values[item.id as keyof InitialStateType] as boolean}
                      onChange={checked =>
                        setFieldValue(item.id as keyof InitialStateType, checked)
                      }
                    />
                  ) : (
                    <FormField item={item} errors={errors} setFieldValue={setFieldValue} />
                  )}
                </div>
              ))}
              <div className="mb-4">
                <label htmlFor="rating" className="block mb-2">
                  Ваша оцінка
                </label>
                <ReactStars
                  count={5}
                  value={values.rating ?? undefined}
                  onChange={(value: number) => {
                    if (value !== values.rating) {
                      setFieldValue("rating", value)
                    }
                  }}
                  size={24}
                  color2={"#ffd700"}
                />
                {/* <ReactRating
									emptySymbol={<FaStar size={24} color='#ccc' />}
									fullSymbol={<FaStar size={24} color='#ffd700' />}
									initialRating={values.rating}
									onChange={(value: number) => setFieldValue('rating', value)}
								/> */}
              </div>
            </div>
            <CustomButton label={"Зберегти"} disabled={isLoading} />
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default TestimonialForm
