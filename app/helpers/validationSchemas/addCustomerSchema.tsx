import { PaymentMethod } from '@/types/paymentMethod'; // Assuming you have this enum in your types
import * as Yup from 'yup';

const nameRegex = /^[а-яА-ЯіІїЇєЄґҐ']+$/;
const emailRegex =
  /^(?=.{1,63}$)(?=.{2,}@)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+380\d{9}$/;

const customerFormSchema = Yup.object().shape({
  name: Yup.string()
    .max(20)
    .min(3)
    .matches(nameRegex, {
      message: 'Тільки українські букви від 3 до 20 символів без пробілів',
    })
    .required(`Обов'язкове поле`),
  surname: Yup.string()
    .max(20)
    .min(3)
    .matches(nameRegex, {
      message: 'Тільки українські букви від 3 до 20 символів без пробілів',
    })
    .required(`Обов'язкове поле`),
  phone: Yup.string()
    .matches(phoneRegex, {
      message: 'Має починатись на +380 та 9 цифр номеру',
    })
    .required(`Обов'язкове поле`),
  email: Yup.string()
    .max(63)
    .min(3)
    .email()
    .matches(emailRegex, {
      message: 'Має включати @, від 3 до 63 символів',
    })
    .required(`Обов'язкове поле`),
  city: Yup.string().max(63).min(3).required(`Обов'язкове поле`),
  payment: Yup.mixed<PaymentMethod>()
    .oneOf(Object.values(PaymentMethod), 'Немає такої категорії')
    .required(`Обов'язкове поле`),
  warehouse: Yup.string(),
});

export default customerFormSchema;
