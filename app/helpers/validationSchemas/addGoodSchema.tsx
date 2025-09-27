import * as Yup from 'yup';

const goodFormSchema = Yup.object().shape({
  category: Yup.string()
    .min(2, 'Мінімум 2 символи')
    .max(50, 'Максимум 50 символів')
    .required(`Обов'язкове поле`),
  description: Yup.string()
    .min(20, 'Мінімум 20 символів')
    .max(200, 'Максимум 200 символів')
    .required(`Обов'язкове поле`),
  src: Yup.array()
    .of(Yup.string().url('Некоректне посилання'))
    .min(1, 'Додайте хоча б одне фото')
    .max(3, 'Максимум 3 фото')
    .required(`Обов'язкове поле`),
  brand: Yup.string()
    .min(2, 'Мінімум 2 символи')
    .max(50, 'Максимум 50 символів')
    .required(`Обов'язкове поле`),
  model: Yup.string()
    .min(2, 'Мінімум 2 символи')
    .max(50, 'Максимум 50 символів')
    .required(`Обов'язкове поле`),

  price: Yup.number()
    .min(0, 'Ціна товару повинан бути вище 0')
    .required(`Обов'язкове поле`)
    .nullable(),
  isCondition: Yup.boolean().required(`Обов'язкове поле`),
  isAvailable: Yup.boolean().required(`Обов'язкове поле`),
  isCompatible: Yup.boolean().required(`Обов'язкове поле`),
  compatibility: Yup.array()
    .of(Yup.string())
    .when('isCompatible', {
      is: true,
      then: schema => schema.required('Заповніть поле сумісності'),
      otherwise: schema => schema.notRequired(),
    }),
});

export default goodFormSchema;
