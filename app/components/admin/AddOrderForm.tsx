"use client"

import { getData } from "@/actions/nova"
import { orderFormSchema } from "@/helpers/index"
import { useAddData } from "@/hooks/useAddData"
import { useUpdateData } from "@/hooks/useUpdateData"
import { IGood, IOrder } from "@/types/index"
import { PaymentMethod } from "@/types/paymentMethod"
import { Field, FieldArray, Formik, FormikState } from "formik"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import Button from "../Button"
import { Icon } from "../Icon"
import FormField from "../input/FormField"
import CustomButton from "./CustomFormikButton"

interface InitialStateType extends Omit<IOrder, "_id"> {}

interface ResetFormProps {
  resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

interface OrderFormProps {
  order?: IOrder
  title?: string
  action: (values: IOrder) => Promise<{ success: boolean; message: string }>
}

const statusList = [
  { id: 1, title: "Новий" },
  { id: 2, title: "Опрацьовується" },
  { id: 3, title: "Оплачений" },
  { id: 4, title: "На відправку" },
  { id: 5, title: "Закритий" }
]

const OrderForm: React.FC<OrderFormProps> = ({ order, action, title }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [warehouses, setWarehouses] = useState<
    {
      Ref: string
      Description: string
    }[]
  >([])
  const [city, setCity] = useState(order?.customer.city || "Київ")

  const [totalPrice, setTotalPrice] = useState(0)

  const { push } = useRouter()
  const isUpdating = Boolean(order?._id)
  const [name = "", surname = ""] = (order?.customer.name || "").split(" ")

  const addOrderMutation = useAddData(action, "orders")
  const updateOrderMutation = useUpdateData(action, "orders")

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
    orderedGoods: order?.orderedGoods || [
      {
        _id: "",
        category: "",
        src: [],
        brand: "",
        model: "",
        vendor: "",
        title: "",
        description: "",
        price: 0,
        isAvailable: false,
        isCompatible: false,
        compatibility: "",
        quantity: 0
      }
    ],
    totalPrice: order?.totalPrice || 0,
    status: order?.status || "Новий"
  }

