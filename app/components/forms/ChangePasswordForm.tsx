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
import { SessionUser } from '@/types/IUser';

interface InitialStateType {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const ChangePasswordForm = ({ user }: { user?: SessionUser }) => {
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const notificationModal = useNotificationModal();

  const initialValues: InitialStateType = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  // --- Early return ---
  if (!user?.id) {
    return (
      <>
        <Modal
          body={
            <ModalNotification
              title="Повідомлення"
              message="Користувач не авторизований"
              onConfirm={notificationModal.onClose}
            />
          }
          isOpen={true}
          onClose={notificationModal.onClose}
        />
      </>
    );
  }

  // --- Handlers ---
  const togglePassword = (key: 'old' | 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: FormikHelpers<InitialStateType>
  ) => {
    setIsLoading(true);

    const res = await changePasswordAction(
      user.id,
      values.oldPassword,
      values.newPassword,
      values.confirmNewPassword
    );

    setMessage(res.message);
    notificationModal.onOpen();

    setIsLoading(false);
    resetForm();
  };

  // --- UI ---
  const renderPasswordField = (
    label: string,
    id: keyof InitialStateType,
    showKey: 'old' | 'new' | 'confirm'
  ) => (
    <div className="relative">
      <FormField
        item={{
          label,
          type: showPassword[showKey] ? 'text' : 'password',
          id,
          required: true,
          autoComplete:
            id === 'oldPassword' ? 'current-password' : 'new-password',
        }}
        errors={{}}
      />

      <button
        type="button"
        onClick={() => togglePassword(showKey)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        tabIndex={-1}
      >
        {showPassword[showKey] ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 md:p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <h2 className="subtitle mb-6">Змінити пароль</h2>

          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={changePasswordFormSchema}
          >
            <Form className="flex flex-col gap-5">
              <input
                type="email"
                name="username"
                defaultValue={user.email || ''}
                autoComplete="username"
                className="hidden"
              />

              {renderPasswordField('Старий пароль', 'oldPassword', 'old')}
              {renderPasswordField('Новий пароль', 'newPassword', 'new')}
              {renderPasswordField(
                'Повторіть пароль',
                'confirmNewPassword',
                'confirm'
              )}

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
