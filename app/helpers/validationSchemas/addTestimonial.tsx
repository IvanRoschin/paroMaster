import * as Yup from "yup"

const nameRegex = /^[А-Яа-яЇїІіЄєҐґ']+(?:\s[А-Яа-яЇїІіЄєҐґ']+)?$/

const testimonialFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Мінімум 2 символи")
    .max(20, "Максимум 20 символів")
    .matches(nameRegex, {
      message: "Тільки українські букви"
    })
    .required(`Обов'язкове поле`),
  surname: Yup.string()
    .min(2, "Мінімум 2 символи")
    .max(20, "Максимум 20 символів")
    .matches(nameRegex, {
      message: "Тільки українські букви"
    })
    .required(`Обов'язкове поле`),
  text: Yup.string()
    .min(20, "Мінімум 20 символів")
    .max(200, "Максимум 200 символів")
    .matches(
      /^(?!.*\b(?:http|HTTP|ftp|FTP|www|WWW)\b)[a-zA-Z0-9\sа-яА-ЯёЁїЇіІєЄ,.;:@#\$%&*\(\)\-_=\+\[\]\|\\\/\?`~!№"']+$/u,
      "Only letters, numbers, commas, periods, colons, semicolons are allowed"
    )
    .required(`Обов'язкове поле`),
  rating: Yup.number()
    .min(1, "Оцінка має бути не менше 1")
    .max(5, "Оцінка не може бути більшою за 5")
    .notRequired(),
  isActive: Yup.boolean().required(`Обов'язкове поле`)
})

export default testimonialFormSchema
