'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import { resetPasswordAction } from '@/app/actions/auth';
import { restorePasswordFormSchema } from '@/app/helpers/validationSchemas';
import { useNotificationModal } from '@/app/hooks';
import { FormField, ModalNotification } from '@/components/common';
import { Button, Modal } from '@/components/ui';

interface InitialStateType {
  newPassword: string;
  confirmNewPassword: string;
  token: string;
}

const RestorePasswordForm = () => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const searchParams = useSearchParams();
  const token = searchParams.get('token') as string;

  const notificationModal = useNotificationModal();

  const initialValues: InitialStateType = {
    newPassword: '',
    confirmNewPassword: '',
    token: token,
  };

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: FormikHelpers<InitialStateType>
  ) => {
    setIsLoading(true);

    const res = await resetPasswordAction(
      values.token, // token
      values.newPassword, // password
      values.confirmNewPassword // confirmPassword
    );

    setMessage(res.message);
    notificationModal.onOpen();

    setIsLoading(false);
    resetForm();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 md:p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <h2 className="subtitle mb-6">Сторінка зміни паролю</h2>

          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={restorePasswordFormSchema}
            enableReinitialize
          >
            {({ errors }) => (
              <Form className="flex flex-col gap-5">
                {/* New password */}
                <div className="relative">
                  <FormField
                    item={{
                      label: 'Новий пароль',
                      type: showPassword1 ? 'text' : 'password',
                      id: 'newPassword',
                      required: true,
                    }}
                    errors={errors}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword1(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    tabIndex={-1}
                  >
                    {showPassword1 ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>

                {/* Confirm password */}
                <div className="relative">
                  <FormField
                    item={{
                      label: 'Повторіть пароль',
                      type: showPassword2 ? 'text' : 'password',
                      id: 'confirmNewPassword',
                      required: true,
                    }}
                    errors={errors}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword2(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    tabIndex={-1}
                  >
                    {showPassword2 ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>

                <motion.div
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0px 0px 12px rgba(59,130,246,0.5)',
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    type="submit"
                    label={isLoading ? 'Завантаження...' : 'Змінити пароль'}
                    disabled={isLoading}
                  />
                </motion.div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>

      {/* Модалка */}
      <Modal
        body={
          <ModalNotification
            title="Повідомлення"
            message={message}
            onConfirm={notificationModal.onClose}
          />
        }
        isOpen={notificationModal.isOpen}
        onClose={notificationModal.onClose}
      />
    </div>
  );
};

export default RestorePasswordForm;
