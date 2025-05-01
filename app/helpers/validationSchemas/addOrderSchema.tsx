import { PaymentMethod } from "@/types/paymentMethod"
import * as Yup from "yup"
const phoneRegex = /^\+380\d{9}$/
const nameRegex = /^[а-яА-ЯіІїЇєЄґҐ']+$/

const baseSchema = Yup.object().shape({
  number: Yup.string().required(`Обов'язкове поле`),
  customer: Yup.object().shape({
    name: Yup.string().required(`Обов'язкове поле`),
    surname: Yup.string().required(`Обов'язкове поле`),
    email: Yup.string().required(`Обов'язкове поле`)
  })
})

// Схема для одного товару в замовленні:
const orderedGoodSchema = Yup.object().shape({
  _id: Yup.string().required(`Обов'язкове поле`),
  title: Yup.string().required(`Обов'язкове поле`),
  price: Yup.number().positive("Ціна має бути більше 0").required(`Обов'язкове поле`),
  quantity: Yup.number()
    .positive("Кількість має бути більше 0")
    .integer("Має бути цілим числом")
    .required(`Обов'язкове поле`),
  src: Yup.array().of(Yup.string().url("Некоректне посилання")).notRequired(), // на всякий, якщо тобі потрібна src
  brand: Yup.string().notRequired(),
  model: Yup.string().notRequired()
})

const orderFormSchema = Yup.object().shape({
  customer: Yup.object().shape({
    name: Yup.string()
      .min(2, "Мінімум 2 символи")
      .max(20, "Максимум 20 символів")
      .matches(nameRegex, {
        message: "Тільки українські букви"
      })
      .required(`Обов'язкове поле`),
    surname: Yup.string()
      .min(2, "Мінімум 2 символи")
      .max(20, "Максимум 20 символів")
      .matches(nameRegex, {
        message: "Тільки українські букви"
      })
      .required(`Обов'язкове поле`),
    email: Yup.string().email("Некоректний e-mail").required(`Обов'язкове поле`),
    phone: Yup.string()
      .matches(phoneRegex, {
        message: "Має починатись на +380 та 9 цифр номеру"
      })
      .required(`Обов'язкове поле`),
    city: Yup.string().required(`Обов'язкове поле`),
    warehouse: Yup.string().required(`Обов'язкове поле`),
    payment: Yup.string().oneOf(Object.values(PaymentMethod)).required(`Обов'язкове поле`)
  }),
  orderedGoods: Yup.array()
    .of(orderedGoodSchema)
    .min(1, "Додайте хоча б один товар у замовлення")
    .required("Товари обов'язкові"),
  totalPrice: Yup.number().positive(),
  status: Yup.string()
    .oneOf(["Новий", "Опрацьовується", "Оплачений", "На відправку", "Закритий"])
    .required(`Обов'язкове поле`)
})

export default orderFormSchema
