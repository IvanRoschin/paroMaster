'use client';

import { ErrorMessage, Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Modal } from '@/components';
import { changePassValidationSchema } from '@/helpers/validationSchemas';

interface ResetPasswordValues {
  newPassword: string;
  confirmNewPassword: string;
  email: string;
}

const ChangePasswordForm = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: '',
    message: '',
    success: false,
  });

  const handleSubmit = async (
    values: ResetPasswordValues,
    { resetForm, setSubmitting }: any
  ) => {
    setSubmitting(true);

    try {
      if (!token) {
        setModalData({
          title: 'Помилка доступу',
          message: 'Токен відсутній або недійсний.',
          success: false,
        });
        setModalOpen(true);
        return;
      }

      // 🔹 здесь вызови свой API-запрос на бэк (смена пароля)
      // await api.changePassword({ email, newPassword: values.newPassword, token });

      setModalData({
        title: 'Пароль змінено!',
        message: 'Ваш пароль успішно оновлено. Тепер ви можете увійти.',
        success: true,
      });
      setModalOpen(true);
      resetForm();
    } catch (error) {
      setModalData({
        title: 'Помилка сервера',
        message: 'Не вдалося змінити пароль. Спробуйте пізніше.',
        success: false,
      });
      setModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-2xl">
      <h1 className="text-2xl font-semibold text-center mb-4">Зміна паролю</h1>

      <Formik
        initialValues={{
          newPassword: '',
          confirmNewPassword: '',
          email: email || '',
        }}
        validationSchema={changePassValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid, dirty }) => (
          <Form className="space-y-4">
            <div>
              <label className="block mb-1">Новий пароль</label>
              <Field
                name="newPassword"
                type="password"
                className="w-full p-3 border rounded-md outline-none focus:border-green-500"
              />
              <ErrorMessage
                name="newPassword"
                component="div"
                className="text-sm text-rose-500 mt-1"
              />
            </div>

            <div>
              <label className="block mb-1">Повторіть пароль</label>
              <Field
                name="confirmNewPassword"
                type="password"
                className="w-full p-3 border rounded-md outline-none focus:border-green-500"
              />
              <ErrorMessage
                name="confirmNewPassword"
                component="div"
                className="text-sm text-rose-500 mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValid || !dirty}
              className="w-full p-3 bg-green-600 text-white rounded-md transition hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Збереження...' : 'Зберегти'}
            </button>
          </Form>
        )}
      </Formik>

      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalData.title}
          body={modalData.message}
          btnText={modalData.success ? '' : 'Закрити'}
        >
          {modalData.success && (
            <Link
              href="/auth/signin"
              className="text-green-600 font-semibold hover:underline"
              onClick={() => setModalOpen(false)}
            >
              Увійти
            </Link>
          )}
        </Modal>
      )}
    </div>
  );
};

export default ChangePasswordForm;
