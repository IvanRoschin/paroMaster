import * as Yup from 'yup';

const restorePasswordFormSchema = Yup.object({
  newPassword: Yup.string()
    .trim()
    .min(6, 'Мінімум 6 символів')
    .max(64, 'Максимум 64 символи')
    .required('Введіть пароль'),
  confirmNewPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref('newPassword')], 'Паролі не співпадають')
    .required('Повторіть пароль'),
});

export default restorePasswordFormSchema;
