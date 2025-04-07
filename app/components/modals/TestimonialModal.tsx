import { addTestimonial } from "@/actions/testimonials"
import { testimonialFormSchema } from "@/helpers/index"
import { useAddData } from "@/hooks/useAddData"
import { ITestimonial } from "@/types/index"
import { Form, Formik, FormikState } from "formik"
import { useSession } from "next-auth/react"
import { useMemo, useState } from "react"
import ReactStars from "react-stars"
import { toast } from "sonner"
import Heading from "../Heading"
import Switcher from "../Switcher"
import FormField from "../input/FormField"
import Modal from "./Modal"

interface InitialStateType extends Omit<ITestimonial, "_id"> {}

interface ResetFormProps {
  resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface TestimonialModalProps {
  isOpen: boolean
  closeModal: () => void
}

const TestimonialModal = ({ isOpen, closeModal }: TestimonialModalProps) => {
  const initialValues = useMemo(
    () => ({
      name: "",
      surname: "",
      text: "",
      rating: 0,
      createdAt: "",
      isActive: false
    }),
    []
  )
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const addTestimonialMutation = useAddData(addTestimonial, ["testimonials"])

  const textareaStyles: React.CSSProperties = {
    height: "100px",
    overflowY: "auto"
  }

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
      const result = await addTestimonialMutation.mutateAsync(newTestimonialData)

      if (result?.success === false) {
        toast.error("Щось пішло не так")
        return
      }

      resetForm()
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
    { id: "text", label: "Відгук", type: "textarea", required: true, style: textareaStyles }
  ]

  if (isAdmin) {
    inputs.push({
      id: "isActive",
      label: "Публікується?",
      type: "switcher",
      required: true
    })
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={testimonialFormSchema}
      enableReinitialize
    >
      {({ errors, setFieldValue, values, handleSubmit }) => {
        const bodyContent = (
          <div className="flex flex-col justify-center items-center">
            <Heading title="Додати відгук" subtitle="про товар" />
            <Form className="flex flex-col w-[600px]">
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
                  value={values.rating}
                  onChange={(value: number) => setFieldValue("rating", value)}
                  size={24}
                  color2={"#ffd700"}
                />
              </div>
            </Form>
          </div>
        )
        return (
          <Modal
            title="Додати відгук"
            actionLabel="Додати"
            secondaryAction={closeModal}
            secondaryActionLabel="Продовжити покупки"
            body={bodyContent}
            isOpen={isOpen}
            onClose={closeModal}
            onSubmit={handleSubmit}
          />
        )
      }}
    </Formik>
  )
}

export default TestimonialModal
