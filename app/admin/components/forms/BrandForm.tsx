'use client';

import { Form, Formik, FormikState } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import slugify from 'slugify';
import { toast } from 'sonner';

import {
  CustomButton,
  FormField,
  ImageUploadCloudinary,
} from '@/components/index';
import { brandSchema } from '@/helpers/validationSchemas/addBrandShema';
import { useAddData, useUpdateData } from '@/hooks/index';
import { IBrand } from '@/types/IBrand';

interface InitialStateType
  extends Omit<IBrand, '_id' | 'createdAt' | 'updatedAt' | 'slug'> {}

interface ResetFormProps {
  resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void;
}

interface BrandFormProps {
  brand?: IBrand;
  title?: string;
  action: (data: FormData) => Promise<{
    success: boolean;
    message: string;
    brand?: IBrand;
  }>;
}

const BrandForm: React.FC<BrandFormProps> = ({ brand, title, action }) => {
  const initialValues: InitialStateType = {
    name: brand?.name || '',
    src: brand?.src || '',
    country: brand?.country || '',
    website: brand?.website || '',
  };

  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const isUpdating = Boolean(brand?._id);

  const addBrandMutation = useAddData(action, ['brands']);
  const updateBrandMutation = useUpdateData(action, ['brands']);

  const brandInputs = [
    { name: 'name', type: 'text', id: 'name', label: 'Назва бренду' },
    { name: 'country', type: 'text', id: 'country', label: 'Країна' },
    { name: 'website', type: 'url', id: 'website', label: 'Веб-сайт' },
  ];

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: ResetFormProps
  ) => {
    try {
      setIsLoading(true);

      const formData = new FormData();

      // завжди додаємо slug на бекенд
      formData.append(
        'slug',
        slugify(values.name, { lower: true, strict: true })
      );

      Object.keys(values).forEach(key => {
        let value: any = (values as Record<string, any>)[key];
        if (Array.isArray(value)) {
          value.forEach(val => formData.append(key, val));
        } else {
          formData.append(key, value ?? '');
        }
      });

      if (isUpdating && brand?._id) {
        formData.append('id', brand._id);
      }

      if (isUpdating) {
        await updateBrandMutation.mutateAsync(formData);
      } else {
        await addBrandMutation.mutateAsync(formData);
      }

      resetForm();
      toast.success(isUpdating ? 'Бренд оновлено!' : 'Новий бренд додано!');
      push('/admin/brands');
    } catch (error) {
      console.error('Помилка додавання бренду:', error);
      if (error instanceof Error) toast.error(error.message);
      else toast.error('An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-10">
      <h3 className="text-lg mb-4">{title || 'Додати бренд'}</h3>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={brandSchema}
        enableReinitialize
      >
        {({ setFieldValue, values, errors }) => (
          <Form>
            {brandInputs.map((input, i) => (
              <FormField
                key={i}
                item={input}
                setFieldValue={setFieldValue}
                errors={errors}
              />
            ))}

            <ImageUploadCloudinary
              setFieldValue={setFieldValue}
              values={values.src as string}
              errors={errors}
              multiple={false}
              uploadPreset="preset_brand"
            />

            <CustomButton label="Зберегти" type="submit" disabled={isLoading} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BrandForm;
