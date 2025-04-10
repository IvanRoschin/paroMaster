"use client"

import { addTestimonial } from "@/actions/testimonials"
import { testimonialFormSchema } from "@/helpers/index"
import { useAddTestimonial } from "@/hooks/useAddTestimonial"
import { ITestimonial } from "@/types/index"
import { Form, Formik, FormikState } from "formik"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { IoMdClose } from "react-icons/io"
// import ReactStars from "react-stars"
import { toast } from "sonner"
import Button from "../Button"
import FormField from "../input/FormField"
import Rating from "../Rating/Rating"
import Switcher from "../Switcher"

interface InitialStateType extends Omit<ITestimonial, "_id"> {}

interface ResetFormProps {
  resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface TestimonialModalProps {
  productId: string
  isOpen: boolean
  closeModal: () => void
}

const TestimonialModal = ({ isOpen, closeModal, productId }: TestimonialModalProps) => {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const addTestimonialMutation = useAddTestimonial(addTestimonial, ["testimonials"], productId)

  const isAdmin = !!session?.user

  const handleClose = useCallback(() => {
    setTimeout(() => {
      closeModal()
    }, 300)
  }, [closeModal])

  useEffect(() => {
    const onEscClick = (e: KeyboardEvent) => {
      if (e.code === "Escape") handleClose()
    }

    window.addEventListener("keydown", onEscClick)

    return () => {
      window.removeEventListener("keydown", onEscClick)
    }
  }, [handleClose])

  const handleBackdropClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.currentTarget === e.target) handleClose()
  }

  const handleSubmit = async (values: ITestimonial, { resetForm }: ResetFormProps) => {
    try {
      if (isLoading) return
      setIsLoading(true)
      const fullName = `${values.name} ${values.surname}`.trim()
      const newTestimonialData = {
        ...values,
        name: fullName
      }
      if (!values.rating) {
        delete newTestimonialData.rating
      }
      const result = await addTestimonialMutation.mutateAsync(newTestimonialData)
      if (result?.success === false) {
        toast.error("Щось пішло не так")
        return
      }
      closeModal()
      toast.success("Новий відгук додано!")
    } catch (error) {
      toast.error("Помилка при додаванні відгуку")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const inputs = [
    { id: "name", label: "Ваше Ім`я", type: "text", required: true },
    { id: "surname", label: "Ваше Прізвище", type: "text", required: true },
    { id: "text", label: "Відгук", type: "textarea", required: true }
  ]

  if (isAdmin) {
    inputs.push({
      id: "isActive",
      label: "Публікується?",
      type: "switcher",
      required: true
    })
  }

  const initialValues = {
    name: "",
    surname: "",
    text: "",
    rating: null,
    isActive: false,
    product: productId,
    createdAt: ""
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70"
    >
      <div className="bg-white p-6 rounded-lg w-full md:w-4/6 lg:w-3/6 xl:w-3/5 mx-auto lg:h-auto md:h-auto relative">
        <button
          onClick={handleClose}
          className="p-1 border-[1px] rounded-full border-neutral-600 hover:opacity-70 transition absolute right-9 hover:border-primaryAccentColor"
        >
          <IoMdClose size={18} />
        </button>
        {/* Using key here to prevent reinitialization when modal closes */}
        <Formik
          key={isOpen ? "open" : "closed"} // This prevents unnecessary form reinitialization.
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={testimonialFormSchema}
        >
          {({ errors, setFieldValue, values, handleSubmit }) => (
            <div className="flex flex-col justify-center items-center">
              <Form className="flex flex-col w-full" onSubmit={handleSubmit}>
                <div className="subtitle">Додати відгук</div>
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
                  {values.rating === null && (
                    <div className="text-sm text-gray-500 mt-2 italic">
                      Ви можете залишити відгук і без оцінки ⭐
                    </div>
                  )}
                  <Rating
                    value={values.rating ?? null}
                    setFieldValue={setFieldValue}
                    errors={errors}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button type="button" label="Скасувати" onClick={handleClose} small outline />
                  <Button type="submit" label="Підтвердити" small />
                </div>
              </Form>
            </div>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default TestimonialModal
