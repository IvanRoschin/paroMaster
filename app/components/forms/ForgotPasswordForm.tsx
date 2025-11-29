'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { sendPasswordResetEmailAction } from '@/app/actions/auth';
import { forgotPasswordFormSchema } from '@/app/helpers/validationSchemas';
import { useNotificationModal } from '@/app/hooks';
import { FormField, ModalNotification } from '@/components/common';
import { Button, Modal } from '@/components/ui';

interface InitialStateType {
  email: string;
}

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const notificationModal = useNotificationModal();

  const initialValues: InitialStateType = {
    email: '',
  };

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: FormikHelpers<InitialStateType>
  ) => {
    setIsLoading(true);
    setMessage('');

    const res = await sendPasswordResetEmailAction(values.email);

    setMessage(res.message);
    notificationModal.onOpen(); // ← открыть модалку

    setIsLoading(false);
    resetForm(); // ← вызвать resetForm
  };

  const inputs = [
    { label: 'Email', type: 'text', id: 'email', required: true },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md md:max-w-lg bg-white shadow-2xl rounded-2xl p-8 md:p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <h2 className="subtitle mb-6">Відновлення паролю</h2>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={forgotPasswordFormSchema}
            enableReinitialize
          >
            {({ errors }) => (
              <Form className="flex flex-col gap-5">
                <FormField item={inputs[0]} errors={errors} />

                <motion.div
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0px 0px 12px rgba(59,130,246,0.5)',
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Button
                    type="submit"
                    label={
                      isLoading ? 'Завантаження...' : 'Надіслати посилання'
                    }
                    disabled={isLoading}
                    className="min-w-[120px] px-5 py-2 text-base md:min-w-[150px]"
                  />
                </motion.div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>

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

export default ForgotPasswordForm;
