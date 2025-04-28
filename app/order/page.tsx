"use client"

import { Field, Form, Formik, useFormikContext } from "formik"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { addCustomer } from "@/actions/customers"
import { addOrder } from "@/actions/orders"
import { sendAdminEmail, sendCustomerEmail } from "@/actions/sendGridEmail"
import Breadcrumbs from "@/components/Breadcrumbs"
import FormField from "@/components/input/FormField"
import Button from "@/components/ui/Button"
import { storageKeys } from "@/helpers/storageKeys"
import { useCities } from "@/hooks/useCities"
import { useWarehouses } from "@/hooks/useWarehouses"
import { ICustomer, IOrder } from "@/types/index"
import { PaymentMethod } from "@/types/paymentMethod"
import { useShoppingCart } from "app/context/ShoppingCartContext"
import OrderGood from "./orderGood"

// Placeholder CartItem type (replace with actual type if defined)
interface CartItem {
  _id?: string
  good: {
    _id?: string
    price: number
    [key: string]: any
  }
  quantity: number
  [key: string]: any
}

const customerFields = [
  { name: "name", type: "text", id: "name", label: "Ім'я", required: true },
  { name: "surname", type: "text", id: "surname", label: "Прізвище", required: true },
  { name: "email", type: "email", id: "email", label: "Email", required: true },
  { name: "phone", type: "tel", id: "phone", label: "Телефон", required: true },
  {
    id: "payment",
    label: "Оберіть спосіб оплати",
    options: Object.values(PaymentMethod).map(method => ({
      value: method,
      label: method,
      key: method
    })),
    type: "select",
    required: true
  }
]

