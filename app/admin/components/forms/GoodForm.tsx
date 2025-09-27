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
import { getReadableGoodTitle, storageKeys } from '@/helpers/index';
import { useAddData, useUpdateData } from '@/hooks/index';
import { IGood } from '@/types/IGood';
import { IBrand, ICategory } from '@/types/index';

// -----------------------------
// Типизация состояния формы
// -----------------------------
interface InitialStateType extends Omit<IGood, '_id' | 'category' | 'brand'> {
  category: string;
  brand: string;
}

// -----------------------------
// Пропсы компонента
// -----------------------------
interface GoodFormProps {
  good?: IGood;
  goods?: IGood[];
  title?: string;
  allowedCategories: ICategory[];
  allowedBrands: IBrand[];
  action: (data: FormData) => Promise<{ success: boolean; message: string }>;
}

// -----------------------------
// Генерация случайного vendor
// -----------------------------
const generateSimpleVendor = () =>
  Math.floor(100000000 + Math.random() * 900000000).toString();

// -----------------------------
// Кастомный Switcher с метками
// -----------------------------
interface SwitcherProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  labels?: [string, string];
}

const LabeledSwitcher: React.FC<SwitcherProps> = ({
  id,
  checked,
  onChange,
  labels = ['Off', 'On'],
}) => {
  const handleToggle = () => onChange(!checked);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">
        {checked ? labels[1] : labels[0]}
      </span>
      <div
        className={`relative w-14 h-8 rounded-full cursor-pointer transition-colors ${
          checked ? 'bg-primaryAccentColor' : 'bg-gray-300'
        }`}
        onClick={handleToggle}
      >
        <div
          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
            checked ? 'translate-x-6' : ''
          }`}
        ></div>
      </div>
    </div>
  );
};

// -----------------------------
// Контент формы
// -----------------------------
const GoodFormContent: React.FC<{
  formikProps: FormikProps<InitialStateType>;
  good?: IGood;
  goods?: IGood[];
  allowedCategories: ICategory[];
  allowedBrands: IBrand[];
}> = ({ formikProps, good, goods, allowedCategories, allowedBrands }) => {
  const { values, setFieldValue, errors } = formikProps;
  const goodId = good?._id ?? '';

  // -----------------------------
  // Фильтрация моделей для совместимости
  // -----------------------------
  const existingModelsForBrand = useMemo(() => {
    if (!goods || !values.brand) return [];
    return goods
      .filter((g: IGood) => {
        const brandId = typeof g.brand === 'string' ? g.brand : g.brand?._id;
        return brandId === values.brand && g._id !== goodId;
      })
      .map(g => g.model);
  }, [goods, values.brand, goodId]);

  // -----------------------------
  // Автосохранение в sessionStorage
  // -----------------------------
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

  return (
    <Form className="flex flex-col w-[600px] gap-4">
      {/* Основные поля */}
      {[
        {
          id: 'category',
          label: 'Оберіть категорію товара',
          type: 'select',
          options: allowedCategories.map(cat => ({
            value: cat._id ?? '', // ✅ фиксим type error
            label: cat.title,
          })),
        },
        {
          id: 'brand',
          label: 'Оберіть бренд товара',
          type: 'select',
          options: allowedBrands.map(brand => ({
            value: brand._id ?? '', // ✅ фиксим type error
            label: brand.name,
          })),
        },
        { id: 'model', type: 'text', label: 'Модель' },
        { id: 'price', type: 'number', label: 'Ціна' },
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

      {/* Изображения */}
      <ImageUploadCloudinary
        setFieldValue={setFieldValue}
        values={values.src}
        errors={errors.src as any}
        uploadPreset="preset_good"
      />

      {/* Переключатели с интуитивными подписями */}
      <div className="flex justify-around items-center w-full max-w-md mx-auto mb-6">
        {/* Стан */}
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium mb-1">Стан</span>
          <Switcher
            id="isCondition"
            checked={values.isCondition}
            onChange={checked => setFieldValue('isCondition', checked)}
            labels={['Новий', 'Б/У']}
          />
        </div>

        {/* Наявність */}
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium mb-1">Наявність</span>
          <Switcher
            id="isAvailable"
            checked={values.isAvailable}
            onChange={checked => setFieldValue('isAvailable', checked)}
            labels={['Немає', 'Є']}
          />
        </div>

        {/* Сумісність */}
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium mb-1">Сумісність</span>
          <Switcher
            id="isCompatible"
            checked={values.isCompatible}
            onChange={checked => setFieldValue('isCompatible', checked)}
            labels={['Ні', 'Так']}
          />
        </div>
      </div>

      {/* Выбор совместимых моделей */}
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
                  checked={values.compatibility.includes(model)}
                  onChange={e => {
                    const newArr = e.target.checked
                      ? [...values.compatibility, model]
                      : values.compatibility.filter(m => m !== model);
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

// -----------------------------
// Основной компонент формы
// -----------------------------
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

  // -----------------------------
  // Инициализация значений
  // -----------------------------
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
    vendor: good?.vendor || generateSimpleVendor(),
    title: good?.title || '',
    description: good?.description || '',
    price: good?.price || 0,
    isCondition: good?.isCondition || false,
    isAvailable: good?.isAvailable || false,
    isCompatible: good?.isCompatible || false,
    compatibility: good?.compatibility || [],
  };

  // -----------------------------
  // Отправка формы
  // -----------------------------

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

      const categoryTitle =
        allowedCategories.find(c => c._id === values.category)?.title || '';
      const brandName =
        allowedBrands.find(b => b._id === values.brand)?.name || '';

      formData.set(
        'title',
        getReadableGoodTitle({
          category: categoryTitle,
          brand: brandName,
          model: values.model,
        })
      );

      formData.set('vendor', generateSimpleVendor());
      if (good?._id) formData.append('id', good._id);

      const mutation = isUpdating ? updateMutation : addMutation;
      const result = await mutation.mutateAsync(formData);

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
      <h2 className="text-4xl mb-4">{title}</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
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
