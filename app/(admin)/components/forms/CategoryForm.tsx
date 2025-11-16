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
import { useAddData, useUpdateData } from '@/hooks/index';
import { ICategory } from '@/types/index';

interface InitialStateType extends Omit<ICategory, '_id'> {}

interface ResetFormProps {
  resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void;
}

interface CategoryFormProps {
  category?: ICategory;
  title?: string;
  action: (values: ICategory) => Promise<{ success: boolean; message: string }>;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  title,
  action,
}) => {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isUpdating = Boolean(category?._id);

  const initialValues: InitialStateType = {
    src: category?.src || '',
    name: category?.name || '',
    slug: category?.slug || '',
  };

  const addCategoryMutation = useAddData(action, ['categories']);
  const updateCategoryMutation = useUpdateData(action, ['categories']);

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: ResetFormProps
  ) => {
    try {
      setIsLoading(true);

      const payload = {
        ...values,
        slug: slugify(values.name, { lower: true, strict: true }),
      };

      const result = isUpdating
        ? await updateCategoryMutation.mutateAsync(payload)
        : await addCategoryMutation.mutateAsync(payload);

      if (!result.success) throw new Error(result.message);

      toast.success(
        isUpdating ? 'Категорію оновлено!' : 'Нову категорію успішно додано!'
      );

      resetForm();
      push('/admin/categories');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Невідома помилка');
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

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ setFieldValue, values, errors }) => (
            <Form className="flex flex-col w-[600px] gap-4 space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <FormField
                  item={{
                    id: 'title',
                    label: 'Назва категорії',
                    type: 'text',
                    required: true,
                  }}
                  setFieldValue={setFieldValue}
                  errors={errors}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
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