const OrderPage = () => {
  const { cart, resetCart } = useShoppingCart()
  const { push } = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const generatedNumber = `ORD-${Date.now()}`

  // Calculate totalPrice using useMemo
  const totalPrice = useMemo(
    () =>
      cart.reduce((acc, item: CartItem) => acc + (item.good.price || 0) * (item.quantity || 1), 0),
    [cart]
  )

  const initialFormValues: Omit<ICustomer, "_id"> = {
    name: "",
    surname: "",
    email: "",
    phone: "+380",
    city: "Київ",
    warehouse: "",
    payment: PaymentMethod.CashOnDelivery
  }

  // Move useWarehouses to top level
  const { warehouses, isWarehousesLoading } = useWarehouses(initialFormValues.city)

  useEffect(() => {
    sessionStorage.setItem(storageKeys.totalPrice, totalPrice.toString())
  }, [totalPrice])

  const handleSubmit = async (values: ICustomer) => {
    if (!values.city || !values.warehouse) {
      toast.error("Будь ласка, виберіть місто та відділення")
      return
    }

    const orderData: IOrder = {
      number: generatedNumber,
      customer: {
        name: values.name,
        surname: values.surname,
        email: values.email,
        phone: values.phone,
        city: values.city,
        warehouse: values.warehouse,
        payment: values.payment
      },
      orderedGoods: cart.map((item: CartItem) => ({
        ...item.good,
        quantity: item.quantity
      })),
      totalPrice,
      status: "Новий"
    }

    try {
      setIsLoading(true)

      const [adminEmail, customerEmail, orderResult, customerResult] = await Promise.all([
        sendAdminEmail(orderData),
        sendCustomerEmail(orderData),
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
        localStorage.clear()
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
                  <FormEffects warehouses={warehouses} isWarehousesLoading={isWarehousesLoading} />

                  {customerFields.map((field, index) => (
                    <FormField
                      key={index}
                      item={field}
                      setFieldValue={setFieldValue}
                      errors={errors}
                    />
                  ))}

                  <CityField setFieldValue={setFieldValue} errors={errors} />
                  <WarehouseField
                    city={values.city}
                    isWarehousesLoading={isWarehousesLoading}
                    warehouses={warehouses}
                    setFieldValue={setFieldValue}
                    errors={errors}
                  />

                  <Button type="submit" label="Підтвердити замовлення" disabled={isLoading} />
                </Form>
              )}
            </Formik>
          </div>

          {/* Товари у кошику */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <h3 className="text-2xl font-semibold mb-4">Ваші товари</h3>
            {cart.length > 0 ? (
              cart.map((item: CartItem, i) => (
                <OrderGood key={item.good._id || i} good={item.good} quantity={item.quantity} />
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
          return 6
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

// City Field Component
const CityField = ({
  setFieldValue,
  errors
}: {
  setFieldValue: (field: string, value: any) => void
  errors: any
}) => {
  const { values } = useFormikContext<ICustomer>()
  const { filteredCities, searchQuery, setSearchQuery, handleSelectCity } = useCitySelection(
    values.city,
    setFieldValue
  )

  return (
    <div className="relative mb-4">
      <Field name="city">
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
            className={`w-full p-4 border-2 rounded-md ${errors.city ? "border-red-500" : ""}`}
          />
        )}
      </Field>
      {errors.city && <div className="text-red-500 text-sm mt-1">{errors.city}</div>}

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
  )
}

// Warehouse Field Component
const WarehouseField = ({
  city,
  isWarehousesLoading,
  warehouses,
  setFieldValue,
  errors
}: {
  city: string
  isWarehousesLoading: boolean
  warehouses: any[]
  setFieldValue: (field: string, value: any) => void
  errors: any
}) => {
  return (
    <div className="mb-4">
      <Field
        name="warehouse"
        as="select"
        disabled={isWarehousesLoading || !city}
        className={`w-full p-4 border-2 rounded-md ${errors.warehouse ? "border-red-500" : ""}`}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setFieldValue("warehouse", e.target.value)
        }
      >
        <option value="">Виберіть відділення</option>
        {warehouses.map((wh, i) => (
          <option key={i} value={wh.Description}>
            {wh.Description}
          </option>
        ))}
      </Field>
      {errors.warehouse && <div className="text-red-500 text-sm mt-1">{errors.warehouse}</div>}
    </div>
  )
}

// Form Effects Component
const FormEffects = ({
  warehouses,
  isWarehousesLoading
}: {
  warehouses: any[]
  isWarehousesLoading: boolean
}) => {
  const { values, setFieldValue } = useFormikContext<ICustomer>()

  useEffect(() => {
    if (warehouses.length && !values.warehouse && !isWarehousesLoading) {
      setFieldValue("warehouse", warehouses[0].Description)
    }
  }, [warehouses, isWarehousesLoading, setFieldValue, values.warehouse])

  return null
}

export default OrderPage

// "use client"

// import { Field, Form, Formik, useFormikContext } from "formik"
// import { useRouter } from "next/navigation"
// import { useEffect, useMemo, useState } from "react"
// import { toast } from "sonner"

// import { addCustomer } from "@/actions/customers"
// import { addOrder } from "@/actions/orders"
// import { sendAdminEmail, sendCustomerEmail } from "@/actions/sendGridEmail"
// import Breadcrumbs from "@/components/Breadcrumbs"
// import FormField from "@/components/input/FormField"
// import Button from "@/components/ui/Button"
// import { storageKeys } from "@/helpers/storageKeys"
// import { useCities } from "@/hooks/useCities"
// import { useWarehouses } from "@/hooks/useWarehouses"
// import { ICustomer, IOrder } from "@/types/index"
// import { PaymentMethod } from "@/types/paymentMethod"
// import { useShoppingCart } from "app/context/ShoppingCartContext"
// import OrderGood from "./orderGood"

// const customerFields = [
//   { name: "name", type: "text", id: "name", label: "Ім'я", required: true },
//   { name: "surname", type: "text", id: "surname", label: "Прізвище", required: true },
//   { name: "email", type: "email", id: "email", label: "Email", required: true },
//   { name: "phone", type: "tel", id: "phone", label: "Телефон", required: true },
//   {
//     id: "payment",
//     label: "Оберіть спосіб оплати",
//     options: Object.values(PaymentMethod).map(method => ({
//       value: method,
//       label: method,
//       key: method
//     })),
//     type: "select",
//     required: true
//   }
// ]

// const OrderPage = () => {
//   const { cart, resetCart } = useShoppingCart()
//   const { push } = useRouter()

//   const [isLoading, setIsLoading] = useState(false)
//   const generatedNumber = `ORD-${Date.now()}`

//   const initialFormValues: Omit<ICustomer, "_id"> = {
//     name: "",
//     surname: "",
//     email: "",
//     phone: "+380",
//     city: "Київ",
//     warehouse: "",
//     payment: PaymentMethod.CashOnDelivery
//   }

//   const totalPrice = useMemo(
//     () => cart.reduce((acc, item) => acc + (item.good.price || 0) * (item.quantity || 1), 0),
//     [cart]
//   )

//   useEffect(() => {
//     sessionStorage.setItem(storageKeys.totalPrice, totalPrice.toString())
//   }, [totalPrice])

//   const handleSubmit = async (values: ICustomer) => {
//     if (!values.city || !values.warehouse) {
//       toast.error("Будь ласка, виберіть місто та відділення")
//       return
//     }
//     const orderData: IOrder = {
//       number: generatedNumber,
//       customer: {
//         name: values.name,
//         surname: values.surname,
//         email: values.email,
//         phone: values.phone,
//         city: values.city,
//         warehouse: values.warehouse,
//         payment: values.payment
//       },
//       orderedGoods: cart.map(item => ({
//         ...item.good,
//         quantity: item.quantity
//       })),
//       totalPrice,
//       status: "Новий"
//     }

//     try {
//       setIsLoading(true)

//       const [adminEmail, customerEmail, orderResult, customerResult] = await Promise.all([
//         sendAdminEmail(orderData),
//         sendCustomerEmail(orderData),
//         addOrder(orderData),
//         addCustomer(values)
//       ])

//       if (
//         adminEmail?.success &&
//         customerEmail?.success &&
//         orderResult?.success &&
//         customerResult?.success
//       ) {
//         toast.success("Замовлення успішно створено! 🚀", { duration: 3000 })
//         resetCart()
//         sessionStorage.clear()
//         localStorage.clear()

//         push("/")
//       } else {
//         throw new Error("Помилка під час створення замовлення")
//       }
//     } catch (error) {
//       console.error("Помилка оформлення:", error)
//       toast.error(error instanceof Error ? error.message : "Невідома помилка")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <Breadcrumbs />

//       <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg space-y-8">
//         <h2 className="text-3xl font-semibold text-primary mb-4">Оформлення замовлення</h2>

//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Форма оформлення */}
//           <div className="w-full lg:w-2/3">
//             <Formik
//               enableReinitialize
//               initialValues={initialFormValues}
//               onSubmit={handleSubmit}
//               validateOnMount
//             >
//               {({ values, setFieldValue, errors }) => (
//                 <Form className="flex flex-col space-y-6">
//                   <FormEffects />

//                   {customerFields.map((field, index) => (
//                     <FormField
//                       key={index}
//                       item={field}
//                       setFieldValue={setFieldValue}
//                       errors={errors}
//                     />
//                   ))}

//                   <CityField setFieldValue={setFieldValue} errors={errors} />
//                   <WarehouseField
//                     city={values.city}
//                     isWarehousesLoading={useWarehouses(values.city).isWarehousesLoading}
//                     warehouses={useWarehouses(values.city).warehouses}
//                     setFieldValue={setFieldValue}
//                     errors={errors}
//                   />

//                   <Button type="submit" label="Підтвердити замовлення" disabled={isLoading} />
//                 </Form>
//               )}
//             </Formik>
//           </div>

//           {/* Товари у кошику */}
//           <div className="w-full lg:w-1/3 flex flex-col gap-4">
//             <h3 className="text-2xl font-semibold mb-4">Ваші товари</h3>
//             {cart.length > 0 ? (
//               cart.map((item, i) => (
//                 <OrderGood key={item.good._id || i} good={item.good} quantity={item.quantity} />
//               ))
//             ) : (
//               <div>Кошик порожній...</div>
//             )}
//             <div className="text-xl font-bold mt-4">Загальна сума: {totalPrice}</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default OrderPage

// // Custom hook for city selection
// const useCitySelection = (
//   fieldValue: string,
//   setFieldValue: (field: string, value: any) => void
// ) => {
//   const [filteredCities, setFilteredCities] = useState<string[]>([])
//   const [searchQuery, setSearchQuery] = useState(fieldValue || "")
//   const { allCities } = useCities(searchQuery)

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (!Array.isArray(allCities)) {
//         setFilteredCities([])
//         return
//       }

//       const normalizedQuery = (searchQuery || "").trim().toLowerCase()

//       const filtered = allCities
//         .filter((city: any) => {
//           const description = (city?.description || "").trim().toLowerCase()
//           return description.includes(normalizedQuery)
//         })
//         .map((city: any) => city.description || "")

//       setFilteredCities(filtered)
//     }, 300)
//     return () => clearTimeout(timeoutId)
//   }, [searchQuery, allCities])

//   const handleSelectCity = (city: string) => {
//     setFieldValue("city", city)
//     setSearchQuery(city)
//     setTimeout(() => {
//       setFilteredCities([])
//     }, 0)
//   }

//   return { filteredCities, searchQuery, setSearchQuery, handleSelectCity }
// }

// // City Field Component
// const CityField = ({
//   setFieldValue,
//   errors
// }: {
//   setFieldValue: (field: string, value: any) => void
//   errors: any
// }) => {
//   const { values } = useFormikContext<ICustomer>()
//   const { filteredCities, searchQuery, setSearchQuery, handleSelectCity } = useCitySelection(
//     values.city,
//     setFieldValue
//   )

//   return (
//     <div className="relative mb-4">
//       <Field name="city">
//         {({ field }: any) => (
//           <input
//             {...field}
//             value={searchQuery}
//             onChange={e => {
//               const value = e.target.value
//               setSearchQuery(value)
//               setFieldValue(field.name, value)
//             }}
//             placeholder="Введіть назву міста"
//             className={`w-full p-4 border-2 rounded-md ${errors.city ? "border-red-500" : ""}`}
//           />
//         )}
//       </Field>
//       {errors.city && <div className="text-red-500 text-sm mt-1">{errors.city}</div>}

//       {filteredCities.length > 0 && (
//         <div className="absolute z-10 w-full bg-white border rounded-md max-h-60 overflow-y-auto">
//           {filteredCities.map(city => (
//             <div
//               key={city}
//               onClick={() => handleSelectCity(city)}
//               className="p-2 hover:bg-gray-200 cursor-pointer"
//             >
//               {city}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// // Warehouse Field Component
// const WarehouseField = ({
//   city,
//   isWarehousesLoading,
//   warehouses,
//   setFieldValue,
//   errors
// }: {
//   city: string
//   isWarehousesLoading: boolean
//   warehouses: any[]
//   setFieldValue: (field: string, value: any) => void
//   errors: any
// }) => {
//   return (
//     <div className="mb-4">
//       <Field
//         name="warehouse"
//         as="select"
//         disabled={isWarehousesLoading || !city}
//         className={`w-full p-4 border-2 rounded-md ${errors.warehouse ? "border-red-500" : ""}`}
//         onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
//           setFieldValue("warehouse", e.target.value)
//         }
//       >
//         <option value="">Виберіть відділення</option>
//         {warehouses.map((wh, i) => (
//           <option key={i} value={wh.Description}>
//             {wh.Description}
//           </option>
//         ))}
//       </Field>
//       {errors.warehouse && <div className="text-red-500 text-sm mt-1">{errors.warehouse}</div>}
//     </div>
//   )
// }

// // Form Effects Component
// const FormEffects = () => {
//   const { values, setFieldValue } = useFormikContext<ICustomer>()
//   const { warehouses } = useWarehouses(values.city)

//   useEffect(() => {
//     if (warehouses.length && !values.warehouse) {
//       setFieldValue("warehouse", warehouses[0].Description)
//     }
//   }, [warehouses, setFieldValue, values.warehouse])

//   return null
// }
