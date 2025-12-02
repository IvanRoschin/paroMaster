import * as Yup from 'yup';

const goodFormSchema = Yup.object({
  category: Yup.string()
    .trim()
    .min(2, 'Мінімум 2 символи')
    .max(50, 'Максимум 50 символів')
    .required(`Обов'язкове поле`),

  brand: Yup.string()
    .trim()
    .min(2, 'Мінімум 2 символи')
    .max(50, 'Максимум 50 символів')
    .required(`Обов'язкове поле`),

  model: Yup.string()
    .trim()
    .min(2, 'Мінімум 2 символи')
    .max(50, 'Максимум 50 символів')
    .required(`Обов'язкове поле`),

  title: Yup.string().trim().max(80).notRequired(),

  description: Yup.string()
    .trim()
    .min(10, 'Мінімум 10 символів')
    .max(200, 'Максимум 200 символів')
    .required(`Обов'язкове поле`),

  // допускаем как строки, так и объекты с url
  src: Yup.array()
    .of(Yup.string())
    .min(1, 'Додайте хоча б одне фото')
    .max(3, 'Максимум 3 фото')
    .required(`Обов'язкове поле`),

  price: Yup.number()
    .transform(v => (isNaN(v) ? 0 : v))
    .min(0, 'Ціна повинна бути більше 0')
    .required(`Обов'язкове поле`),

  discountPrice: Yup.number()
    .transform(v => (v === '' || isNaN(v) ? undefined : v))
    .nullable()
    .notRequired()
    .test(
      'less-than-price',
      'Ціна зі знижкою має бути менша',
      function (value) {
        const { price } = this.parent;
        if (value == null || price == null) return true;
        return value < price;
      }
    ),

  isUsed: Yup.boolean().default(false),
  isAvailable: Yup.boolean().default(true),
  isDailyDeal: Yup.boolean().default(false),
  isCompatible: Yup.boolean().default(false),

  // чтобы Yup не требовал дату, если пропозиція дня не выбрана
  dealExpiresAt: Yup.string()
    .nullable()
    .when('isDailyDeal', {
      is: true,
      then: schema =>
        schema
          .required('Вкажіть дату завершення')
          .test(
            'valid-date',
            'Некоректна дата',
            v => !v || !isNaN(Date.parse(v))
          ),
      otherwise: schema => schema.nullable().notRequired(),
    }),

  compatibleGoods: Yup.array()
    .of(Yup.string())
    .when('isCompatible', {
      is: true,
      then: schema => schema.min(1, 'Оберіть хоча б одну модель'),
      otherwise: schema => schema.notRequired(),
    }),
});

export default goodFormSchema;
