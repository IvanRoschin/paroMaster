import * as Yup from 'yup';

const changePassValidationSchema = Yup.object({
  newPassword: Yup.string()
    .min(6, 'Мінімум 6 символів')
    .required('Введіть пароль'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Паролі не співпадають')
    .required('Повторіть пароль'),
});

export default changePassValidationSchema;
