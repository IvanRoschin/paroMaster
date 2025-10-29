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
  Switcher,
} from '@/components/index';
import { useAddData, useUpdateData } from '@/hooks/index';
import { ISlider } from '@/types/index';

interface InitialStateType extends Omit<ISlider, '_id'> {}

interface ResetFormProps {
  resetForm: (nextState?: Partial<FormikState<InitialStateType>>) => void;
}

interface SliderFormProps {
  category?: ISlider;
  title?: string;
  action: (data: FormData) => Promise<{ success: boolean; message: string }>;
}

const SlideForm: React.FC<SliderFormProps> = ({ category, title, action }) => {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isUpdating = Boolean(category?._id);

  const initialValues: InitialStateType = {
    src: Array.isArray(category?.src) ? category.src : [category?.src || ''],
    title: category?.title || '',
    desc: category?.desc || '',
    isActive: category?.isActive || false,
  };

  const addSlideMutation = useAddData(action, ['slides']);
  const updateSlideMutation = useUpdateData(action, ['slides']);

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: ResetFormProps
  ) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (Array.isArray(value))
          value.forEach(val => formData.append(key, val));
        else formData.append(key, String(value));
      });

      if (isUpdating && category?._id) formData.append('id', category._id);

      const result = isUpdating
        ? await updateSlideMutation.mutateAsync(formData)
        : await addSlideMutation.mutateAsync(formData);

      if (!result.success) throw new Error(result.message);

      toast.success(
        isUpdating ? 'Категорію оновлено!' : 'Нову категорію успішно додано!'
      );

      resetForm();
      push('/admin/categories');
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error('Невідома помилка');
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
                    label: 'Заголовок слайду',
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
                transition={{ delay: 0.2 }}
              >
                <FormField
                  item={{
                    id: 'desc',
                    label: 'Опис слайду',
                    type: 'textarea',
                    required: true,
                    style: { height: '100px', overflowY: 'auto' },
                  }}
                  setFieldValue={setFieldValue}
                  errors={errors}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Switcher
                  id="isActive"
                  label="Публікується?"
                  checked={values.isActive}
                  onChange={(checked: boolean) =>
                    setFieldValue('isActive', checked)
                  }
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

export default SlideForm;
