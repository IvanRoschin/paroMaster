import * as Yup from "yup"

const sliderFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Мінімум 2 символи")
    .max(10, "Максимум 10 символів")
    .required(`Обов'язкове поле`),
  desc: Yup.string()
    .min(10, "Мінімум 10 символів")
    .max(20, "Максимум 20 символів")
    .required(`Обов'язкове поле`),
  src: Yup.string().url("Некоректне посилання").required(`Обов'язкове поле`),
  isActive: Yup.boolean().required(`Обов'язкове поле`)
})

export default sliderFormSchema
