'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { FiCheck, FiEdit2, FiX } from 'react-icons/fi';

import { updateCustomerFieldAction } from '@/app/actions/customers';
import {
  requestEmailChangeAction,
  updateUserFieldAction,
} from '@/app/actions/users';
import { FormField } from '@/app/components';
import { WarehouseSelect } from '@/app/components/common/WarehouseSelect';
import { NotificationModalStore } from '@/app/hooks/useNotificationModal';
import { Button } from '@/components/ui';
import { IWarehouse } from '@/types/IWarehouse';

export type EntityType = 'user' | 'customer';
export type UserEditableFields = 'name' | 'surname' | 'email' | 'phone';
export type CustomerEditableFields = 'city' | 'warehouse' | 'payment';
export type EntityField = UserEditableFields | CustomerEditableFields;

export type EditorType =
  | { type: 'input' }
  | { type: 'select'; options: { value: string; label: string }[] }
  | { type: 'warehouse'; warehouses: IWarehouse[] }
  | {
      type: 'city';
      search: string;
      setSearch: (s: string) => void;
      filteredCities: string[];
      handleSelect: (city: string) => void;
      showDropdown: boolean;
      setShowDropdown: (b: boolean) => void;
    };

interface EditableFieldProps {
  label: string;
  field: EntityField;
  value: string;
  entityId: string;
  entityType: EntityType;
  editor: EditorType;
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
  editor,
  onUpdated,
  setMessage,
  notificationModal,
}) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const { update, data: session } = useSession();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

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
          const newVal = res.user[field as UserEditableFields];
          onUpdated(newVal);
          resetForm({ values: { value: newVal } });

          await update({
            user: {
              [field]: newVal,
            },
          });
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
          await update({
            customer: {
              [field]: newVal,
            },
          });
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
          initialValues={{ value: localValue }}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, handleSubmit, errors, touched }) => (
            <Form className="flex items-center gap-2 mt-1 w-full">
              {editor.type === 'city' ? (
                <div className="relative w-full">
                  <input
                    value={editor.search}
                    onChange={e => {
                      editor.setSearch(e.target.value);
                      editor.setShowDropdown(true);
                    }}
                    onFocus={() => editor.setShowDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => editor.setShowDropdown(false), 200)
                    }
                    placeholder="Введіть назву міста"
                    className="w-full p-3 border-2 border-neutral-300 rounded-md outline-none
                 focus:border-green-500"
                  />

                  {editor.showDropdown && editor.filteredCities.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border rounded-md max-h-60 overflow-y-auto">
                      {editor.filteredCities.map((city, i) => (
                        <div
                          key={i}
                          onMouseDown={() => {
                            editor.handleSelect(city);
                            editor.setSearch(city);
                            editor.setShowDropdown(false);
                            setLocalValue(city);
                            setFieldValue('value', city);
                          }}
                          className="p-2 hover:bg-gray-200 cursor-pointer"
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : editor.type === 'warehouse' ? (
                <WarehouseSelect
                  name="value"
                  warehouses={editor.warehouses}
                  value={localValue}
                  setFieldValue={(field, val) => {
                    setFieldValue(field, val);
                    setLocalValue(val);
                  }}
                />
              ) : (
                <FormField
                  item={{
                    id: 'value',
                    label,
                    type: editor.type === 'select' ? 'select' : 'text',
                    options:
                      editor.type === 'select' ? editor.options : undefined,
                    value: localValue,
                    disabled: loading,
                  }}
                  errors={errors}
                  touched={touched}
                  setFieldValue={(field, val) => {
                    setFieldValue(field, val);
                    setLocalValue(val);
                  }}
                />
              )}

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
