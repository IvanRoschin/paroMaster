// type Props = {}

// const orderPage = (props: Props) => {
//   return <div>OrderPage</div>
// }

// export default orderPage

"use client"

import { Field, Form, Formik } from "formik"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { getData } from "@/actions/nova"
import { generateOrderNumber } from "@/helpers/orderNumber"
import { ICustomer } from "@/types/index"

import { addCustomer } from "@/actions/customers"
import { addOrder } from "@/actions/orders"
import { sendAdminEmail, sendCustomerEmail } from "@/actions/sendGridEmail"
import Button from "@/components/Button"
import { storageKeys } from "@/helpers/storageKeys"
import { PaymentMethod } from "@/types/paymentMethod"
import { useShoppingCart } from "app/context/ShoppingCartContext"
import debounce from "debounce"
import { FormField } from "../components"

type Props = {}

const OrderPage: React.FC<Props> = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
  const [warehouses, setWarehouses] = useState<{ Ref: string; Description: string }[]>([])
  const [city, setCity] = useState("Київ")
  const [orderNumber, setOrderNumber] = useState<string>("")
  const [totalPrice, setTotalPrice] = useState(0)
  const { cart } = useShoppingCart()

  useEffect(() => {
    const storedAmount = Number(sessionStorage.getItem(storageKeys.totalPrice))
    setTotalPrice(storedAmount)
  }, [])

  const { push } = useRouter()

  interface InitialStateType extends Omit<ICustomer, "_id"> {}

  const initialValues: InitialStateType = {
    name: "",
    surname: "",
    email: "",
    phone: "+380",
    city: "",
    warehouse: "Київ",
    payment: PaymentMethod.CashOnDelivery
  }
  const customerInputs = [
    {
      name: "name",
      type: "text",
      id: "name",
      label: `Ім'я`
    },
    {
      name: "surname",
      type: "text",
      id: "surname",
      label: `Прізвище`
    },
    {
      name: "email",
      type: "email",
      id: "email",
      label: `Email`
    },
    {
      name: "phone",
      type: "tel",
      id: "phone",
      label: `Телефон`
    },
    {
      id: "payment",
      label: "Оберіть спосіб оплати",
      options: Object.values(PaymentMethod).map((method, index) => ({
        value: method,
        label: method,
        key: `payment-method-${index}`
      })),
      type: "select"
    }
  ]

  const fetchWarehouses = debounce(async (city: string) => {
    try {
      const response = await getData({
        apiKey: process.env.NOVA_API,
        modelName: "Address",
        calledMethod: "getWarehouses",
        methodProperties: { CityName: city, Limit: "50", Language: "UA" }
      })
      setWarehouses(response?.data?.data || [])
    } catch (error) {
      console.error("Error fetching warehouses:", error)
    }
  }, 500)

  useEffect(() => {
    fetchWarehouses(city)
  }, [city])

  useEffect(() => {
    setOrderNumber(generateOrderNumber())
  }, [])

  const handleSubmit = async (values: ICustomer) => {
    if (!values) {
      toast.error("Details are missing")
      return
    }

    const orderData = {
      number: orderNumber,
      orderedGoods,
      totalPrice,
      customer: values,
      status: "Новий"
    }

    const mailData = {
      ...values,
      orderNumber,
      orderedGoods,
      totalPrice
    }

    try {
      setIsLoading(true)

      const [adminEmail, customerEmail, orderResult, customerResult] = await Promise.all([
        sendAdminEmail(mailData),
        sendCustomerEmail(mailData),
        addOrder(orderData),
        addCustomer(values)
      ])

      if (
        adminEmail?.success &&
        customerEmail?.success &&
        orderResult?.success &&
        customerResult?.success
      ) {
        toast.success("Замовлення відправлене", { duration: 3000 })
        resetCart()
      } else {
        throw new Error("Помилка створення замовлення")
      }
    } catch (error) {
      console.error("Error during order processing:", error)
      toast.error(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!initialValues) {
    return null
  }

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-md w-[45%]">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, errors, setFieldValue, touched }) => {
          return (
            <Form className="flex flex-col space-y-4">
              {customerInputs.map((field, index) => (
                <FormField key={index} item={field} setFieldValue={setFieldValue} errors={errors} />
              ))}

              <div className="relative">
                <Field
                  id="city"
                  type="text"
                  value={values.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue("city", e.target.value)
                    setCity(e.target.value)
                  }}
                  className={`peer w-full p-4 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
                ${errors?.city && touched?.city ? "border-rose-500" : "border-neutral-300"}
                ${errors?.city && touched?.city ? "focus:border-rose-500" : "focus:border-green-500"}
              `}
                />
                <label
                  htmlFor="city"
                  className="text-primaryTextColor absolute text-md duration-150 left-3 top-3 z-10 origin-[0] transform -translate-y-3
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
                >
                  Введіть назву міста
                </label>
              </div>

              <div className="relative mt-4">
                <Field
                  as="select"
                  id="warehouse"
                  name="warehouse"
                  value={values.warehouse}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue("warehouse", e.target.value)
                  }
                  className={`peer w-full p-4 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
                ${errors?.warehouse && touched?.warehouse ? "border-rose-500" : "border-neutral-300"}
                ${
                  errors?.warehouse && touched?.warehouse
                    ? "focus:border-rose-500"
                    : "focus:border-green-500"
                }
              `}
                >
                  {warehouses.map((wh, index) => (
                    <option key={index} value={wh.Description}>
                      {wh.Description}
                    </option>
                  ))}
                </Field>
                <label
                  htmlFor="warehouse"
                  className="text-primaryTextColor absolute text-md duration-150 left-3 top-3 z-10 origin-[0] transform -translate-y-3
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
                >
                  Оберіть відділення
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="termsCheckbox"
                  type="checkbox"
                  checked={isCheckboxChecked}
                  onChange={e => setIsCheckboxChecked(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="termsCheckbox">Я погоджуюсь з умовами та правилами</label>
              </div>
              <Button onClick={() => handleSubmit} />
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default OrderPage
