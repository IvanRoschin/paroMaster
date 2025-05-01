"use client"

import { Field, Form, Formik, useFormikContext } from "formik"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Breadcrumbs, Button, ErrorMessage, FormField } from "@/components/index"
import { customerFormSchema, storageKeys } from "@/helpers/index"
import { useAddData, useCities, useUpdateData, useWarehouses } from "@/hooks/index"
import { ICustomer } from "@/types/customer/ICustomer"
import { IOrder } from "@/types/index"
import { PaymentMethod } from "@/types/paymentMethod"

interface FormikCustomerValues {
  name: string
  surname: string
  phone: string
  email: string
  city: string
  warehouse: string
  payment: string
}

interface CustomerFormProps {
  customer?: ICustomer
  title?: string
  action: (values: ICustomer) => Promise<{ success: boolean; message: string }>
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  title = "Додати замовника",
  action
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const isUpdating = Boolean(customer?._id)

  const addCustomerMutation = useAddData(action, ["customers"])
  const updateCustomerMutation = useUpdateData(action, ["customers"])

  const [name, surname] = customer?.name?.split(" ") || ["", ""]

  const initialValues: FormikCustomerValues = {
    name,
    surname,
    email: customer?.email || "",
    phone: customer?.phone || "",
    city: customer?.city || "",
    warehouse: customer?.warehouse || "",
    payment: customer?.payment || PaymentMethod.CashOnDelivery
  }

  const handleSubmit = async (customerValues: IOrder["customer"], resetForm: () => void) => {
    if (!customerValues.city || !customerValues.warehouse) {
      toast.error("Будь ласка, виберіть місто та відділення")
      return
    }

    try {
      setIsLoading(true)
      const formData = new FormData()
      Object.entries(customerValues).forEach(([key, value]) => {
        formData.append(key, value)
      })
      if (isUpdating && customer?._id) {
        formData.append("id", customer._id)
      }

      if (isUpdating) {
        await updateCustomerMutation.mutateAsync(formData)
      } else {
        await addCustomerMutation.mutateAsync(formData)
      }

      resetForm()
      toast.success(isUpdating ? "Замовника оновлено!" : "Нового замовника додано!")
    } catch (error) {
      console.error("Помилка оформлення:", error)
      toast.error(error instanceof Error ? error.message : "Невідома помилка")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Breadcrumbs />
      <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg space-y-8">
        <h2 className="text-3xl font-semibold text-primary mb-4">{title}</h2>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={customerFormSchema}
          onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form className="flex flex-col space-y-6">
              <FormEffects />
              <CustomerFields city={values.city} errors={errors} touched={touched} />
              <Button type="submit" label="Відправити" disabled={isLoading} />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

const FormEffects = () => {
  const { values, setFieldValue } = useFormikContext<FormikCustomerValues>()
  const { warehouses } = useWarehouses(values.city)

  useEffect(() => {
    if (warehouses.length && !values.warehouse) {
      setFieldValue("warehouse", warehouses[0].Description)
    }
  }, [warehouses, values.warehouse, setFieldValue])

  useEffect(() => {
    sessionStorage.setItem(storageKeys.customer, JSON.stringify(values))
  }, [values])

  return null
}

const useCitySelection = (
  fieldValue: string,
  setFieldValue: (field: string, value: any) => void
) => {
  const [filteredCities, setFilteredCities] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState(fieldValue || "")
  const { allCities } = useCities(searchQuery)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!Array.isArray(allCities)) {
        setFilteredCities([])
        return
      }

      const normalizedQuery = searchQuery.trim().toLowerCase()
      const filtered = allCities
        .filter((city: any) =>
          (city.description || "").trim().toLowerCase().includes(normalizedQuery)
        )
        .map((city: any) => city.description || "")
      setFilteredCities(filtered)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, allCities])

