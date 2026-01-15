'use client';

import { Form, Formik, FormikState } from 'formik';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import slugify from 'slugify';
import { toast } from 'sonner';

import {
  CustomButton,
  FormField,
  ImageUploadCloudinary,
} from '@/components/index';
import { brandSchema } from '@/helpers/validationSchemas/index';
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
  action: (values: IBrand) => Promise<{
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

      // Формируем объект для отправки
      const payload: Record<string, any> = {
        ...values,
        slug: slugify(values.name, { lower: true, strict: true }),
      };

      // Если обновляем, добавляем id
      if (isUpdating && brand?._id) {
        payload.id = brand._id;
      }

      if (isUpdating) {
        await updateBrandMutation.mutateAsync(payload);
      } else {
        await addBrandMutation.mutateAsync(payload);
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
    <div className="my-10 p-6 rounded-2xl shadow-sm bg-white flex justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="title mb-4">
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {title || 'Додати бренд'}
          </motion.h3>
        </div>

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={brandSchema}
          enableReinitialize
        >
          {({ setFieldValue, values, errors }) => (
            <Form className="flex flex-col w-[600px] gap-4 space-y-5">
              {brandInputs.map((input, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 * (i + 1) }}
                >
                  <FormField
                    item={input}
                    setFieldValue={setFieldValue}
                    errors={errors}
                  />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <ImageUploadCloudinary
                  setFieldValue={setFieldValue}
                  values={values.src as string}
                  errors={errors}
                  multiple={false}
                  uploadPreset="preset_brand"
                />
              </motion.div>

              <div className="pt-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <CustomButton
                    label={isLoading ? 'Збереження...' : 'Зберегти'}
                    type="submit"
                    disabled={isLoading}
                  />
                </motion.div>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default BrandForm;
