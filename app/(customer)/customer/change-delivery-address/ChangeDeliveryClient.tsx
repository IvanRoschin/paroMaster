'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { Loader, ModalNotification } from '@/app/components';
import { paymentMethods } from '@/app/config/constants';
import {
  useCitySelection,
  useNotificationModal,
  useWarehouses,
} from '@/app/hooks';
import { Modal } from '@/components/ui';
import { ICustomer } from '@/types/ICustomer';

import {
  CustomerEditableFields,
  EditableField,
  EditorType,
} from '../components/EditableField';

export interface ChangeDeliveryInfoClientProps {
  customer?: ICustomer;
}

const ChangeDeliveryInfoClient: React.FC<ChangeDeliveryInfoClientProps> = ({
  customer,
}) => {
  const [profile, setProfile] = useState<ICustomer | undefined>(customer);
  const [message, setMessage] = useState('');

  const notificationModal = useNotificationModal();

  const { warehouses, fetchWarehouses } = useWarehouses(profile?.city || '');

  // -------------------------------
  // ЛОГИКА ГОРОДА — как в checkout
  // -------------------------------
  const {
    search,
    setSearch,
    filteredCities,
    handleSelect: handleCitySelect,
  } = useCitySelection(
    profile?.city || '',
    (_, city) =>
      setProfile(prev =>
        prev ? { ...prev, city, warehouse: '' } : ({ city } as ICustomer)
      ),
    fetchWarehouses
  );

  const [showDropdown, setShowDropdown] = useState(false);

  // Автоподстановка склада
  useEffect(() => {
    const firstWarehouse = warehouses[0]?.Description || '';
    if (!firstWarehouse || !profile?.city) return;

    if (!profile.warehouse) {
      setProfile(prev =>
        prev ? { ...prev, warehouse: firstWarehouse } : prev
      );
    }
  }, [profile?.city, warehouses, profile?.warehouse, customer]);

  if (!profile || !profile._id) return <Loader />;

  const getPaymentLabel = (id: string) => {
    const method = paymentMethods.find(pm => pm.id === id);
    return method ? method.label : id;
  };

  const fields: Array<{
    label: string;
    field: CustomerEditableFields;
    editor: EditorType;
    value: string;
  }> = [
    {
      label: 'Місто',
      field: 'city',
      value: profile.city ?? '',
      editor: {
        type: 'city',
        search,
        setSearch,
        filteredCities,
        handleSelect: handleCitySelect,
        showDropdown,
        setShowDropdown,
      },
    },
    {
      label: 'Відділення',
      field: 'warehouse',
      value: profile.warehouse ?? '',
      editor: { type: 'warehouse', warehouses },
    },
    {
      label: 'Спосіб оплати',
      field: 'payment',
      value: getPaymentLabel(profile.payment ?? ''),
      editor: {
        type: 'select',
        options: paymentMethods.map(pm => ({
          value: pm.id,
          label: pm.label,
        })),
      },
    },
  ];

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="w-full max-w-md md:max-w-lg bg-white shadow-2xl rounded-2xl p-8 md:p-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <h2 className="subtitle mb-6">Змінити адресу доставки</h2>
            {fields.map(({ label, field, editor, value }) => (
              <EditableField
                key={field}
                label={label}
                field={field}
                value={value}
                entityId={profile._id || ''}
                entityType="customer"
                editor={editor}
                setMessage={setMessage}
                notificationModal={notificationModal}
                onUpdated={val =>
                  setProfile(prev => (prev ? { ...prev, [field]: val } : prev))
                }
              />
            ))}
          </motion.div>
        </div>
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
    </>
  );
};

export default ChangeDeliveryInfoClient;
