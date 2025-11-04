// validation/categoryFormSchema.ts
import * as Yup from 'yup';

const categoryFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Мінімальна кількість символів 3')
    .max(50, 'Максимальна кількість символів 50')
    .required("Обов'язкове поле"),
  src: Yup.string().url('Некоректне посилання').required("Обов'язкове поле"),
});

export default categoryFormSchema;
