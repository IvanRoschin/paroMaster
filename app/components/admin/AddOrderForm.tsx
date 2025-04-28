"use client"

import { addOrder, updateOrder } from "@/actions/orders"
import { orderFormSchema } from "@/helpers/index"
import { useCities } from "@/hooks/useCities"
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
            <CustomerFields city={values.customer.city} />
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

const CustomerFields = ({ city }: { city: string }) => {
  const { values, setFieldValue } = useFormikContext<InitialStateType>()
  const { warehouses, isWarehousesLoading } = useWarehouses(city)
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
              onChange={e => {
                const value = e.target.value
                setSearchQuery(value)
                setFieldValue(field.name, value)
              }}
              placeholder="Введіть назву міста"
              className="w-full p-4 border-2 rounded-md mb-4"
            />
          )}
        </Field>

        {filteredCities.length > 0 && (
          <div className="absolute z-10 w-full bg-white border rounded-md max-h-60 overflow-y-auto">
            {filteredCities.map(city => (
              <div
                key={city}
                onClick={() => handleSelectCity(city)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {city}
              </div>
            ))}
          </div>
        )}
      </div>

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
// "use client"

// import { addOrder, updateOrder } from "@/actions/orders"
// import { orderFormSchema } from "@/helpers/index"
// import { useCities } from "@/hooks/useCities"
// import { useWarehouses } from "@/hooks/useWarehouses"
// import { IGood, IOrder } from "@/types/index"
// import { PaymentMethod } from "@/types/paymentMethod"
// import { Field, FieldArray, Form, Formik, useFormikContext } from "formik"
// import Image from "next/image"
// import { useRouter } from "next/navigation"
// import { useEffect, useMemo, useState } from "react"
// import { toast } from "sonner"
// import FormField from "../input/FormField"
// import Button from "../ui/Button"

// interface InitialStateType extends Omit<IOrder, "_id"> {}
// interface OrderFormProps {
//   order?: IOrder
//   title?: string
//   goods?: IGood[]
// }

// const statusList = [
//   { id: 1, title: "Новий" },
//   { id: 2, title: "Опрацьовується" },
//   { id: 3, title: "Оплачений" },
//   { id: 4, title: "На відправку" },
//   { id: 5, title: "Закритий" }
// ]

// const OrderForm = ({ order, title, goods }: OrderFormProps) => {
//   const [isLoading, setIsLoading] = useState(false)
//   const [showSelect, setShowSelect] = useState(false)
//   const { push } = useRouter()
//   const isUpdating = Boolean(order?._id)

//   const [name = "", surname = ""] = (order?.customer.name || "").split(" ")
//   const initialValues: InitialStateType = {
//     number: order?.number || "",
//     customer: {
//       name: name,
//       surname: surname,
//       email: order?.customer.email || "",
//       phone: order?.customer.phone || "+380",
//       city: order?.customer.city || "Київ",
//       warehouse: order?.customer.warehouse || "",
//       payment: order?.customer.payment || PaymentMethod.CashOnDelivery
//     },
//     orderedGoods: order?.orderedGoods || [],
//     totalPrice: order?.totalPrice || 0,
//     status: order?.status || "Новий"
//   }

//   const handleSubmit = async (values: InitialStateType) => {
//     try {
//       setIsLoading(true)

//       const preparedOrder = {
//         ...values,
//         customer: {
//           ...values.customer,
//           name: `${values.customer.name} ${values.customer.surname}`
//         }
//       }
//       const result = isUpdating
//         ? await updateOrder({ ...preparedOrder, _id: order?._id })
//         : await addOrder(preparedOrder)

//       if (result.success) {
//         toast.success(isUpdating ? "Замовлення оновлено!" : "Нове замовлення додано!")
//         push("/admin/orders")
//       }
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Невідома помилка")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="  justify-center items-center p-4 bg-white rounded-lg shadow-md">
//       <h2 className="text-3xl mb-4 font-bold">{title || "Order Form"}</h2>
//       <Formik
//         enableReinitialize
//         initialValues={initialValues}
//         onSubmit={handleSubmit}
//         validationSchema={orderFormSchema}
//         validateOnMount
//       >
//         {({ values, setFieldValue }) => (
//           <Form>
//             <FormEffects />
//             <FormField
//               item={{
//                 id: "status",
//                 label: "Статус замовлення",
//                 type: "select",
//                 required: true,
//                 options: statusList.map(({ title }) => ({ value: title, label: title }))
//               }}
//               setFieldValue={setFieldValue}
//             />
//             <CustomerFields city={values.customer.city} />
//             <GoodsFields goods={goods} showSelect={showSelect} setShowSelect={setShowSelect} />

//             <div className="my-4">
//               <h3 className="text-xl font-semibold">Загальна ціна: {values.totalPrice} грн</h3>
//             </div>

//             <div className="flex justify-end">
//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 label={order ? "Оновити замовлення" : "Створити замовлення"}
//               />
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   )
// }

