'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FiCheck, FiEdit2, FiX } from 'react-icons/fi';

import {
  getUserById,
  requestEmailChange,
  updateUserFieldAction,
} from '@/app/actions/users';
import { FormField, ModalNotification } from '@/app/components';
import { changeUserSchemas } from '@/app/helpers/validationSchemas/changeUserSchemas';
import { useNotificationModal } from '@/app/hooks';
import { Button, Modal } from '@/components/ui';

interface EditableFieldProps {
  label: string;
  field: 'name' | 'surname' | 'email' | 'phone';
  value: string;
  userId: string;
  onUpdated: (newValue: string) => void;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  label,
  field,
  value,
  userId,
  onUpdated,
}) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const notificationModal = useNotificationModal();
  const { update } = useSession();

  const handleSubmit = async (
    values: { value: string },
    { resetForm }: FormikHelpers<{ value: string }>
  ) => {
    if (values.value === value) {
      setEditing(false);
      return;
    }

    setLoading(true);

    // ----------------------------------------------------
    //  📧 1) ЛОГИКА СМЕНЫ EMAIL
    // ----------------------------------------------------
    if (field === 'email') {
      const res = await requestEmailChange(userId, values.value);
      setLoading(false);
      console.log('res:', res);

      setMessage(res.message);
      notificationModal.onOpen();

      // ❗Email НЕ обновляем локально — он сменится только после клика в письме
      setEditing(false);
      return;
    }

    // ----------------------------------------------------
    //  ✏️ 2) Обычные поля: name, surname, phone
    // ----------------------------------------------------
    const res = await updateUserFieldAction(userId, field, values.value);
    setLoading(false);

    if (res.success && res.user) {
      onUpdated(res.user[field]);
      resetForm({ values: { value: res.user[field] } });
      setEditing(false);

      if (update) {
        const freshUser = await getUserById(userId);
        update(freshUser);
      }
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="mb-4">
      <div className="text-sm text-gray-500">{label}</div>

      {!editing ? (
        <div className="flex items-center justify-between mt-1">
          <span className="text-gray-900">{value || '—'}</span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-primaryAccentColor hover:primaryAccentColor-800"
          >
            <FiEdit2 size={18} />
          </button>
        </div>
      ) : (
        <Formik
          initialValues={{ value }}
          onSubmit={handleSubmit}
          validationSchema={changeUserSchemas[field]}
          enableReinitialize
        >
          {({ setFieldValue, handleSubmit, errors, touched }) => (
            <Form className="flex items-center gap-2 mt-1 w-full">
              <FormField
                item={{
                  id: 'value',
                  label,
                  type: 'text',
                  disabled: loading,
                }}
                errors={errors}
                touched={touched}
                setFieldValue={setFieldValue}
              />

              <motion.div className="flex gap-1">
                <Button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={loading}
                  className="text-green-600 hover:text-green-800"
                  icon={FiCheck}
                />

                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="text-red-500 hover:text-red-700 flex items-center justify-center px-2"
                >
                  <FiX size={20} />
                </button>
              </motion.div>
            </Form>
          )}
        </Formik>
      )}

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
