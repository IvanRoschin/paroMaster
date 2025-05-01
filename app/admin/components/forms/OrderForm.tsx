"use client"

import { ErrorMessage, Field, FieldArray, Form, Formik, useFormikContext } from "formik"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { addOrder, updateOrder } from "@/actions/orders"
import { Button, FormField } from "@/components/index"
import { orderFormSchema } from "@/helpers/index"
import { useCities, useWarehouses } from "@/hooks/index"
import { IGood, IOrder } from "@/types/index"
import { PaymentMethod } from "@/types/paymentMethod"

interface InitialStateType extends Omit<IOrder, "_id"> {}

interface OrderFormProps {
  order?: IOrder
  title?: string
  goods?: IGood[]
}

const statusList = [
  { id: 1, title: "Новий" },
  { id: 2, title: "Опрацьовується" },
  { id: 3, title: "Оплачений" },
  { id: 4, title: "На відправку" },
  { id: 5, title: "Закритий" }
]

const OrderForm = ({ order, title, goods }: OrderFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showSelect, setShowSelect] = useState(false)
  const { push } = useRouter()
  const isUpdating = Boolean(order?._id)

  const [name = "", surname = ""] = (order?.customer.name || "").split(" ")

  const initialValues: InitialStateType = {
    number: order?.number || "",
    customer: {
      name: name,
      surname: surname,
      email: order?.customer.email || "",
      phone: order?.customer.phone || "+380",
      city: order?.customer.city || "Київ",
      warehouse: order?.customer.warehouse || "",
      payment: order?.customer.payment || PaymentMethod.CashOnDelivery
    },
    orderedGoods: order?.orderedGoods || [],
    totalPrice: order?.totalPrice || 0,
    status: order?.status || "Новий"
  }

  const handleSubmit = async (values: InitialStateType) => {
    try {
      setIsLoading(true)

      const preparedOrder = {
        ...values,
        customer: {
          ...values.customer,
          name: `${values.customer.name} ${values.customer.surname}`
        }
      }
      const result = isUpdating
        ? await updateOrder({ ...preparedOrder, _id: order?._id })
        : await addOrder(preparedOrder)

      if (result.success) {
        toast.success(isUpdating ? "Замовлення оновлено!" : "Нове замовлення додано!")
        push("/admin/orders")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Невідома помилка")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="justify-center items-center p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl mb-4 font-bold">{title || "Order Form"}</h2>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={orderFormSchema}
        validateOnMount
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            <FormEffects />
            <FormField
              item={{
                id: "status",
                label: "Статус замовлення",
                type: "select",
                required: true,
                options: statusList.map(({ title }) => ({ value: title, label: title }))
              }}
              setFieldValue={setFieldValue}
            />
            <CustomerFields city={values.customer.city} errors={errors} touched={touched} />
            <GoodsFields goods={goods} showSelect={showSelect} setShowSelect={setShowSelect} />

            <div className="my-4">
              <h3 className="text-xl font-semibold">Загальна ціна: {values.totalPrice} грн</h3>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                label={order ? "Оновити замовлення" : "Створити замовлення"}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default OrderForm

const FormEffects = () => {
  const { values, setFieldValue } = useFormikContext<InitialStateType>()
  const { warehouses } = useWarehouses(values.customer.city)

  const totalPrice = useMemo(
    () =>
      values.orderedGoods.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0),
    [values.orderedGoods]
  )

  useEffect(() => {
    if (warehouses.length && !values.customer.warehouse) {
      setFieldValue("customer.warehouse", warehouses[0].Description)
    }
  }, [warehouses, setFieldValue, values.customer.warehouse])

  useEffect(() => {
    setFieldValue("totalPrice", totalPrice, false)
  }, [totalPrice, setFieldValue])

  return null
}

// Custom hook for city selection logic
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
    setFieldValue("customer.city", city)
    setSearchQuery(city)
    setTimeout(() => {
      setFilteredCities([])
    }, 0)
  }

  return { filteredCities, searchQuery, setSearchQuery, handleSelectCity }
}