// export default OrderForm

// // --- Допоміжні частини:

// const FormEffects = () => {
//   const { values, setFieldValue } = useFormikContext<IOrder>()
//   const { warehouses } = useWarehouses(values.customer.city)

//   const totalPrice = useMemo(
//     () =>
//       values.orderedGoods.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0),
//     [values.orderedGoods]
//   )

//   useEffect(() => {
//     if (warehouses.length) {
//       setFieldValue("customer.warehouse", warehouses[0].Description)
//     }
//   }, [warehouses, setFieldValue])

//   useEffect(() => {
//     setFieldValue("totalPrice", totalPrice, false)
//   }, [totalPrice, setFieldValue])

//   return null
// }

// const CustomerFields = ({ city }: { city: string }) => {
//   const { values, setFieldValue, errors, touched } = useFormikContext<IOrder>()
//   const { warehouses, isWarehousesLoading } = useWarehouses(values.customer.city)

//   const customerInputs = [
//     { name: "customer.name", type: "text", id: "customer.name", label: "І'мя" },
//     { name: "customer.surname", type: "text", id: "customer.surname", label: "Прізвище" },
//     { name: "customer.email", type: "email", id: "customer.email", label: "Email" },
//     { name: "customer.phone", type: "tel", id: "customer.phone", label: "Телефон" },
//     {
//       id: "customer.payment",
//       label: "Оберіть спосіб оплати",
//       options: Object.values(PaymentMethod).map(method => ({ value: method, label: method })),
//       type: "select"
//     }
//   ]

//   return (
//     <>
//       <h3 className="text-xl font-semibold">Замовник</h3>
//       {customerInputs.map((input, i) => (
//         <FormField key={i} item={input} setFieldValue={setFieldValue} />
//       ))}

//       <Field name="customer.city">
//         {({ field, form }: any) => {
//           const [filteredCities, setFilteredCities] = useState<string[]>([])
//           const [searchQuery, setSearchQuery] = useState(field.value || "")

//           const { allCities } = useCities(searchQuery)

//           useEffect(() => {
//             const timeoutId = setTimeout(() => {
//               if (!Array.isArray(allCities)) {
//                 setFilteredCities([])
//                 return
//               }

//               const normalizedQuery = (searchQuery || "").trim().toLowerCase()

//               const filtered = allCities
//                 .filter((city: any) => {
//                   const description = (city?.description || "").trim().toLowerCase()
//                   return description.includes(normalizedQuery)
//                 })
//                 .map((city: any) => city.description || "")

//               setFilteredCities(filtered)
//             }, 300)
//             return () => clearTimeout(timeoutId)
//           }, [searchQuery, allCities])

//           const handleSelectCity = (city: string) => {
//             form.setFieldValue(field.name, city)
//             setSearchQuery(city)
//             setTimeout(() => {
//               setFilteredCities([])
//             }, 0)
//           }

//           return (
//             <div className="relative mb-4">
//               <input
//                 {...field}
//                 value={searchQuery}
//                 onChange={e => {
//                   const value = e.target.value
//                   setSearchQuery(value)
//                   form.setFieldValue(field.name, value)
//                 }}
//                 placeholder="Введіть назву міста"
//                 className="w-full p-4 border-2 rounded-md mb-4"
//               />

