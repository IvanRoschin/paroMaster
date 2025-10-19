'use client';

import { Form, Formik, FormikState } from 'formik';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

import {
  CustomButton,
  FormField,
  ImageUploadCloudinary,
} from '@/components/index';
import { useAddData, useUpdateData } from '@/hooks/index';
import { slugify } from '@/lib/slugify';
import { ICategory } from '@/types/ICategory';

interface InitialStateType extends Omit<ICategory, '_id'> {}

interface ResetFormProps {
  resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void;
}

interface CategoryFormProps {
  category?: ICategory;
  title?: string;
  action: (data: FormData) => Promise<{
    success: boolean;
    message: string;
    category?: ICategory;
  }>;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  title,
  action,
}) => {
  const initialValues: InitialStateType = {
    name: category?.name || '',
    src: category?.src || '',
    slug: category?.slug || '', // для preview только
  };

  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const isUpdating = Boolean(category?._id);

  const addCategoryMutation = useAddData(action, ['categories']);
  const updateCategoryMutation = useUpdateData(action, ['categories']);

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: ResetFormProps
  ) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        const value = (values as Record<string, any>)[key];
        if (Array.isArray(value))
          value.forEach(val => formData.append(key, val));
        else formData.append(key, value);
      });

      if (isUpdating && category) formData.append('id', category._id as string);

      const result = isUpdating
        ? await updateCategoryMutation.mutateAsync(formData)
        : await addCategoryMutation.mutateAsync(formData);

      if (!result.success) throw new Error(result.message);

      toast.success(
        isUpdating ? 'Категорію оновлено!' : 'Нову категорію додано!'
      );
      resetForm();
      push('/admin/categories');
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error('An unknown error occurred');
      console.error(error);
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
            {title ||
              (isUpdating ? 'Редагувати категорію' : 'Додати категорію')}
          </motion.h3>
        </div>

        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ setFieldValue, values, errors }) => (
            <Form className="flex flex-col w-[600px] gap-4 space-y-5">
              <div className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <FormField
                    item={{
                      id: 'name',
                      label: 'Назва категорії',
                      type: 'text',
                    }}
                    setFieldValue={(field, value) => {
                      setFieldValue('name', value);
                      setFieldValue('slug', slugify(value)); // preview только
                    }}
                    errors={errors}
                  />
                </motion.div>
              </div>

              <p className="text-xs text-gray-400">
                Slug preview:{' '}
                <span className="font-mono">{slugify(values.name)}</span>
              </p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <ImageUploadCloudinary
                  setFieldValue={setFieldValue}
                  values={values.src}
                  errors={errors}
                  multiple={false}
                  uploadPreset="preset_category"
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

export default CategoryForm;