const CustomerFields = ({ city, touched, errors }: { city: string; touched: any; errors: any }) => {
  const { values, setFieldValue } = useFormikContext<InitialStateType>()
  const { warehouses, isWarehousesLoading } = useWarehouses(city)
  const [showDropdown, setShowDropdown] = useState(false)

  const { filteredCities, searchQuery, setSearchQuery, handleSelectCity } = useCitySelection(
    values.customer.city,
    setFieldValue
  )

  const customerInputs = [
    { name: "customer.name", type: "text", id: "customer.name", label: "Ім'я" },
    { name: "customer.surname", type: "text", id: "customer.surname", label: "Прізвище" },
    { name: "customer.email", type: "email", id: "customer.email", label: "Email" },
    { name: "customer.phone", type: "tel", id: "customer.phone", label: "Телефон" },
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
      <h3 className="text-xl font-semibold">Замовник</h3>
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
        {touched.customer?.city && errors.customer?.city && (
          <div className="text-rose-500 text-sm mt-1">
            <ErrorMessage name="customer.city" />
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
        {touched.customer?.warehouse && errors.customer?.warehouse && (
          <div className="text-rose-500 text-sm mt-1">
            <ErrorMessage name="city" />
          </div>
        )}
      </div>
    </>
  )
}

interface GoodsFieldsProps {
  goods?: IGood[]
  showSelect: boolean
  setShowSelect: (value: boolean) => void
}

const GoodsFields = ({ goods, showSelect, setShowSelect }: GoodsFieldsProps) => {
  const { values, setFieldValue } = useFormikContext<IOrder>()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredGoods = useMemo(() => {
    if (!searchQuery.trim()) return goods || []
    return (
      goods?.filter(good =>
        `${good.title} ${good.brand} ${good.model}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) || []
    )
  }, [searchQuery, goods])

  const handleSelectGood = (good: IGood) => {
    if (values.orderedGoods.some(item => item._id === good._id)) {
      toast.warning("Цей товар вже додано!")
      return
    }
    setFieldValue("orderedGoods", [...values.orderedGoods, { ...good, quantity: 1 }])
    setSearchQuery("")
    setShowSelect(false)
  }

  return (
    <>
      <h3 className="text-xl font-semibold">Товари у замовленні</h3>
      <FieldArray
        name="orderedGoods"
        render={({ remove }) => (
          <div>
            {values.orderedGoods.map((item, i) => (
              <div key={item._id} className="border p-4 mb-4 flex items-center gap-4">
                <Image
                  src={item?.src?.[0] || "/placeholder.png"}
                  alt="item"
                  width={150}
                  height={150}
                  className="object-cover"
                />
                <span className="flex-1">{item.title}</span>
                <Button
                  type="button"
                  label="-"
                  onClick={() =>
                    setFieldValue(
                      `orderedGoods.${i}.quantity`,
                      Math.max((item.quantity || 1) - 1, 1)
                    )
                  }
                />
                <span>{item.quantity}</span>
                <Button
                  type="button"
                  label="+"
                  onClick={() =>
                    setFieldValue(`orderedGoods.${i}.quantity`, (item.quantity || 0) + 1)
                  }
                />
                <span>Ціна: {item.price} грн</span>
                <span>Сума: {(item.price || 0) * (item.quantity || 1)} грн</span>
                <Button type="button" label="Видалити" onClick={() => remove(i)} />
              </div>
            ))}
          </div>
        )}
      />

      <div className="flex justify-between mt-4 mb-4">
        <Button type="button" label="Додати товар" onClick={() => setShowSelect(true)} />
      </div>

      {showSelect && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Пошук товару за назвою, брендом чи моделлю"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-md mb-2"
          />

          <div className="max-h-60 overflow-y-auto border rounded-md">
            {filteredGoods.map(good => (
              <div
                key={good._id}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSelectGood(good)}
              >
                {good.title} - {good.brand} - {good.model}
              </div>
            ))}
            {!filteredGoods.length && <div className="p-2 text-gray-500">Нічого не знайдено</div>}
          </div>
        </div>
      )}
    </>
  )
}
