import * as yup from 'yup';

const brandSchema = yup.object().shape({
  name: yup
    .string()
    .required('Назва бренду є обовʼязковою')
    .min(2, 'Мінімум 2 символи')
    .max(50, 'Максимум 50 символів'),
  slug: yup
    .string()
    .matches(/^[a-z0-9-]+$/, 'Slug може містити тільки латиницю, цифри та тире')
    .nullable(),
  src: yup.string().url('Некоректне посилання').required(`Обов'язкове поле`),
  country: yup
    .string()
    .max(50, 'Максимум 50 символів')
    .nullable()
    .notRequired(),
  website: yup.string().url('Має бути валідним URL').nullable().notRequired(),
});

export default brandSchema;
