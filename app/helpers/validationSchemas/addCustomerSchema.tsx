import * as Yup from 'yup';

import { PaymentMethod } from '@/types/paymentMethod';

const nameRegex = /^[а-яА-ЯіІїЇєЄґҐ']+$/;
const cityRegex = /^[а-яА-ЯіІїЇєЄґҐ'\s\-\(\)\.]+$/;
const emailRegex =
  /^(?=.{1,63}$)(?=.{2,}@)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+380\d{9}$/;

const customerFormSchema = Yup.object().shape({
  name: Yup.string()
    .matches(nameRegex, 'Тільки українські букви без пробілів')
    .min(3, 'Мінімум 3 букви')
    .max(20, 'Максимум 20 букв')
    .required("Обов'язкове поле"),
  surname: Yup.string()
    .matches(nameRegex, 'Тільки українські букви без пробілів')
    .min(3, 'Мінімум 3 букви')
    .max(20, 'Максимум 20 букв')
    .required("Обов'язкове поле"),
  phone: Yup.string()
    .matches(phoneRegex, 'Має починатись на +380 та містити 9 цифр')
    .required("Обов'язкове поле"),
  email: Yup.string()
    .matches(emailRegex, 'Некоректний email')
    .max(63, 'Максимум 63 символи')
    .min(3, 'Мінімум 3 символи')
    .required("Обов'язкове поле"),
  city: Yup.string()
    .matches(cityRegex, 'Тільки українські букви')
    .min(3, 'Мінімум 3 букви')
    .max(20, 'Максимум 20 букв')
    .required("Обов'язкове поле"),
  warehouse: Yup.string().required("Обов'язкове поле"),
  payment: Yup.mixed<PaymentMethod>()
    .oneOf(Object.values(PaymentMethod), 'Немає такого способу оплати')
    .required("Обов'язкове поле"),
});

export default customerFormSchema;
