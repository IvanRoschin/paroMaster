import * as Yup from 'yup';

const passwordRegex = /^\S+$/;

const changePasswordFormSchema = Yup.object({
  oldPassword: Yup.string()
    .trim()
    .min(6, 'Мінімум 6 символів')
    .max(64, 'Максимум 64 символи')
    .required('Введіть старий пароль')
    .matches(passwordRegex, 'Пароль не може містити пробілів'),
  newPassword: Yup.string()
    .trim()
    .min(6, 'Мінімум 6 символів')
    .max(64, 'Максимум 64 символи')
    .required('Введіть новий пароль')
    .matches(passwordRegex, 'Пароль не може містити пробілів'),
  confirmNewPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref('newPassword')], 'Паролі не співпадають')
    .required('Повторіть новий пароль')
    .matches(passwordRegex, 'Пароль не може містити пробілів'),
});

export default changePasswordFormSchema;
