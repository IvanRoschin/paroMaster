"use client"

import { getData } from "@/actions/nova"
import { orderFormSchema } from "@/helpers/index"
import { useAddData } from "@/hooks/useAddData"
import { useUpdateData } from "@/hooks/useUpdateData"
import { IGood, IOrder } from "@/types/index"
import { PaymentMethod } from "@/types/paymentMethod"
import { Field, FieldArray, Formik, FormikState, useFormikContext } from "formik"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Icon } from "../Icon"
import FormField from "../input/FormField"
import Button from "../ui/Button"
import CustomButton from "./CustomFormikButton"

interface InitialStateType extends Omit<IOrder, "_id"> {}

interface ResetFormProps {
  resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface OrderFormProps {
  order?: IOrder
  title?: string
  goods?: IGood[]
  action: (values: IOrder) => Promise<{ success: boolean; message: string }>
}

const statusList = [
  { id: 1, title: "Новий" },
  { id: 2, title: "Опрацьовується" },
  { id: 3, title: "Оплачений" },
  { id: 4, title: "На відправку" },
  { id: 5, title: "Закритий" }
]

const OrderForm: React.FC<OrderFormProps> = ({ order, action, title, goods }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [warehouses, setWarehouses] = useState<
    {
      Ref: string
      Description: string
    }[]
  >([])

  const [showSelect, setShowSelect] = useState(false)
  const [city, setCity] = useState(order?.customer.city || "Київ")

  const { push } = useRouter()
  const isUpdating = Boolean(order?._id)
  const [name = "", surname = ""] = (order?.customer.name || "").split(" ")

  const addOrderMutation = useAddData(action, ["goods"])
  const updateOrderMutation = useUpdateData(action, ["goods"])

  const initialValues: InitialStateType = {
    number: order?.number || "",
    customer: {
      name: name || "",
      surname: surname || "",
      email: order?.customer.email || "",
      phone: order?.customer.phone || "+380",
      city: order?.customer.city || "",
      warehouse: order?.customer.warehouse || "Київ",
      payment: order?.customer.payment || PaymentMethod.CashOnDelivery
    },
    orderedGoods: order?.orderedGoods || [],
    totalPrice: order?.totalPrice || 0,
    status: order?.status || "Новий"
  }

  const customerInputs = [
    { name: "customer.name", type: "text", id: "customer.name", label: `І'мя` },
    { name: "customer.surname", type: "text", id: "customer.surname", label: `Прізвище` },
    { name: "customer.email", type: "email", id: "customer.email", label: `Email` },
    { name: "customer.phone", type: "tel", id: "customer.phone", label: `Телефон` },
    {
      id: "customer.payment",
      label: "Оберіть спосіб оплати",
      options: Object.values(PaymentMethod).map(method => ({ value: method, label: method })),
      type: "select"
    }
  ]

  const fetchWarehouses = async (city: string): Promise<{ Ref: string; Description: string }[]> => {
    try {
      const response = await getData({
        apiKey: process.env.NOVA_API,
        modelName: "Address",
        calledMethod: "getWarehouses",
        methodProperties: { CityName: city, Limit: "50", Language: "UA" }
      })
      return response.data.data || []
    } catch (error) {
      console.error("Error fetching warehouses:", error)
      return []
    }
  }

  const calculateTotalPrice = (orderedGoods: IOrder["orderedGoods"]): number => {
    return orderedGoods.reduce(
      (total, item) => total + (item?.price ?? 0) * (item?.quantity ?? 1),
      0
    )
  }

  const FormEffects = () => {
    const { values, setFieldValue } = useFormikContext<IOrder>()

    const [prevTotalPrice, setPrevTotalPrice] = useState<number>(values.totalPrice)

    const totalPrice = useMemo(
      () => calculateTotalPrice(values.orderedGoods),
      [values.orderedGoods]
    )

    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        if (city && city !== order?.customer.city) fetchWarehouses(city).then(setWarehouses)
      }, 500)

