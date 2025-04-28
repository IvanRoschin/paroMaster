"use client"

import { Field, Form, Formik, useFormikContext } from "formik"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { addCustomer } from "@/actions/customers"
import { addOrder } from "@/actions/orders"
import { sendAdminEmail, sendCustomerEmail } from "@/actions/sendGridEmail"
import Breadcrumbs from "@/components/Breadcrumbs"
import FormField from "@/components/input/FormField"
import Button from "@/components/ui/Button"
import { generateOrderNumber } from "@/helpers/orderNumber"
import { storageKeys } from "@/helpers/storageKeys"
import { useWarehouses } from "@/hooks/useWarehouses"
import { ICustomer, IOrder } from "@/types/index"
import { PaymentMethod } from "@/types/paymentMethod"
import { useShoppingCart } from "app/context/ShoppingCartContext"
import OrderGood from "./orderGood"

const customerFields = [
  { name: "name", type: "text", id: "name", label: "Ім'я" },
  { name: "surname", type: "text", id: "surname", label: "Прізвище" },
  { name: "email", type: "email", id: "email", label: "Email" },
  { name: "phone", type: "tel", id: "phone", label: "Телефон" },
  {
    id: "payment",
    label: "Оберіть спосіб оплати",
    options: Object.values(PaymentMethod).map(method => ({
      value: method,
      label: method,
      key: method
    })),
    type: "select"
  }
]

const OrderPage = () => {
  const { cart, resetCart } = useShoppingCart()
  const { push } = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [city, setCity] = useState("Київ")
  const [orderNumber, setOrderNumber] = useState("")
  const [totalPrice, setTotalPrice] = useState(0)

  const initialFormValues: Omit<ICustomer, "_id"> = {
    name: "",
    surname: "",
    email: "",
    phone: "+380",
    city: "Київ",
    warehouse: "",
    payment: PaymentMethod.CashOnDelivery
  }

  useEffect(() => {
    setTotalPrice(Number(sessionStorage.getItem(storageKeys.totalPrice)) || 0)
    setOrderNumber(generateOrderNumber())
  }, [])

  const { warehouses, isWarehousesLoading } = useWarehouses(city)

  const handleSubmit = async (values: ICustomer) => {
    if (!values) {
      toast.error("Заповніть усі дані")
      return
    }

    const orderData: IOrder = {
      number: orderNumber,
      orderedGoods: cart.map(good => ({
        ...good,
        quantity: good.quantity
      })),
      totalPrice,
      customer: {
        name: values.name,
        surname: values.surname,
        phone: values.phone,
        email: values.email,
        city: values.city,
        warehouse: values.warehouse,
        payment: values.payment
      },
      status: "Новий"
    }

    const mailData = { ...values, orderNumber, orderedGoods: cart, totalPrice }

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
        toast.success("Замовлення успішно створено! 🚀", { duration: 3000 })
        resetCart()
        sessionStorage.clear()
        push("/")
      } else {
        throw new Error("Помилка під час створення замовлення")
      }
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
        <h2 className="text-3xl font-semibold text-primary mb-4">Оформлення замовлення</h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Форма оформлення */}
          <div className="w-full lg:w-2/3">
            <Formik
              enableReinitialize
              initialValues={initialFormValues}
              onSubmit={handleSubmit}
              validateOnMount
            >
              {({ values, setFieldValue, errors }) => (
                <Form className="flex flex-col space-y-6">
                  <FormEffects />

                  {customerFields.map((field, index) => (
                    <FormField
                      key={index}
                      item={field}
                      setFieldValue={setFieldValue}
                      errors={errors}
                    />
                  ))}

                  {/* Місто */}
                  <Field name="city">
                    {({ field }: any) => (
                      <input
                        {...field}
                        placeholder="Введіть назву міста"
                        onChange={e => {
                          setFieldValue("city", e.target.value)
                          setCity(e.target.value)
                        }}
                        className="w-full p-4 border-2 rounded-md mb-4"
                      />
                    )}
                  </Field>

                  {/* Відділення НП */}
                  <Field
                    name="warehouse"
                    as="select"
                    disabled={isWarehousesLoading}
                    className="w-full p-4 border-2 rounded-md mb-4"
                  >
                    {warehouses.map((wh, i) => (
                      <option key={i} value={wh.Description}>
                        {wh.Description}
                      </option>
                    ))}
                  </Field>

                  <Button type="submit" label="Підтвердити замовлення" disabled={isLoading} />
                </Form>
              )}
            </Formik>
          </div>

          {/* Товари у кошику */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <h3 className="text-2xl font-semibold mb-4">Ваші товари</h3>
            {cart.length > 0 ? (
              cart.map((good, index) => (
                <OrderGood key={good._id || index} good={good} quantity={good.quantity} />
              ))
            ) : (
              <div>Кошик порожній...</div>
            )}
            <div className="text-xl font-bold mt-4">Загальна сума: {totalPrice} грн</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderPage

// --- Допоміжний компонент:

const FormEffects = () => {
  const { values, setFieldValue } = useFormikContext<ICustomer>()
  const { warehouses } = useWarehouses(values.city)

  useEffect(() => {
    if (warehouses.length) {
      setFieldValue("warehouse", warehouses[0].Description)
    }
  }, [warehouses, setFieldValue])

  return null
}
