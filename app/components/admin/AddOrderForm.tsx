"use client"

import { addOrderAction, updateOrder } from "@/actions/orders"
import { orderFormSchema } from "@/helpers/index"
import { useWarehouses } from "@/hooks/useWarehouses"
import { IGood, IOrder } from "@/types/index"
import { PaymentMethod } from "@/types/paymentMethod"
import { Field, FieldArray, Form, Formik, useFormikContext } from "formik"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import FormField from "../input/FormField"
import Button from "../ui/Button"

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
      city: order?.customer.city || "",
      warehouse: order?.customer.warehouse || "",
      payment: order?.customer.payment || PaymentMethod.CashOnDelivery
    },
    orderedGoods: order?.orderedGoods || [],
    totalPrice: order?.totalPrice || 0,
    status: order?.status || "Новий"
  }

  const handleSubmit = async (values: InitialStateType) => {
    console.log("Форма сабмітнулася з цими даними:", values)

    try {
      setIsLoading(true)

      const preparedOrder = {
        ...values,
        customer: {
          ...values.customer,
          name: `${values.customer.name} ${values.customer.surname}`
        }
      }
      console.log("Форма сабмітнулася з цими даними:", preparedOrder)

      const result = isUpdating
        ? await updateOrder({ ...preparedOrder, _id: order?._id })
        : await addOrderAction(preparedOrder)

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
    <div className="  justify-center items-center p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl mb-4 font-bold">{title || "Order Form"}</h2>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={orderFormSchema}
        validateOnMount
      >
        {({ values, setFieldValue }) => (
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
            <CustomerFields />
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

// --- Допоміжні частини:

const FormEffects = () => {
  const { values, setFieldValue } = useFormikContext<IOrder>()
  const { warehouses } = useWarehouses(values.customer.city)

  const totalPrice = useMemo(
    () =>
      values.orderedGoods.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0),
    [values.orderedGoods]
  )

  useEffect(() => {
    if (warehouses.length) {
      setFieldValue("customer.warehouse", warehouses[0].Description)
    }
  }, [warehouses, setFieldValue])

  useEffect(() => {
    setFieldValue("totalPrice", totalPrice, false)
  }, [totalPrice, setFieldValue])

  return null
}

const CustomerFields = () => {
  const { values, setFieldValue, errors, touched } = useFormikContext<IOrder>()
  const { warehouses, isWarehousesLoading } = useWarehouses(values.customer.city)

  const customerInputs = [
    { name: "customer.name", type: "text", id: "customer.name", label: "І'мя" },
    { name: "customer.surname", type: "text", id: "customer.surname", label: "Прізвище" },
    { name: "customer.email", type: "email", id: "customer.email", label: "Email" },
    { name: "customer.phone", type: "tel", id: "customer.phone", label: "Телефон" },
    {
      id: "customer.payment",
      label: "Оберіть спосіб оплати",
      options: Object.values(PaymentMethod).map(method => ({ value: method, label: method })),
      type: "select"
    }
  ]

  return (
    <>
      <h3 className="text-xl font-semibold">Замовник</h3>
      {customerInputs.map((input, i) => (
        <FormField key={i} item={input} setFieldValue={setFieldValue} />
      ))}

      <Field name="customer.city">
        {({ field }: any) => (
          <input
            {...field}
            placeholder="Введіть назву міста"
            className="w-full p-4 border-2 rounded-md mb-4"
          />
        )}
      </Field>

      <Field
        name="customer.warehouse"
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

  return (
    <>
      <h3 className="text-xl font-semibold">Товари у замовленні</h3>
      <FieldArray
        name="orderedGoods"
        render={({ remove }) => (
          <div>
            {values.orderedGoods.map((good, i) => (
              <div key={good._id} className="border p-4 mb-4 flex items-center gap-4">
                <Image
                  src={good?.src?.[0] || "/placeholder.png"}
                  alt="item"
                  width={150}
                  height={150}
                  className="object-cover"
                />
                <span className="flex-1">{good.title}</span>
                <Button
                  type="button"
                  label="-"
                  onClick={() =>
                    setFieldValue(
                      `orderedGoods.${i}.quantity`,
                      Math.max((good.quantity || 1) - 1, 1)
                    )
                  }
                />
                <span>{good.quantity}</span>
                <Button
                  type="button"
                  label="+"
                  onClick={() =>
                    setFieldValue(`orderedGoods.${i}.quantity`, (good.quantity || 0) + 1)
                  }
                />
                <span>Ціна: {good.price} грн</span>
                <span>Сума: {(good.price || 0) * (good.quantity || 1)} грн</span>
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
        <select
          className="w-full p-2 border rounded-md"
          onChange={e => {
            const selectedGood = goods?.find(g => g._id === e.target.value)
            if (!selectedGood) return
            if (values.orderedGoods.some(item => item._id === selectedGood._id)) {
              toast.warning("Цей товар вже додано!")
              return
            }
            setFieldValue("orderedGoods", [
              ...values.orderedGoods,
              { ...selectedGood, quantity: 1 }
            ])
            setShowSelect(false)
          }}
        >
          <option value="">Оберіть товар</option>
          {goods?.map(g => (
            <option key={g._id} value={g._id}>
              {`${g.title} - ${g.brand} - ${g.model}`}
            </option>
          ))}
        </select>
      )}
    </>
  )
}