  const customerInputs = [
    {
      name: "customer.name",
      type: "text",
      id: "customer.name",
      label: `І'мя`
    },
    {
      name: "customer.surname",
      type: "text",
      id: "customer.surname",
      label: `Прізвище`
    },
    {
      name: "customer.email",
      type: "email",
      id: "customer.email",
      label: `Email`
    },
    {
      name: "customer.phone",
      type: "tel",
      id: "customer.phone",
      label: `Телефон`
    },

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

  const calculateTotalPrice = useCallback((orderedGoods: IGood[]): number => {
    return orderedGoods.reduce((total, item) => total + item.price * (item.quantity || 1), 0)
  }, [])

  useEffect(() => {
    setTotalPrice(calculateTotalPrice(initialValues.orderedGoods))
  }, [initialValues.orderedGoods, calculateTotalPrice])

  useEffect(() => {
    if (city) {
      const fetchAndSetWarehouses = async () => {
        try {
          const fetchedWarehouses = await fetchWarehouses(city)
          setWarehouses(fetchedWarehouses)
        } catch (error) {
          console.error("Error fetching warehouses:", error)
        }
      }
      fetchAndSetWarehouses()
    }
  }, [city])

  const handleQuantityChange = (
    index: number,
    change: number,
    values: InitialStateType,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    const newQuantity = Math.max((values.orderedGoods[index].quantity || 0) + change, 1)
    setFieldValue(`orderedGoods.${index}.quantity`, newQuantity)

    const updatedGoods = [...values.orderedGoods]
    updatedGoods[index].quantity = newQuantity
    setTotalPrice(calculateTotalPrice(updatedGoods))
  }

  const handleSubmit = async (values: IOrder, { resetForm }: ResetFormProps) => {
    try {
      setIsLoading(true)

      const newOrderData = {
        ...values,
        totalPrice,
        customer: {
          ...values.customer,
          name: `${values.customer.name} ${values.customer.surname}`
        }
      }

      const updateOrderData = isUpdating ? { ...newOrderData, _id: order?._id } : {}

      const result = isUpdating
        ? await updateOrderMutation.mutateAsync(updateOrderData)
        : await addOrderMutation.mutateAsync(newOrderData)

      // if (!result?.success) {
      // 	toast.error('Something went wrong')
      // 	return
      // }

      resetForm()
      toast.success(isUpdating ? "Замовлення оновлено!" : "Нове замовлення додано!")
      push("/admin/orders")
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An unknown error occurred"
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
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={orderFormSchema}
      >
        {({ values, setFieldValue, errors, touched }) => {
          return (
            <>
              {/* Form content */}
              <h3 className="text-xl font-semibold">Статус замовлення</h3>
              <FormField
                item={{
                  id: "status",
                  label: "Статус",
                  type: "select",
                  required: true,
                  options: statusList.map(status => ({
                    value: status.title,
                    label: status.title
                  }))
                }}
                setFieldValue={setFieldValue}
              />

              <h3 className="text-xl font-semibold">Замовник</h3>
              {customerInputs.map((item, i) => (
                <FormField key={i} item={item} setFieldValue={setFieldValue} />
              ))}
              <div className="w-full mb-4">
                {/* City Input */}
                <div className="relative">
                  <Field
                    id="customer.city"
                    type="text"
                    value={values.customer.city}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("customer.city", e.target.value)
                      setCity(e.target.value)
                    }}
                    className={`peer w-full p-4 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
        ${
          errors.customer?.city && touched.customer?.city ? "border-rose-500" : "border-neutral-300"
        }
        ${
          errors.customer?.city && touched.customer?.city
            ? "focus:border-rose-500"
            : "focus:border-green-500"
        }
      `}
                  />
                  <label
                    htmlFor="customer.city"
                    className="text-primaryTextColor absolute text-md duration-150 left-3 top-3 z-10 origin-[0] transform -translate-y-3
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
                  >
                    Введіть назву міста
                  </label>
                </div>

                {/* Warehouse Select */}
                <div className="relative mt-4">
                  <Field
                    as="select"
                    id="customer.warehouse"
                    name="customer.warehouse"
                    value={values.customer.warehouse}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFieldValue("customer.warehouse", e.target.value)
                    }
                    className={`peer w-full p-4 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
        ${
          errors.customer?.warehouse && touched.customer?.warehouse
            ? "border-rose-500"
            : "border-neutral-300"
        }
        ${
          errors.customer?.warehouse && touched.customer?.warehouse
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
                    {values?.orderedGoods.map((good, index) => (
                      <div
                        key={index}
                        className="border p-4 mb-4 flex items-center gap-4 justify-between"
                      >
                        {/* Image container */}
                        <div className="flex-shrink-0 w-[150px]">
                          <Image
                            src={good.src[0] || "/placeholder.png"}
                            alt="item_photo"
                            width={150}
                            height={150}
                            className="object-cover"
                            priority={true}
                          />
                        </div>

                        {/* Item title */}
                        <div className="flex-1 text-center">
                          <span>{good?.title || "Unnamed Item"}</span>
                        </div>

                        {/* Quantity decrement button */}
                        <div className="w-[30px] flex justify-center">
                          <Button
                            type="button"
                            label="-"
                            onClick={() => handleQuantityChange(index, -1, values, setFieldValue)}
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
                            onClick={() => handleQuantityChange(index, +1, values, setFieldValue)}
                          />
                        </div>

                        {/* Price per unit */}
                        <div className="w-[100px] text-center">
                          <span>Ціна за 1: {good.price}</span>
                        </div>

                        {/* Total price for the item */}
                        <div className="w-[120px] text-center">
                          <span>Ціна за Товар: {good.price * (good?.quantity || 1)}</span>
                        </div>

                        {/* Remove button */}
                        <div className="flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              remove(index)
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
              <div className="my-4 ">
                <h3 className="text-xl font-semibold">Загальна ціна: {totalPrice} грн</h3>
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
