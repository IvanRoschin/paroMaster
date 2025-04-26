"use client"

import { CustomButton, FormField, ImageUploadCloudinary, Switcher } from "@/components/index"
import { goodFormSchema } from "@/helpers/index"
import { useAddData, useUpdateData } from "@/hooks/index"
import { useCategoriesEnum } from "@/hooks/useCategoriesEnum"
import { IGood } from "@/types/good/IGood"
import { ICategory } from "@/types/index"
import { Form, Formik, FormikState } from "formik"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface InitialStateType extends Omit<IGood, "_id"> {}

interface ResetFormProps {
  resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface GoodFormProps {
  good?: IGood
  title?: string
  action: (data: FormData) => Promise<{ success: boolean; message: string }>
}

const GoodForm: React.FC<GoodFormProps> = ({ good, title, action }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { push } = useRouter()
  const isUpdating = Boolean(good?._id)

  const { categories, allowedCategories } = useCategoriesEnum()

  const addGoodMutation = useAddData(action, ["goods"])
  const updateGoodMutation = useUpdateData(action, ["goods"])

  const textareaStyles: React.CSSProperties = {
    height: "100px",
    overflowY: "auto"
  }

  const inputs = [
    {
      id: "category",
      label: "Оберіть категорію",
      type: "select",
      options: categories?.map((category: ICategory) => ({
        value: category.title,
        label: category.title
      })),
      required: true
    },
    {
      id: "title",
      label: "Назва товару",
      type: "text",
      required: true
    },
    {
      id: "brand",
      label: "Бренд",
      type: "text",
      required: true
    },
    {
      id: "model",
      label: "Модель",
      type: "text",
      required: true
    },
    {
      id: "vendor",
      label: "Артикул",
      type: "text",
      required: true
    },
    {
      id: "price",
      label: "Ціна",
      type: "number",
      required: true
    },
    {
      id: "isCondition",
      label: "Новий?",
      type: "switcher"
    },
    {
      id: "isAvailable",
      label: "В наявності?",
      type: "switcher"
    },
    {
      id: "isCompatible",
      label: "Сумісний з іншими?",
      type: "switcher"
    },
    {
      id: "compatibility",
      label: "З якими моделями?",
      type: "text"
    },
    {
      id: "description",
      label: "Опис",
      type: "textarea",
      style: textareaStyles
    }
  ]

  const initialValues: InitialStateType = {
    category: good?.category || allowedCategories[0],
    src: good?.src || [],
    brand: good?.brand || "",
    model: good?.model || "",
    vendor: good?.vendor || "",
    title: good?.title || "",
    description: good?.description || "",
    price: good?.price || 0,
    isCondition: good?.isCondition || false,
    isAvailable: good?.isAvailable || false,
    isCompatible: good?.isCompatible || false,
    compatibility: good?.compatibility || []
  }

  // const normalizeToArray = (value: unknown): string[] => {
  //   if (typeof value === "string") {
  //     return value
  //       .split(",")
  //       .map(item => item.trim())
  //       .filter(Boolean)
  //   }
  //   if (Array.isArray(value)) return value
  //   return []
  // }

  const handleSubmit = async (values: InitialStateType, { resetForm }: ResetFormProps) => {
    try {
      setIsLoading(true)

      const formData = new FormData()
      Object.keys(values).forEach(key => {
        const value = (values as Record<string, any>)[key]
        if (Array.isArray(value)) {
          value.forEach(val => formData.append(key, val))
        } else {
          formData.append(key, value)
        }
      })
      if (isUpdating && good) {
        formData.append("id", good._id as string)
      }

      const result = isUpdating
        ? await updateGoodMutation.mutateAsync(formData)
        : await addGoodMutation.mutateAsync(formData)

      console.log("result", result)
      toast.success(
        isUpdating ? result.message || "Товар оновлено!" : result.message || "Новий товар додано!"
      )
      // push("admin/goods")

      // if (result.success) {
      //   toast.success(
      //     isUpdating ? result.message || "Товар оновлено!" : result.message || "Новий товар додано!"
      //   )
      // }

      resetForm({
        values: {
          ...values,
          title: "",
          vendor: "",
          model: "",
          price: 0,
          description: "",
          src: []
        }
      })
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
        validationSchema={goodFormSchema}
        enableReinitialize
      >
        {({ errors, setFieldValue, values, touched }) => (
          <Form className="flex flex-col w-[600px]">
            <ImageUploadCloudinary
              setFieldValue={setFieldValue}
              values={values.src}
              errors={errors}
              uploadPreset="preset_good"
            />
            {inputs.map((item, i) => (
              <div key={i}>
                {item.type === "switcher" ? (
                  <>
                    {(item.id === "isCondition" ||
                      item.id === "isAvailable" ||
                      item.id === "isCompatible") && (
                      <div className="mb-1 text-sm text-gray-600">
                        {item.id === "isCondition" &&
                          `Стан: ${values.isCondition ? "Б/У" : "Нова"}`}
                        {item.id === "isAvailable" &&
                          `Наявність: ${values.isAvailable ? "Є в наявності" : "Немає"}`}
                        {item.id === "isCompatible" &&
                          `Сумісність: ${values.isCompatible ? "Сумісний" : "Не сумісний"}`}
                      </div>
                    )}
                    <Switcher
                      id={item.id}
                      label={
                        item.id === "isCondition"
                          ? "Б/У?"
                          : item.id === "isAvailable"
                            ? "Є в наявності?"
                            : item.id === "isCompatible"
                              ? "Сумісний?"
                              : item.label
                      }
                      checked={!!(values as Record<string, any>)[item.id]}
                      onChange={checked => setFieldValue(item.id, checked)}
                    />
                  </>
                ) : (
                  <FormField item={item} setFieldValue={setFieldValue} errors={errors} />
                )}
              </div>
            ))}
            <CustomButton label="Зберегти" disabled={isLoading} />
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default GoodForm
