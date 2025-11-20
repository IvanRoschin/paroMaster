import * as Yup from 'yup';

import { PaymentMethod } from '@/types/paymentMethod';

const nameRegex = /^[а-яА-ЯіІїЇєЄґҐ']+$/;
const cityRegex = /^[а-яА-ЯіІїЇєЄґҐ'\s\-\(\)\.,]+$/;
const emailRegex =
  /^(?=.{1,63}$)(?=.{2,}@)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+380\d{9}$/;

const customerFormSchema = Yup.object().shape({
  city: Yup.string()
    .matches(cityRegex, 'Оберіть місто зі списку')
    .min(3, 'Мінімум 3 символи')
    .max(50, 'Максимум 50 символів')
    .required("Обов'язкове поле"),
  warehouse: Yup.string().required("Обов'язкове поле"),
  payment: Yup.mixed<PaymentMethod>()
    .oneOf(Object.values(PaymentMethod), 'Немає такого способу оплати')
    .required("Обов'язкове поле"),
});

export default customerFormSchema;
