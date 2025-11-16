// validationSchemas/changeUserDataSchema.ts

import * as Yup from 'yup';

const nameRegex = /^[а-яА-ЯіІїЇєЄґҐ']+$/;
const emailRegex =
  /^(?=.{1,63}$)(?=.{2,}@)[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+380\d{9}$/;

export const changeUserSchemas = {
  name: Yup.object({
    value: Yup.string()
      .min(2, 'Мінімум 2 символи')
      .max(20, 'Максимум 20 символів')
      .matches(nameRegex, 'Тільки українські букви')
      .required("Обов'язкове поле"),
  }),

  surname: Yup.object({
    value: Yup.string()
      .min(2, 'Мінімум 2 символи')
      .max(30, 'Максимум 30 символів')
      .matches(nameRegex, 'Тільки українські букви')
      .required("Обов'язкове поле"),
  }),

  email: Yup.object({
    value: Yup.string()
      .min(3, 'Мінімум 3 символи')
      .max(63, 'Максимум 63 символи')
      .email('Невірний формат email')
      .matches(emailRegex, 'Має включати @, від 3 до 63 символів')
      .required("Обов'язкове поле"),
  }),

  phone: Yup.object({
    value: Yup.string()
      .matches(phoneRegex, 'Має починатись на +380 та містити 9 цифр номеру')
      .required("Обов'язкове поле"),
  }),
} as const;