//               {filteredCities.length > 0 && (
//                 <div className="absolute z-10 w-full bg-white border rounded-md max-h-60 overflow-y-auto">
//                   {filteredCities.map(city => (
//                     <div
//                       key={city}
//                       onClick={() => handleSelectCity(city)}
//                       className="p-2 hover:bg-gray-200 cursor-pointer"
//                     >
//                       {city}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )
//         }}
//       </Field>

//       <Field
//         name="customer.warehouse"
//         as="select"
//         disabled={isWarehousesLoading}
//         className="w-full p-4 border-2 rounded-md mb-4"
//       >
//         {warehouses.map((wh, i) => (
//           <option key={i} value={wh.Description}>
//             {wh.Description}
//           </option>
//         ))}
//       </Field>
//     </>
//   )
// }

// interface GoodsFieldsProps {
//   goods?: IGood[]
//   showSelect: boolean
//   setShowSelect: (value: boolean) => void
// }

// const GoodsFields = ({ goods, showSelect, setShowSelect }: GoodsFieldsProps) => {
//   const { values, setFieldValue } = useFormikContext<IOrder>()
//   const [searchQuery, setSearchQuery] = useState("")

//   const filteredGoods = useMemo(() => {
//     if (!searchQuery.trim()) return goods || []
//     return (
//       goods?.filter(good =>
//         `${good.title} ${good.brand} ${good.model}`
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase())
//       ) || []
//     )
//   }, [searchQuery, goods])

//   const handleSelectGood = (good: IGood) => {
//     if (values.orderedGoods.some(item => item._id === good._id)) {
//       toast.warning("Цей товар вже додано!")
//       return
//     }
//     setFieldValue("orderedGoods", [...values.orderedGoods, { ...good, quantity: 1 }])
//     setSearchQuery("")
//     setShowSelect(false)
//   }

//   return (
//     <>
//       <h3 className="text-xl font-semibold">Товари у замовленні</h3>
//       <FieldArray
//         name="orderedGoods"
//         render={({ remove }) => (
//           <div>
//             {values.orderedGoods.map((good, i) => (
//               <div key={good._id} className="border p-4 mb-4 flex items-center gap-4">
//                 <Image
//                   src={good?.src?.[0] || "/placeholder.png"}
//                   alt="item"
//                   width={150}
//                   height={150}
//                   className="object-cover"
//                 />
//                 <span className="flex-1">{good.title}</span>
//                 <Button
//                   type="button"
//                   label="-"
//                   onClick={() =>
//                     setFieldValue(
//                       `orderedGoods.${i}.quantity`,
//                       Math.max((good.quantity || 1) - 1, 1)
//                     )
//                   }
//                 />
//                 <span>{good.quantity}</span>
//                 <Button
//                   type="button"
//                   label="+"
//                   onClick={() =>
//                     setFieldValue(`orderedGoods.${i}.quantity`, (good.quantity || 0) + 1)
//                   }
//                 />
//                 <span>Ціна: {good.price} грн</span>
//                 <span>Сума: {(good.price || 0) * (good.quantity || 1)} грн</span>
//                 <Button type="button" label="Видалити" onClick={() => remove(i)} />
//               </div>
//             ))}
//           </div>
//         )}
//       />

//       <div className="flex justify-between mt-4 mb-4">
//         <Button type="button" label="Додати товар" onClick={() => setShowSelect(true)} />
//       </div>

//       {showSelect && (
//         <div className="mb-4">
//           <input
//             type="text"
//             placeholder="Пошук товару за назвою, брендом чи моделлю"
//             value={searchQuery}
//             onChange={e => setSearchQuery(e.target.value)}
//             className="w-full p-2 border rounded-md mb-2"
//           />

//           <div className="max-h-60 overflow-y-auto border rounded-md">
//             {filteredGoods.map(good => (
//               <div
//                 key={good._id}
//                 className="p-2 hover:bg-gray-200 cursor-pointer"
//                 onClick={() => handleSelectGood(good)}
//               >
//                 {good.title} - {good.brand} - {good.model}
//               </div>
//             ))}
//             {!filteredGoods.length && <div className="p-2 text-gray-500">Нічого не знайдено</div>}
//           </div>
//         </div>
//       )}
//     </>
//   )
// }
