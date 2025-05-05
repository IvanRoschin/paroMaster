"use client"

import { useShoppingCart } from "app/context/ShoppingCartContext"
import { createWayForPayInvoice } from "app/lib/wayforpay"
import PublicOfferSummary from "app/publicoffer/PublicOfferSummary"
import { ErrorMessage, Field, Form, Formik, useFormikContext } from "formik"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { addCustomer } from "@/actions/customers"
import { addOrder } from "@/actions/orders"
import { sendAdminEmail, sendCustomerEmail } from "@/actions/sendGridEmail"
// import WayForPayForm from "@/components/forms/WayForPayForm"
import { Breadcrumbs, Button, FormField } from "@/components/index"
import { storageKeys } from "@/helpers/index"
import { useCities, useWarehouses } from "@/hooks/index"
import { ICartItem, IOrder } from "@/types/index"
import { PaymentMethod } from "@/types/paymentMethod"

import OrderGood from "./orderGood"

interface FormikCustomerValues {
  name: string
  surname: string
  phone: string
  email: string
  city: string
  warehouse: string
  payment: string
}

const OrderPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
  const { cart, resetCart } = useShoppingCart()
  const { push } = useRouter()

  const generatedNumber = `ORD-${Date.now()}`

  const totalPrice = useMemo(
    () =>
      cart.reduce((acc, item: ICartItem) => acc + (item.good.price || 0) * (item.quantity || 1), 0),
    [cart]
  )
  const getSavedFormData = (): FormikCustomerValues | null => {
    try {
      const savedData = sessionStorage.getItem(storageKeys.customer)
      if (savedData) {
        return JSON.parse(savedData) as FormikCustomerValues
      }
      return null
    } catch (error) {
      console.error("Помилка при читанні даних форми:", error)
      return null
    }
  }

  const savedFormData = getSavedFormData()

  const initialValues = savedFormData || {
    name: "",
    surname: "",
    email: "",
    phone: "",
    city: "",
    warehouse: "",
    payment: PaymentMethod.CashOnDelivery
  }

  const handleSubmit = async (customerValues: IOrder["customer"]) => {
    if (!isCheckboxChecked) {
      toast.error("Будь ласка, погодьтесь із публічною офертою")
      return
    }
    if (!customerValues.city || !customerValues.warehouse) {
      toast.error("Будь ласка, виберіть місто та відділення")
      return
    }
    const orderedGoods = cart.map((item: ICartItem) => ({
      ...item.good,
      quantity: item.quantity
    }))

    if (orderedGoods.length === 0) {
      toast.error("Кошик порожній. Додайте товари перед оформленням замовлення.")
      return
    }

    const totalPrice = orderedGoods.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0
    )

    const orderData: IOrder = {
      number: generatedNumber,
      customer: customerValues,
      orderedGoods: cart.map((item: ICartItem) => ({
        ...item.good,
        quantity: item.quantity
      })),
      totalPrice,
      status: "Новий"
    }

    // const mokbody = {
    //   merchantAccount: "test_merch_n1",
    //   merchantDomainName: "www.market.ua",
    //   merchantTransactionSecureType: "AUTO",
    //   merchantSignature: "2437af4f0c0c6130fc20611f0241e476",
    //   orderReference: "DH1746466948",
    //   orderDate: "1415379863",
    //   amount: "1547.36",
    //   currency: "UAH",
    //   productName: ["Процесор Intel Core i5-4670 3.4GHz", "Kingston DDR3-1600 4096MB PC3-12800"],
    //   productPrice: ["1000", "547.36"],
    //   productCount: ["1", "1"],
    //   clientFirstName: "Василь",
    //   clientLastName: "Пібаренко",
    //   clientAddress: "пр. Науки, 12",
    //   clientCity: "Дніпро",
    //   clientEmail: "some@mail.com",
    //   defaultPaymentSystem: "card"
    // }

    if (orderData.customer.payment === PaymentMethod.WayForPay) {
      try {
        const result = await createWayForPayInvoice(orderData)
        if (result.url) {
          window.location.href = result.url
        } else {
          toast.error("Не вдалося створити рахунок. Спробуйте ще раз.")
        }
      } catch (error) {
        console.error("WayForPay error:", error)
        toast.error("Помилка при створенні платежу")
      }
    } else {
      const [adminEmail, customerEmail, orderResult, customerResult] = await Promise.all([
        sendAdminEmail(orderData),
        sendCustomerEmail(orderData),
        addOrder(orderData),
        addCustomer(orderData.customer)
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
        localStorage.clear()
        push("/")
      }
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
              initialValues={initialValues}
              onSubmit={handleSubmit}
              // validationSchema={customerFormSchema}
            >
              {({ values, errors, touched }) => (
                <Form className="flex flex-col space-y-6">
                  <FormEffects />
                  <CustomerFields errors={errors} touched={touched} />
                  <div className="flex items-center">
                    <input
                      id="termsCheckbox"
                      type="checkbox"
                      checked={isCheckboxChecked}
                      onChange={e => setIsCheckboxChecked(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="termsCheckbox">
                      {" "}
                      <PublicOfferSummary />
                    </label>
                  </div>
                  <Button type="submit" label="Відправити" disabled={isLoading} />
                </Form>
              )}
            </Formik>
          </div>

          {/* Товари у кошику */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <h3 className="text-2xl font-semibold mb-4">Ваші товари</h3>
            {cart.length > 0 ? (
              cart.map((item: ICartItem, i) => (
                <OrderGood key={item.good._id || i} good={item.good} quantity={item.quantity} />
              ))
            ) : (
              <div>Кошик порожній...</div>
            )}
            <div className="text-xl font-bold mt-4">Загальна сума: {totalPrice} грн</div>
            <p className="text-sm italic">
              {totalPrice >= 1000
                ? "🚚 Доставка безкоштовна"
                : "🚚 Вартість доставки: за тарифами перевізника"}
            </p>{" "}
          </div>
        </div>
      </div>
    </div>
  )
}

// Custom hook for city selection
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

      const normalizedQuery = (searchQuery || "").trim().toLowerCase()

      const filtered = allCities
        .filter((city: any) => {
          const description = (city?.description || "").trim().toLowerCase()
          return description.includes(normalizedQuery)
        })
        .map((city: any) => city.description || "")

      setFilteredCities(filtered)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, allCities])

  const handleSelectCity = (city: string) => {
    setFieldValue("city", city)
    setSearchQuery(city)
    setTimeout(() => {
      setFilteredCities([])
    }, 0)
  }

  return { filteredCities, searchQuery, setSearchQuery, handleSelectCity }
}

