'use client';

import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
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
import { IGoodUI } from '@/types/IGood';
import { IBrand, ICategory } from '@/types/index';

interface InitialStateType extends Omit<IGoodUI, '_id' | 'category' | 'brand'> {
  category: string;
  brand: string;
  compatibleGoods: string[];
  dealExpiresAt: string;
}

interface GoodFormProps {
  good?: IGoodUI;
  goods?: IGoodUI[];
  title?: string;
  allowedCategories: ICategory[];
  allowedBrands: IBrand[];
  action: (data: FormData) => Promise<{ success: boolean; message: string }>;
}

const generateSimplesku = () =>
  Math.floor(100000000 + Math.random() * 900000000).toString();

const GoodFormContent: React.FC<{
  formikProps: FormikProps<InitialStateType>;
  good?: IGoodUI;
  goods?: IGoodUI[];
  allowedCategories: ICategory[];
  allowedBrands: IBrand[];
}> = ({ formikProps, good, goods, allowedCategories, allowedBrands }) => {
  const { values, setFieldValue, errors } = formikProps;
  const goodId = good?._id ?? '';

  const existingModelsForBrand = useMemo(() => {
    if (!goods || !values.brand) return [];
    return goods
      .filter(g => {
        const brandId = typeof g.brand === 'string' ? g.brand : g.brand?._id;
        return brandId === values.brand && g._id !== goodId;
      })
      .map(g => g.model);
  }, [goods, values.brand, goodId]);

  useEffect(() => {
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
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        sessionStorage.setItem(storageKeys.good, JSON.stringify(values));
      } catch (err) {
        console.error('Error saving form data:', err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [values]);

  const textareaStyles: React.CSSProperties = {
    height: 100,
    overflowY: 'auto',
  };

  const discountPercent =
    values.price && values.discountPrice
      ? Math.round(((values.price - values.discountPrice) / values.price) * 100)
      : 0;

  return (
    <Form className="flex flex-col w-[600px] gap-4">
      {/* Поля */}
      {[
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
          id: 'dealExpiresAt',
          type: 'datetime-local',
          label: 'Дата завершення пропозиції дня',
        },
        {
          id: 'description',
          type: 'textarea',
          label: 'Опис',
          style: textareaStyles,
        },
      ].map((input, i) => (
        <FormField
          key={i}
          item={input}
          setFieldValue={setFieldValue}
          errors={errors}
        />
      ))}

      {values.discountPrice && discountPercent > 0 && (
        <p className="text-sm text-green-600 font-medium">
          Знижка: {discountPercent}%
        </p>
      )}

      <input type="hidden" name="title" value={values.title} readOnly />

      <ImageUploadCloudinary
        setFieldValue={setFieldValue}
        values={values.src}
        errors={errors.src as any}
        uploadPreset="preset_good"
      />

      {/* Свитчи */}
      <div className="flex justify-around items-center w-full max-w-md mx-auto mb-6">
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium mb-1">Стан</span>
          <Switcher
            id="isNew"
            checked={values.isNew}
            onChange={checked => setFieldValue('isNew', checked)}
            labels={['Б/У', 'Новий']}
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium mb-1">Наявність</span>
          <Switcher
            id="isAvailable"
            checked={values.isAvailable}
            onChange={checked => setFieldValue('isAvailable', checked)}
            labels={['Немає', 'Є']}
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium mb-1">
            Додати в пропозиції дня
          </span>
          <Switcher
            id="isDailyDeal"
            checked={!!values.isDailyDeal}
            onChange={checked => setFieldValue('isDailyDeal', checked)}
            labels={['Ні', 'Так']}
          />
        </div>
      </div>

      {values.isDailyDeal && (
        <FormField
          item={{
            id: 'dealExpiresAt',
            label: 'Дата завершення пропозиції дня',
            type: 'datetime-local',
          }}
          setFieldValue={setFieldValue}
          errors={errors}
        />
      )}
      <div className="flex flex-col items-center">
        <span className="text-sm font-medium mb-1">Сумісність</span>
        <Switcher
          id="isCompatible"
          checked={values.isCompatible}
          onChange={checked => setFieldValue('isCompatible', checked)}
          labels={['Ні', 'Так']}
        />
      </div>

      {values.isCompatible && existingModelsForBrand.length > 0 && (
        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Сумісний з моделями:
          </label>
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto border rounded p-2">
            {existingModelsForBrand.map(model => (
              <label key={model} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={values.compatibleGoods.includes(model)}
                  onChange={e => {
                    const newArr = e.target.checked
                      ? [...values.compatibleGoods, model]
                      : values.compatibleGoods.filter(m => m !== model);
                    setFieldValue('compatibility', newArr);
                  }}
                />
                {model}
              </label>
            ))}
          </div>
        </div>
      )}

      <CustomButton
        label="Зберегти"
        type="submit"
        disabled={formikProps.isSubmitting}
      />
    </Form>
  );
};

const GoodForm: React.FC<GoodFormProps> = ({
  good,
  goods,
  title,
  allowedCategories,
  allowedBrands,
  action,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const addMutation = useAddData(action, ['goods']);
  const updateMutation = useUpdateData(action, ['goods']);
  const isUpdating = Boolean(good?._id);

  const initialValues: InitialStateType = {
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
    sku: good?.sku || generateSimplesku(),
    title: good?.title || '',
    description: good?.description || '',
    price: good?.price || 0,
    discountPrice: good?.discountPrice || 0,
    isNew: good?.isNew || true,
    isAvailable: good?.isAvailable || true,
    isDailyDeal: good?.isDailyDeal || false,
    dealExpiresAt: good?.dealExpiresAt
      ? new Date(good.dealExpiresAt).toISOString().slice(0, 16)
      : '',
    isCompatible: good?.isCompatible || false,
    compatibleGoods:
      good?.compatibleGoods?.map(cg =>
        typeof cg === 'string' ? cg : cg._id
      ) || [],
  };

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: FormikHelpers<InitialStateType>
  ) => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (Array.isArray(value))
          value.forEach(v => formData.append(`${key}[]`, v));
        else formData.append(key, value as string | Blob);
      });

      if (good?._id) formData.append('id', good._id);

      if (values.dealExpiresAt) {
        formData.append(
          'dealExpiresAt',
          new Date(values.dealExpiresAt).toISOString()
        );
      }

      const mutation = isUpdating ? updateMutation : addMutation;
      const result = await mutation.mutateAsync(formData);

      if (!result.success) {
        throw new Error('Помилка додавання чи оновлення');
      }
      toast.success(
        result.message ||
          (isUpdating ? 'Товар оновлено!' : 'Новий товар додано!')
      );
      sessionStorage.removeItem(storageKeys.good);
      router.push('/admin/goods');

      resetForm({ values: initialValues });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="title mb-4">{title}</h2>
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
            goods={goods}
            allowedCategories={allowedCategories}
            allowedBrands={allowedBrands}
          />
        )}
      </Formik>
    </div>
  );
};

export default GoodForm;
