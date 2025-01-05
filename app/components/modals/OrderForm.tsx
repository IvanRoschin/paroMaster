"use client"

import { getGoodById } from "@/actions/goods"
import { getData } from "@/actions/nova"
import { orderFormSchema } from "@/helpers/index"
import { generateOrderNumber } from "@/helpers/orderNumber"
import { ICustomer, IGood, IOrder } from "@/types/index"
import { PaymentMethod } from "@/types/paymentMethod"
import { useShoppingCart } from "app/context/ShoppingCartContext"
import { Field, Formik, FormikState } from "formik"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import CustomButton from "../admin/CustomFormikButton"
import FormField from "../input/FormField"

interface InitialStateType extends Omit<IOrder, "_id"> {}

interface ResetFormProps {
  resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void
}

type Props = {
  title: string
  customer?: ICustomer
  handleSubmit: (values: IOrder, { resetForm }: ResetFormProps) => void
}

const OrderForm = ({ title, customer, handleSubmit }: Props) => {
  const [warehouses, setWarehouses] = useState<{ Ref: string; Description: string }[]>([])
  const [city, setCity] = useState("Київ")
  const [orderedGoods, setOrderedGoods] = useState<IGood[]>([])
  const [orderNumber, setOrderNumber] = useState<string>("")
  const [totalPrice, setTotalPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const { cartItemsId, closeOrderModal, resetCart, getItemQuantity } = useShoppingCart()
  const { push } = useRouter()

  const fetchWarehouses = async (city: string) => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (city) {
          const fetchedWarehouses = await fetchWarehouses(city)
          setWarehouses(fetchedWarehouses)
        }

        const retrievedGoods = await Promise.all(
          cartItemsId.map(async item => {
            const good = await getGoodById(item.id)
            const quantity = getItemQuantity(item.id)
            return good ? { ...good, quantity } : null
          })
        )

        const totalAmount = retrievedGoods.reduce((total, item) => {
          const quantity = item?.quantity || 0
          return total + quantity
        }, 0)

        setOrderedGoods(retrievedGoods.filter(item => item !== null) as IGood[])
        setTotalPrice(totalAmount)

        const generatedOrderNumber = generateOrderNumber()
        setOrderNumber(generatedOrderNumber)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [city, cartItemsId, getItemQuantity])

  const initialValues: InitialStateType = {
    number: orderNumber,
    customer: {
      name: "",
      surname: "",
      email: "",
      phone: "+380",
      city: "Київ",
      warehouse: "",
      payment: PaymentMethod.CashOnDelivery
    },
    orderedGoods,
    totalPrice,
    status: "Новий"
  }

  const customerInputs = [
    { name: "customer.name", type: "text", id: "customer.name", label: "Ім'я", required: true },
    {
      name: "customer.surname",
      type: "text",
      id: "customer.surname",
      label: "Прізвище",
      required: true
    },
    { name: "customer.email", type: "email", id: "customer.email", label: "Email", required: true },
    { name: "customer.phone", type: "tel", id: "customer.phone", label: "Телефон", required: true },
    { name: "customer.city", type: "text", id: "customer.city", label: "Місто", required: true },
    {
      id: "customer.warehouse",
      label: "Оберіть відділення",
      options: warehouses.map(warehouse => ({
        value: warehouse.Description,
        label: warehouse.Description
      })),
      type: "select"
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

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={orderFormSchema}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          {customerInputs.map((item, i) => (
            <div className="w-full mb-4">
              <FormField key={i} item={item} setFieldValue={setFieldValue} />
            </div>
          ))}

          <div className="w-full mb-4">
            <Field
              id="customer.city"
              type="text"
              value={values.customer.city}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFieldValue("customer.city", e.target.value)
                setCity(e.target.value)
              }}
              className={`peer w-full p-4 font-light bg-white border-2 rounded-md outline-none transition ${
                errors.customer?.city && touched.customer?.city
                  ? "border-rose-500"
                  : "border-neutral-300"
              } ${
                errors.customer?.city && touched.customer?.city
                  ? "focus:border-rose-500"
                  : "focus:border-green-500"
              }`}
            />
          </div>

          <div className="flex justify-end">
            <CustomButton type="submit" label="Створити замовлення" disabled={isLoading} />
          </div>
        </div>
      )}
    </Formik>
  )
}

export default OrderForm
