'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FiCheck, FiEdit2, FiX } from 'react-icons/fi';

import { updateCustomerFieldAction } from '@/app/actions/customers';
import {
  getUserByIdAction,
  requestEmailChangeAction,
  updateUserFieldAction,
} from '@/app/actions/users';
import { FormField } from '@/app/components';
import { changeUserSchemas } from '@/app/helpers/validationSchemas/changeUserSchemas';
import { NotificationModalStore } from '@/app/hooks/useNotificationModal';
import { Button } from '@/components/ui';

type EntityType = 'user' | 'customer';
type UserEditableFields = 'name' | 'surname' | 'email' | 'phone';
type CustomerEditableFields = 'city' | 'warehouse' | 'payment';

type EntityField = UserEditableFields | CustomerEditableFields;

interface EditableFieldProps {
  label: string;
  field: EntityField;
  value: string;
  entityId: string;
  entityType: EntityType;
  onUpdated: (newValue: string) => void;
  setMessage: (msg: string) => void;
  notificationModal: NotificationModalStore;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  label,
  field,
  value,
  entityId,
  entityType,
  onUpdated,
  setMessage,
  notificationModal,
}) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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

    try {
      if (entityType === 'user') {
        const userField = field as UserEditableFields;

        if (userField === 'email') {
          const res = await requestEmailChangeAction(entityId, values.value);
          setMessage(res.message ?? 'Запит оброблено');
          notificationModal.onOpen();
          setEditing(false);
          return;
        }

        const res = await updateUserFieldAction(
          entityId,
          userField,
          values.value
        );
        if (res.success && res.user) {
          const newVal = res.user[field];
          onUpdated(newVal);
          resetForm({ values: { value: newVal } });

          if (update) {
            const freshUser = await getUserByIdAction(entityId);
            update(freshUser);
          }
        } else {
          setMessage(res.message ?? 'Помилка');
          notificationModal.onOpen();
        }
      } else if (entityType === 'customer') {
        const customerField = field as CustomerEditableFields;

        const res = await updateCustomerFieldAction(
          entityId,
          customerField,
          values.value
        );
        if (res.success && res.customer) {
          const newVal = res.customer[field];
          onUpdated(newVal);
          resetForm({ values: { value: newVal } });
        } else {
          setMessage(res.message ?? 'Помилка');
          notificationModal.onOpen();
        }
      }
    } finally {
      setLoading(false);
      setEditing(false);
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
            className="text-primaryAccentColor hover:text-primaryAccentColor-700"
          >
            <FiEdit2 size={18} />
          </button>
        </div>
      ) : (
        <Formik
          initialValues={{ value }}
          enableReinitialize
          validationSchema={changeUserSchemas[field]}
          onSubmit={handleSubmit}
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
                  className="text-green-600"
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
    </div>
  );
};
