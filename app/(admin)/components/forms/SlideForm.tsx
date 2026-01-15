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
  slide?: ISlider;
  title?: string;
  action: (values: ISlider) => Promise<{ success: boolean; message: string }>;
}

const SlideForm: React.FC<SliderFormProps> = ({ slide, title, action }) => {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const textareaStyles: React.CSSProperties = {
    height: '100px',
    overflowY: 'auto',
  };
  const addSlideMutation = useAddData(action, ['slides']);
  const updateSlideMutation = useUpdateData(action, ['slides']);

  const isUpdating = Boolean(slide?._id);

  const initialValues: InitialStateType = {
    src: Array.isArray(slide?.src) ? slide.src : [slide?.src || ''],
    title: slide?.title || '',
    desc: slide?.desc || '',
    isActive: slide?.isActive || false,
  };

  const slideInputs = [
    {
      id: 'title',
      label: 'Заголовок слайду',
      type: 'text',
      required: true,
    },
    {
      id: 'desc',
      label: 'Опис',
      type: 'textarea',
      required: true,
      style: textareaStyles,
    },
    {
      id: 'isActive',
      label: 'Публікується?',
      type: 'switcher',
      required: true,
    },
  ];

  const handleSubmit = async (
    values: ISlider,
    { resetForm }: ResetFormProps
  ) => {
    try {
      setIsLoading(true);

      const updateSliderData = isUpdating ? { ...values, _id: slide?._id } : {};

      const result = isUpdating
        ? await updateSlideMutation.mutateAsync(updateSliderData)
        : await addSlideMutation.mutateAsync(values);

      if (!result.success) throw new Error(result.message);

      resetForm();
      toast.success(isUpdating ? 'Слайд оновлено!!' : 'Новий слайд додано!');
      push('/admin/slides');
    } catch (error) {
      toast.error('Помилка!');
      console.error('Error submitting form:', error);
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
            {title || (isUpdating ? 'Редагувати слайд' : 'Додати слайд')}
          </motion.h3>
        </div>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, setFieldValue, values }) => (
            <Form className="flex flex-col w-[600px] gap-4 space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                {slideInputs.map((item, i) => (
                  <div key={i}>
                    {item.type === 'switcher' ? (
                      <Switcher
                        id={item.id}
                        label={item.label}
                        checked={
                          values[item.id as keyof InitialStateType] as boolean
                        }
                        onChange={(checked: boolean) =>
                          setFieldValue(
                            item.id as keyof InitialStateType,
                            checked
                          )
                        }
                      />
                    ) : (
                      <FormField
                        item={item}
                        errors={errors}
                        setFieldValue={setFieldValue}
                      />
                    )}
                  </div>
                ))}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <ImageUploadCloudinary
                  setFieldValue={setFieldValue}
                  values={values.src}
                  errors={errors.src as any}
                  uploadPreset="preset_slide"
                  multiple={false}
                />
              </motion.div>

              <CustomButton
                label={isLoading ? 'Збереження...' : 'Зберегти'}
                disabled={isLoading}
              />
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default SlideForm;
