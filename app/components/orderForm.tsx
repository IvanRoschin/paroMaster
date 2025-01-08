"use client"
import { ICustomer } from "@/types/index"
import { PaymentMethod } from "@/types/paymentMethod"
import { Field, Form, Formik } from "formik"
import { FC } from "react"
import FormField from "./input/FormField"

type Props = {
  onSubmit: () => void
}

interface InitialStateType extends Omit<ICustomer, "_id"> {}

const orderForm: FC<Props> = ({ onSubmit }) => {
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

  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
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
              <button type="submit"> Відправити</button>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default orderForm
