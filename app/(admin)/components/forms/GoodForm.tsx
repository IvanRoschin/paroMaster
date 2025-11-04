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
  goodsByBrand?: IGoodUI[];
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
  const { values, setFieldValue, errors } = formikProps;

  const existingGoodsForBrand = useMemo(() => {
    if (!goodsByBrand || !values.brand) return [];

    return goodsByBrand.filter(g => {
      const brandId =
        typeof g.brand === 'string' ? g.brand : g.brand?._id?.toString();
      return brandId === values.brand?.toString() && g._id !== good?._id;
    });
  }, [goodsByBrand, values.brand, good?._id]);

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
    if (disableSessionSave) return;
    const timeout = setTimeout(() => {
      try {
        sessionStorage.setItem(storageKeys.good, JSON.stringify(values));
      } catch (err) {
        console.error('Error saving form data:', err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [values, disableSessionSave]);

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

      {hasDiscount && discountPercent !== undefined && (
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
        multiple
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

      {values.isCompatible && existingGoodsForBrand.length > 0 && (
        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Сумісний з товарами бренду:
          </label>
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto border rounded p-2">
            {existingGoodsForBrand.map(goodItem => (
              <label key={goodItem._id} className="flex items-center gap-2">
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
                {goodItem.model} {/* или title для отображения */}
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
  goodsByBrand,
  title,
  allowedCategories,
  allowedBrands,
  action,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [disableSessionSave, setDisableSessionSave] = useState(false); // <- тут

  const addMutation = useAddData(action, ['goods']);
  const updateMutation = useUpdateData(action, ['goods']);
  const isUpdating = Boolean(good?._id);

  useEffect(() => {
    if (!good?._id) {
      sessionStorage.removeItem(storageKeys.good);
    }
  }, [good?._id]);

  const initialValues: InitialStateType = useMemo(() => {
    let savedValues: Partial<InitialStateType> = {};
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem(storageKeys.good);
        if (saved) savedValues = JSON.parse(saved);
      } catch (err) {
        console.error('Failed to parse saved good from sessionStorage', err);
      }
    }

    return {
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
      discountPrice: good?.discountPrice || good?.price,
      isNew: good?.isNew ?? true,
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
    };
  }, [good, allowedCategories, allowedBrands]);

  const prepareGoodFormData = (values: InitialStateType, goodId?: string) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key === 'discountPrice') {
        if (value != null && value !== '') {
          const num = Number(value);
          if (!isNaN(num)) formData.append(key, num.toString());
        }
        return;
      }

      if (Array.isArray(value)) {
        value.forEach(v => formData.append(`${key}[]`, v));
      } else if (value != null) {
        formData.append(key, value as string | Blob);
      }
    });

    if (goodId) formData.append('id', goodId);

    if (values.dealExpiresAt) {
      const date = new Date(values.dealExpiresAt);
      if (!isNaN(date.getTime())) {
        formData.append('dealExpiresAt', date.toISOString());
      }
    }

    return formData;
  };

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: FormikHelpers<InitialStateType>
  ) => {
    try {
      setIsLoading(true);
      const formData = prepareGoodFormData(values, good?._id);
      const mutation = isUpdating ? updateMutation : addMutation;
      const result = await mutation.mutateAsync(formData);
      console.log('result:', result);
      if (!result.success) throw new Error('Помилка додавання чи оновлення');

      toast.success(
        result.message ||
          (isUpdating ? 'Товар оновлено!' : 'Новий товар додано!')
      );
      setDisableSessionSave(true);
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
            goodsByBrand={goodsByBrand}
            allowedCategories={allowedCategories}
            allowedBrands={allowedBrands}
            disableSessionSave={disableSessionSave}
          />
        )}
      </Formik>
    </div>
  );
};

export default GoodForm;
