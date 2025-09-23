import * as Yup from 'yup';

const categoryFormSchema = Yup.object().shape({
  title: Yup.string().max(20).min(3).required(`Обов'язкове поле`),
  src: Yup.string().url('Некоректне посилання').required(`Обов'язкове поле`),
});

export default categoryFormSchema;
