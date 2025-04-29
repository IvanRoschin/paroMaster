"use client"
import { testimonialFormSchema } from "@/helpers/index"
// import { useMutateAddTestimonial } from "@/hooks/useQueryTestimonials"
import { addTestimonial } from "@/actions/testimonials"
import { useAddData, useTestimonialModal } from "@/hooks/index"
import { ITestimonial } from "@/types/index"
import { Form, Formik, FormikState } from "formik"
import { useSession } from "next-auth/react"
import { useState } from "react"
import ReactStars from "react-stars"
import { toast } from "sonner"
import FormField from "../input/FormField"
import Switcher from "../Switcher"
import Button from "../ui/Button"

interface InitialStateType extends Omit<ITestimonial, "_id"> {}

interface ResetFormProps {
  resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface TestimonialFormProps {
  productId: string
}

const TestimonialForm = ({ productId }: TestimonialFormProps) => {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const addTestimonialMutation = useAddData(addTestimonial, ["testimonials"])

  const testinomialModal = useTestimonialModal()

  const isAdmin = !!session?.user

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
      testinomialModal.onClose()
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
  return (
    <>
      <Formik
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
                    <>
                      <FormField item={item} errors={errors} setFieldValue={setFieldValue} />

                      {item.id === "text" && (
                        <div
                          className={`text-xs mt-1 ${
                            values.text.length < 20 ? "text-red-500" : "text-green-500"
                          }`}
                        >
                          {values.text.length < 20
                            ? `Ще потрібно ${20 - values.text.length} символів... ✍️`
                            : "Достатньо символів! 🚀"}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
              <div className="mb-4">
                {values.rating === null && (
                  <div className="text-sm text-gray-500 mt-2 italic">
                    Ви можете залишити відгук і без оцінки ⭐
                  </div>
                )}
                <ReactStars
                  count={5}
                  value={values.rating ?? undefined}
                  onChange={(value: number) => setFieldValue("rating", value)}
                  size={24}
                  color2={"#ffd700"}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  label="Скасувати"
                  onClick={() => testinomialModal.onClose()}
                  small
                  outline
                />
                <Button type="submit" label="Підтвердити" small />
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </>
  )
}

export default TestimonialForm
