'use client';

import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  CustomButton,
  FormField,
  ImageUploadCloudinary,
  Switcher,
} from '@/components/index';
import {
  getReadableGoodTitle,
  goodFormSchema,
  storageKeys,
} from '@/helpers/index';
import { useAddData, useUpdateData } from '@/hooks/index';
import { GoodResponse, IGoodUI } from '@/types/IGood';
import { IBrand, ICategory } from '@/types/index';

interface InitialStateType extends Omit<IGoodUI, '_id' | 'category' | 'brand'> {
  category: string;
  brand: string;
  compatibleGoods: string[];
  dealExpiresAt: string;
}

interface GoodFormProps {
  good?: IGoodUI;
  goodsByBrand?: IGoodUI[];
  title?: string;
  allowedCategories: ICategory[];
  allowedBrands: IBrand[];
  action: (values: InitialStateType) => Promise<GoodResponse>;
}

const GoodFormContent: React.FC<{
  formikProps: FormikProps<InitialStateType>;
  good?: IGoodUI;
  goodsByBrand?: IGoodUI[];
  allowedCategories: ICategory[];
  allowedBrands: IBrand[];
  disableSessionSave: boolean;
}> = ({
  formikProps,
  good,
  goodsByBrand,
  allowedCategories,
  allowedBrands,
  disableSessionSave,
}) => {
  const { values, setFieldValue, errors, setErrors } = formikProps;
  const [existingGoodsForBrand, setExistingGoodsForBrand] = useState<IGoodUI[]>(
    []
  );

  useEffect(() => {
    if (!values.brand || !goodsByBrand) {
      setExistingGoodsForBrand([]);
      return;
    }

    const filtered = goodsByBrand.filter(g => {
      const brandId =
        typeof g.brand === 'string' ? g.brand : g.brand?._id?.toString();
      // исключаем только сам редактируемый товар
      return g._id !== good?._id && brandId === values.brand?.toString();
    });

    setExistingGoodsForBrand(filtered);
  }, [values.brand, goodsByBrand, good?._id]);

  useEffect(() => {
    if (good) return;
    const categoryTitle =
      allowedCategories.find(c => c._id === values.category)?.name || '';
    const brandName =
      allowedBrands.find(b => b._id === values.brand)?.name || '';
    setFieldValue(
      'title',
      getReadableGoodTitle({
        category: categoryTitle,
        brand: brandName,
        model: values.model,
      }),
      false
    );
  }, [
    values.category,
    values.brand,
    values.model,
    allowedCategories,
    allowedBrands,
    setFieldValue,
    good,
  ]);

  // Сохранение в sessionStorage только для нового товара
  useEffect(() => {
    if (disableSessionSave || good) return;
    const timeout = setTimeout(() => {
      try {
        sessionStorage.setItem(storageKeys.good, JSON.stringify(values));
      } catch (err) {
        console.error('Error saving form data:', err);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [values, disableSessionSave, good]);

  const textareaStyles: React.CSSProperties = {
    height: 100,
    overflowY: 'auto',
  };

  const discountPriceNum =
    values.discountPrice !== undefined && values.discountPrice !== null
      ? Number(values.discountPrice)
      : undefined;
  const priceNum =
    values.price !== undefined && values.price !== null
      ? Number(values.price)
      : undefined;
  const hasDiscount =
    discountPriceNum !== undefined &&
    priceNum !== undefined &&
    discountPriceNum > 0 &&
    discountPriceNum < priceNum;
  const discountPercent = hasDiscount
    ? Math.round(((priceNum! - discountPriceNum!) / priceNum!) * 100)
    : undefined;

  const fields = [
    {
      id: 'category',
      label: 'Оберіть категорію товара',
      type: 'select',
      options: allowedCategories.map(cat => ({
        value: cat._id ?? '',
        label: cat.name,
      })),
    },
    {
      id: 'brand',
      label: 'Оберіть бренд товара',
      type: 'select',
      options: allowedBrands.map(brand => ({
        value: brand._id ?? '',
        label: brand.name,
      })),
    },
    { id: 'model', type: 'text', label: 'Модель' },
    { id: 'price', type: 'number', label: 'Ціна' },
    { id: 'discountPrice', type: 'number', label: 'Ціна зі знижкою' },
    {
      id: 'description',
      type: 'textarea',
      label: 'Опис',
      style: textareaStyles,
    },
  ];

  return (
    <Form className="relative flex flex-col w-[600px] gap-5 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      {fields.map((input, i) => (
        <motion.div
          key={input.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        >
          <FormField
            item={input}
            setFieldValue={setFieldValue}
            errors={errors}
          />
          {input.id === 'description' && (
            <div
              className={`text-xs mt-1 ${
                values.description.length < 10
                  ? 'text-red-500'
                  : 'text-green-500'
              }`}
            >
              {values.description.length < 10
                ? `Ще потрібно ${10 - values.description.length} символів... ✍️`
                : 'Достатньо символів! 🚀'}
            </div>
          )}
        </motion.div>
      ))}

      {hasDiscount && discountPercent !== undefined && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-green-600 font-semibold text-right"
        >
          🎉 Знижка: {discountPercent}%
        </motion.p>
      )}

      <input type="hidden" name="title" value={values.title} readOnly />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <ImageUploadCloudinary
          setFieldValue={setFieldValue}
          values={values.src}
          errors={errors.src as any}
          uploadPreset="preset_good"
          multiple
        />
      </motion.div>

      {/* Свитчи */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mx-auto mb-8"
      >
        {[
          { id: 'isUsed', label: 'Стан товару', labels: ['Б/У', 'Новий'] },
          { id: 'isAvailable', label: 'Наявність', labels: ['Немає', 'Є'] },
          { id: 'isDailyDeal', label: 'Пропозиція дня', labels: ['Ні', 'Так'] },
        ].map(sw => (
          <motion.div
            key={sw.id}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex flex-col justify-center items-center p-4 bg-white/70 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <span className="text-sm font-medium text-gray-700 mb-2 text-center">
              {sw.label}
            </span>
            <Switcher
              id={sw.id}
              checked={values[sw.id as keyof typeof values] as boolean}
              onChange={checked => setFieldValue(sw.id, checked)}
              labels={sw.labels as [string, string]}
            />
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {values.isDailyDeal && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <FormField
              item={{
                id: 'dealExpiresAt',
                label: 'Дата завершення пропозиції дня',
                type: 'datetime-local',
              }}
              setFieldValue={setFieldValue}
              errors={errors}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {values.brand && goodsByBrand && goodsByBrand.length > 0 && (
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 250, damping: 20 }}
          className="flex flex-col items-center"
        >
          <span className="text-sm font-medium mb-1">Сумісність</span>
          <Switcher
            id="isCompatible"
            checked={values.isCompatible}
            onChange={checked => setFieldValue('isCompatible', checked)}
            labels={['Ні', 'Так']}
          />
        </motion.div>
      )}

      <AnimatePresence>
        {values.isCompatible && existingGoodsForBrand.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <label className="block font-semibold mb-2">
              Сумісний з товарами бренду:
            </label>
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto border rounded p-2">
              {existingGoodsForBrand.map(goodItem => (
                <label
                  key={goodItem._id}
                  className="flex items-center gap-2 hover:bg-gray-50 px-1 py-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={values.compatibleGoods.includes(goodItem._id)}
                    onChange={e => {
                      const newArr = e.target.checked
                        ? [...values.compatibleGoods, goodItem._id]
                        : values.compatibleGoods.filter(
                            id => id !== goodItem._id
                          );
                      setFieldValue('compatibleGoods', newArr);
                    }}
                  />
                  {goodItem.model}
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
        <CustomButton
          label="Зберегти"
          type="submit"
          disabled={formikProps.isSubmitting}
        />
      </motion.div>
    </Form>
  );
};

const GoodForm: React.FC<GoodFormProps> = ({
  good,
  goodsByBrand,
  title,
  allowedCategories,
  allowedBrands,
  action,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [disableSessionSave, setDisableSessionSave] = useState(false);
  const [initialValues, setInitialValues] = useState<InitialStateType | null>(
    null
  );

  const addMutation = useAddData(action, ['good']);
  const updateMutation = useUpdateData(action, ['good', good?._id]);
  const isUpdating = Boolean(good?._id);

  const emptyValues: InitialStateType = {
    category: allowedCategories[0]?._id || '',
    brand: allowedBrands[0]?._id || '',
    src: [],
    model: '',
    sku: '',
    title: '',
    description: '',
    price: 0,
    discountPrice: 0,
    isUsed: false,
    isAvailable: true,
    isDailyDeal: false,
    dealExpiresAt: '',
    isCompatible: false,
    compatibleGoods: [],
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let savedValues: Partial<InitialStateType> = {};
    if (!good) {
      try {
        const saved = sessionStorage.getItem(storageKeys.good);
        if (saved) savedValues = JSON.parse(saved);
      } catch {}
    }

    setInitialValues({
      category:
        typeof good?.category === 'string'
          ? good.category
          : good?.category?._id || allowedCategories[0]?._id || '',
      brand:
        typeof good?.brand === 'string'
          ? good.brand
          : good?.brand?._id || allowedBrands[0]?._id || '',
      src: good?.src || [],
      model: good?.model || '',
      sku: good?.sku || '',
      title: good?.title || '',
      description: good?.description || '',
      price: good?.price ?? 0,
      discountPrice:
        good?.discountPrice !== undefined && good?.discountPrice !== null
          ? good.discountPrice
          : (good?.price ?? 0),
      isUsed: good?.isUsed ?? true,
      isAvailable: good?.isAvailable ?? true,
      isDailyDeal: good?.isDailyDeal ?? false,
      dealExpiresAt: good?.dealExpiresAt
        ? new Date(good.dealExpiresAt).toISOString().slice(0, 16)
        : '',
      isCompatible: good?.isCompatible ?? false,
      compatibleGoods:
        good?.compatibleGoods?.map(cg =>
          typeof cg === 'string' ? cg : cg._id
        ) || [],
      ...savedValues,
    });
  }, [good, allowedCategories, allowedBrands]);

  const handleSubmit = async (
    values: InitialStateType,
    formikHelpers: FormikHelpers<InitialStateType>
  ) => {
    try {
      setIsLoading(true);

      const payload = {
        ...values,
        id: good?._id,
        dealExpiresAt: values.dealExpiresAt
          ? new Date(values.dealExpiresAt).toISOString()
          : '',
      };
      const mutation = isUpdating ? updateMutation : addMutation;
      const result: GoodResponse = await mutation.mutateAsync(payload);

      if (!result.success) {
        if (result.fieldErrors) {
          formikHelpers.setErrors(result.fieldErrors);
          const firstFieldError = Object.values(result.fieldErrors)[0];
          toast.error(firstFieldError as string);
        } else {
          toast.error(result.message || 'Невідома помилка');
        }
        return;
      }

      toast.success(
        result.message ||
          (isUpdating ? '✅ Товар оновлено!' : '🆕 Новий товар додано!')
      );
      setDisableSessionSave(true);
      try {
        sessionStorage.removeItem(storageKeys.good);
      } catch (err) {
        console.error('Помилка при очищенні sessionStorage:', err);
      }

      formikHelpers.resetForm({ values: emptyValues });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Невідома помилка');
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialValues) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative flex flex-col justify-center items-center mt-6"
    >
      <h2 className="text-2xl font-semibold mb-6 text-primaryAccentColor">
        {title}
      </h2>

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
        validationSchema={goodFormSchema}
      >
        {formikProps => (
          <GoodFormContent
            formikProps={formikProps}
            good={good}
            goodsByBrand={goodsByBrand}
            allowedCategories={allowedCategories}
            allowedBrands={allowedBrands}
            disableSessionSave={disableSessionSave}
          />
        )}
      </Formik>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex justify-center items-center bg-white/60 backdrop-blur-sm rounded-xl"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primaryAccentColor" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GoodForm;
