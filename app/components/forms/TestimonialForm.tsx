'use client';

import { Form, Formik, FormikState } from 'formik';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import ReactStars from 'react-stars';
import { toast } from 'sonner';

import { addTestimonial } from '@/actions/testimonials';
import { Button, FormField, Switcher } from '@/components/index';
import { testimonialFormSchema } from '@/helpers/index';
import { useAddData, useTestimonialModal } from '@/hooks/index';
import { ITestimonial } from '@/types/index';

interface ResetFormProps {
  resetForm: (nextState?: Partial<FormikState<any>>) => void;
}

interface TestimonialFormProps {
  productId: string;
  testimonial?: ITestimonial;
}

const TestimonialForm = ({ productId, testimonial }: TestimonialFormProps) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const addTestimonialMutation = useAddData(addTestimonial, ['testimonials']);
  const testimonialModal = useTestimonialModal();
  const isAdmin = !!session?.user;

  // 🧩 Формируем initialValues
  const [name, surname] = testimonial?.author || ['', ''];

  const initialValues = {
    name,
    surname,
    text: testimonial?.text || '',
    rating: testimonial?.rating ?? null,
    isActive: testimonial?.isActive ?? true,
    product: testimonial?.product || productId,
    createdAt: testimonial?.createdAt || '',
  };

  // 🧠 Сабмит формы
  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: ResetFormProps
  ) => {
    try {
      if (isLoading) return;
      setIsLoading(true);

      const payload: Record<string, any> = {
        ...values,
        author: [values.name.trim(), values.surname.trim()],
      };

      delete payload.name;
      delete payload.surname;

      if (!values.rating) {
        delete payload.rating;
      }

      const result = await addTestimonialMutation.mutateAsync(payload);

      if (!result || result.success === false) {
        toast.error('Щось пішло не так');
        return;
      }

      testimonialModal.onClose();
      toast.success(
        testimonial ? 'Відгук оновлено!' : 'Новий відгук успішно додано!'
      );
      resetForm();
    } catch (error) {
      toast.error('Помилка при збереженні відгуку');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🧱 Конфиг полей формы
  const inputs = [
    { id: 'name', label: 'Ваше Ім’я', type: 'text', required: true },
    { id: 'surname', label: 'Ваше Прізвище', type: 'text', required: true },
    { id: 'text', label: 'Відгук', type: 'textarea', required: true },
  ];

  if (isAdmin) {
    inputs.push({
      id: 'isActive',
      label: 'Публікується?',
      type: 'switcher',
      required: true,
    });
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={testimonialFormSchema}
      enableReinitialize
    >
      {({ errors, setFieldValue, values, handleSubmit }) => (
        <div className="flex flex-col items-center">
          <Form className="flex flex-col w-full" onSubmit={handleSubmit}>
            <div className="subtitle mb-3">
              {testimonial ? 'Редагувати відгук' : 'Додати відгук'}
            </div>

            {inputs.map((item, i) => (
              <div key={i}>
                {item.type === 'switcher' ? (
                  <Switcher
                    id={item.id}
                    label={item.label}
                    checked={values[item.id as keyof typeof values] as boolean}
                    onChange={checked =>
                      setFieldValue(item.id as keyof typeof values, checked)
                    }
                  />
                ) : (
                  <>
                    <FormField
                      item={item}
                      errors={errors}
                      setFieldValue={setFieldValue}
                    />

                    {item.id === 'text' && (
                      <div
                        className={`text-xs mt-1 ${
                          values.text.length < 20
                            ? 'text-red-500'
                            : 'text-green-500'
                        }`}
                      >
                        {values.text.length < 20
                          ? `Ще потрібно ${20 - values.text.length} символів... ✍️`
                          : 'Достатньо символів! 🚀'}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            <div className="mb-4 mt-3">
              {values.rating === null && (
                <div className="text-sm text-gray-500 mt-2 italic">
                  Ви можете залишити відгук і без оцінки ⭐
                </div>
              )}
              <ReactStars
                count={5}
                value={values.rating ?? undefined}
                onChange={(value: number) => setFieldValue('rating', value)}
                size={24}
                color2={'#ffd700'}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                label="Скасувати"
                onClick={() => testimonialModal.onClose()}
                small
                outline
                disabled={isLoading}
              />
              <Button
                type="submit"
                label={testimonial ? 'Оновити' : 'Підтвердити'}
                small
                disabled={isLoading}
              />
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default TestimonialForm;