  const handleSelectCity = (city: string) => {
    setFieldValue("city", city)
    setSearchQuery(city)
    setFilteredCities([])
  }

  return { filteredCities, searchQuery, setSearchQuery, handleSelectCity }
}

const CustomerFields = ({ city, touched, errors }: { city: string; touched: any; errors: any }) => {
  const { values, setFieldValue } = useFormikContext<FormikCustomerValues>()
  const { warehouses, isWarehousesLoading } = useWarehouses(city)
  const [showDropdown, setShowDropdown] = useState(false)

  const { filteredCities, searchQuery, setSearchQuery, handleSelectCity } = useCitySelection(
    values?.city,
    setFieldValue
  )

  const customerInputs = [
    { name: "name", type: "text", id: "name", label: "Ім'я" },
    { name: "surname", type: "text", id: "surname", label: "Прізвище" },
    { name: "email", type: "email", id: "email", label: "Email" },
    { name: "phone", type: "tel", id: "phone", label: "Телефон" },
    {
      id: "customer.payment",
      label: "Оберіть спосіб оплати",
      options: Object.values(PaymentMethod).map(method => ({
        value: method,
        label: method
      })),
      type: "select"
    }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const value = e.target.value
    setSearchQuery(value)
    setFieldValue(field.name, value)
    setShowDropdown(true)
  }

  const handleCityClick = (city: string) => {
    handleSelectCity(city)
    setShowDropdown(false)
  }

  return (
    <>
      {customerInputs.map((input, i) => (
        <FormField key={i} item={input} setFieldValue={setFieldValue} />
      ))}

      <div className="relative mb-4">
        <Field name="customer.city">
          {({ field }: any) => (
            <input
              {...field}
              value={searchQuery}
              onChange={e => handleChange(e, field)}
              placeholder=" "
              className={`text-primaryTextColor peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
        ${errors.customer?.city && touched.customer?.city ? "border-rose-500" : "border-neutral-300"}
        ${errors.customer?.city && touched.customer?.city ? "focus:border-rose-500" : "focus:border-green-500"}
        `}
            />
          )}
        </Field>
        <label
          className="text-primaryTextColor absolute text-md duration-150 left-3 top-5 z-10 origin-[0] transform -translate-y-3
        peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
        >
          Введіть назву міста
        </label>
        {touched?.city && errors?.city && (
          <div className="text-rose-500 text-sm mt-1">
            <ErrorMessage error={errors?.city} />
          </div>
        )}

        {showDropdown && filteredCities.length > 0 && (
          <div className="absolute z-10 w-full bg-white border rounded-md max-h-60 overflow-y-auto">
            {filteredCities.map(city => (
              <div
                key={city}
                onClick={() => handleCityClick(city)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {city}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="relative w-full mb-4">
        <Field
          name="customer.warehouse"
          as="select"
          disabled={isWarehousesLoading}
          className={`text-primaryTextColor peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
        ${errors.customer?.warehouse && touched.customer?.warehouse ? "border-rose-500" : "border-neutral-300"}
        ${errors.customer?.warehouse && touched.customer?.warehouse ? "focus:border-rose-500" : "focus:border-green-500"}`}
        >
          {warehouses.map((wh, i) => (
            <option key={i} value={wh.Description}>
              {wh.Description}
            </option>
          ))}
        </Field>
        <label
          htmlFor="customer.warehouse"
          className="text-primaryTextColor absolute text-md duration-150 left-3 top-3 z-9 origin-[0] transform -translate-y-3
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
        >
          Оберіть відділення
        </label>
        {touched?.warehouse && errors?.warehouse && (
          <div className="text-rose-500 text-sm mt-1">
            <ErrorMessage error={errors?.warehouse} />
          </div>
        )}
      </div>
      {Object.keys(errors).length > 0 && (
        <pre className="text-red-500">{JSON.stringify(errors, null, 2)}</pre>
      )}
    </>
  )
}

export default CustomerForm
