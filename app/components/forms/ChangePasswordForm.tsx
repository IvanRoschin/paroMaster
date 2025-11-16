'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import { changePasswordAction } from '@/app/actions/auth';
import { changePasswordFormSchema } from '@/app/helpers/validationSchemas';
import { useNotificationModal } from '@/app/hooks';
import { FormField, ModalNotification } from '@/components/common';
import { Button, Modal } from '@/components/ui';

interface InitialStateType {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const ChangePasswordForm = ({ userId }: { userId?: string }) => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const notificationModal = useNotificationModal();

  const initialValues: InitialStateType = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  if (!userId) {
    setMessage('Користувач не авторизований');
    notificationModal.onOpen();
    setIsLoading(false);
    return;
  }

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: FormikHelpers<InitialStateType>
  ) => {
    setIsLoading(true);

    const res = await changePasswordAction(
      userId,
      values.oldPassword, // oldPassword
      values.newPassword, // newPassword
      values.confirmNewPassword // confirmNewPassword
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
          <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Сторінка зміни паролю
          </h2>

          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={changePasswordFormSchema}
            enableReinitialize
          >
            {({ errors }) => (
              <Form className="flex flex-col gap-5">
                {/* Old password */}
                <div className="relative">
                  <FormField
                    item={{
                      label: 'Старий пароль',
                      type: showPassword1 ? 'text' : 'password',
                      id: 'oldPassword',
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
                    onClick={() => setShowPassword3(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    tabIndex={-1}
                  >
                    {showPassword3 ? (
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

export default ChangePasswordForm;