      return () => clearTimeout(delayDebounceFn)
    }, [])

    useEffect(() => {
      if (warehouses.length > 0) {
        setFieldValue("customer.warehouse", warehouses[0].Description)
      }
    }, [setFieldValue])

    useEffect(() => {
      if (values.totalPrice !== totalPrice && totalPrice !== prevTotalPrice) {
        setFieldValue("totalPrice", totalPrice, false)
        setPrevTotalPrice(totalPrice)
      }
    }, [totalPrice, values.totalPrice, setFieldValue, prevTotalPrice])

    return null
  }

  const handleSubmit = async (values: IOrder) => {
    try {
      setIsLoading(true)

      let newOrderData = {
        ...values,
        customer: {
          ...values.customer,
          name: `${values.customer.name} ${values.customer.surname}`
        },
        totalPrice: values.totalPrice
      }

      const updateOrderData = isUpdating ? { ...newOrderData, _id: order?._id } : {}

      const result = isUpdating
        ? await updateOrderMutation.mutateAsync(updateOrderData)
        : await addOrderMutation.mutateAsync(newOrderData)

      if (result.success) {
        toast.success(isUpdating ? "Замовлення оновлено!" : "Нове замовлення додано!")
        push("/admin/orders")
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Невідома помилка"
      toast.error(errorMsg)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl mb-4 font-bold">{title || "Order Form"}</h2>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={orderFormSchema}
      >
        {({ values, setFieldValue, errors, touched }) => {
          return (
            <>
              <FormEffects />
              <h3 className="text-xl font-semibold">Статус замовлення</h3>
              <FormField
                item={{
                  id: "status",
                  label: "Статус",
                  type: "select",
                  required: true,
                  options: statusList.map(status => ({ value: status.title, label: status.title }))
                }}
                setFieldValue={setFieldValue}
              />

              <h3 className="text-xl font-semibold">Замовник</h3>
              {customerInputs.map((item, i) => (
                <FormField key={i} item={item} setFieldValue={setFieldValue} />
              ))}

              <div className="w-full mb-4">
                <div className="relative">
                  <Field
                    id="customer.city"
                    type="text"
                    value={values.customer.city}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value
                      setFieldValue("customer.city", value)
                      setTimeout(() => setCity(value), 300)
                    }}
                    className={`peer w-full p-4 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
                      ${errors.customer?.city && touched.customer?.city ? "border-rose-500" : "border-neutral-300"}
                      ${errors.customer?.city && touched.customer?.city ? "focus:border-rose-500" : "focus:border-green-500"}`}
                  />
                  <label
                    htmlFor="customer.city"
                    className="text-primaryTextColor absolute text-md duration-150 left-3 top-3 z-10 origin-[0] transform -translate-y-3
                      peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
                  >
                    Введіть назву міста
                  </label>
                </div>

                <div className="relative mt-4">
                  <Field
                    as="select"
                    id="customer.warehouse"
                    name="customer.warehouse"
                    value={values.customer.warehouse}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("customer.warehouse", e.target.value)
                    }}
                    className={`peer w-full p-4 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
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
                    className="text-primaryTextColor absolute text-md duration-150 left-3 top-3 z-10 origin-[0] transform -translate-y-3
                      peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
                  >
                    Оберіть відділення
                  </label>
                </div>
              </div>

              <h3 className="text-xl font-semibold">Товари у замовленні</h3>
              <FieldArray
                name="orderedGoods"
                render={({ remove }) => (
                  <div>
                    {values?.orderedGoods.map((good, i) => (
                      <div
                        key={good._id}
                        className="border p-4 mb-4 flex items-center gap-4 justify-between"
                      >
                        {/* Image container */}
                        <div className="flex-shrink-0 w-[150px]">
                          <Image
                            src={good?.src?.[0] || "/placeholder.png"}
                            alt="item_photo"
                            width={150}
                            height={150}
                            className="object-cover"
                            priority={true}
                          />
                        </div>

                        {/* Item title */}
                        <div className="flex-1 text-center">
                          <span>{good.title || "Unnamed Item"}</span>
                        </div>

                        {/* Quantity decrement button */}
                        <div className="w-[30px] flex justify-center">
                          <Button
                            type="button"
                            label="-"
                            onClick={() => {
                              const quantity = Math.max((good.quantity || 1) - 1, 1)
                              setFieldValue(`orderedGoods.${i}.quantity`, quantity)
                            }}
                            disabled={good?.quantity !== undefined && good?.quantity <= 1}
                          />
                        </div>

                        {/* Quantity display */}
                        <div className="w-[40px] text-center">
                          <span>{good.quantity || 0}</span>
                        </div>

                        {/* Quantity increment button */}
                        <div className="w-[30px] flex justify-center">
                          <Button
                            type="button"
                            label="+"
                            onClick={() => {
                              const quantity = (good.quantity || 0) + 1
                              setFieldValue(`orderedGoods.${i}.quantity`, quantity)
                            }}
                          />
                        </div>

                        {/* Price per unit */}
                        <div className="w-[100px] text-center">
                          <span>Ціна за 1: {good.price}</span>
                        </div>

                        {/* Total price for the item */}
                        <div className="w-[120px] text-center">
                          <span>Ціна за Товар: {(good?.price ?? 0) * (good?.quantity ?? 1)}</span>
                        </div>

                        {/* Remove button */}
                        <div className="flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              remove(i)
                              setFieldValue("totalPrice", calculateTotalPrice(values.orderedGoods))
                            }}
                            className="
				flex items-center justify-center
				bg-red-600 hover:bg-red-700 focus:bg-red-700
				text-white transition-all text-sm rounded-md py-2 px-3"
                          >
                            <Icon
                              name="icon_trash"
                              className="w-5 h-5 text-white hover:text-primaryAccentColor"
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              />
              {/* Кнопка для додавання нового товару */}
              <div className="flex justify-between mt-4 mb-4">
                <Button type="button" label="Додати товар" onClick={() => setShowSelect(true)} />
              </div>
              {showSelect && (
                <div>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={e => {
                      const good = goods?.find(g => g._id === e.target.value)
                      if (!good) return
                      if (values.orderedGoods.some(item => item._id === good._id)) {
                        toast.warning("Цей товар вже додано!")
                        return
                      }

                      setFieldValue("orderedGoods", [
                        ...values.orderedGoods,
                        { ...good, quantity: 1 }
                      ])
                      setShowSelect(false)
                    }}
                  >
                    <option value="">Оберіть товар</option>
                    {goods?.map(good => (
                      <option className="py-2 text-sm" key={good._id} value={good._id}>
                        {good.title && good.brand && good.model
                          ? `${good.title} - ${good.brand} - ${good.model}`
                          : good.title || good.brand}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="my-4 ">
                <h3 className="text-xl font-semibold">Загальна ціна: {values.totalPrice} грн</h3>
              </div>
              <div className="flex justify-end">
                <CustomButton
                  type="submit"
                  label={order ? "Оновити замовлення" : "Створити замовлення"}
                  disabled={isLoading}
                />
              </div>
            </>
          )
        }}
      </Formik>
    </div>
  )
}

export default OrderForm