const FormEffects = () => {
  const { values, setFieldValue } = useFormikContext<FormikCustomerValues>()

  const { warehouses } = useWarehouses(values?.city)

  useEffect(() => {
    if (warehouses.length && !values?.warehouse) {
      setFieldValue("warehouse", warehouses[0].Description)
    }
  }, [warehouses, setFieldValue, values?.warehouse])

  useEffect(() => {
    sessionStorage.setItem(storageKeys.customer, JSON.stringify(values))
  }, [values])

  return null
}

const CustomerFields = ({ touched, errors }: { touched: any; errors: any }) => {
  const { values, setFieldValue } = useFormikContext<FormikCustomerValues>()
  const { warehouses, isWarehousesLoading } = useWarehouses(values.city)
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
      id: "payment",
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
      <h3 className="text-xl font-semibold">Замовник</h3>
      {customerInputs.map((input, i) => (
        <FormField key={i} item={input} setFieldValue={setFieldValue} />
      ))}

      <div className="relative mb-4">
        <Field name="city">
          {({ field }: any) => (
            <input
              {...field}
              value={searchQuery}
              onChange={e => handleChange(e, field)}
              placeholder=" "
              className={`text-primaryTextColor peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
        ${errors?.city && touched?.city ? "border-rose-500" : "border-neutral-300"}
        ${errors?.city && touched?.city ? "focus:border-rose-500" : "focus:border-green-500"}
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
            <ErrorMessage name="city" />
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
          name="warehouse"
          as="select"
          disabled={isWarehousesLoading}
          className={`text-primaryTextColor peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
        ${errors?.warehouse && touched?.warehouse ? "border-rose-500" : "border-neutral-300"}
        ${errors?.warehouse && touched?.warehouse ? "focus:border-rose-500" : "focus:border-green-500"}`}
        >
          {warehouses.map((wh, i) => (
            <option key={i} value={wh.Description}>
              {wh.Description}
            </option>
          ))}
        </Field>
        <label
          htmlFor="warehouse"
          className="text-primaryTextColor absolute text-md duration-150 left-3 top-3 z-9 origin-[0] transform -translate-y-3
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
        >
          Оберіть відділення
        </label>
        {touched?.warehouse && errors?.warehouse && (
          <div className="text-rose-500 text-sm mt-1">
            <ErrorMessage name="customer.warehouse" />
          </div>
        )}
      </div>
      {Object.keys(errors).length > 0 && (
        <pre className="text-red-500">{JSON.stringify(errors, null, 2)}</pre>
      )}
    </>
  )
}

export default OrderPage
