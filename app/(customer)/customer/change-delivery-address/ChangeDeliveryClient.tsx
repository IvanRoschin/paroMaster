'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { Loader, ModalNotification } from '@/app/components';
import {
  useCitySelection,
  useNotificationModal,
  useWarehouses,
} from '@/app/hooks';
import { Modal } from '@/components/ui';
import { ICustomer } from '@/types/ICustomer';
import { PaymentMethod } from '@/types/paymentMethod';

import { EditableField } from '../change-user-data/EditableField';

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
  const {
    search,
    setSearch,
    filteredCities,
    handleSelect: handleCitySelect,
  } = useCitySelection(
    profile?.city || '',
    (_, city) =>
      setProfile(prev => (prev ? { ...prev, city } : ({ city } as ICustomer))),
    fetchWarehouses
  );

  const prevWarehouseRef = useRef<string | null>(null);

  useEffect(() => {
    const firstWarehouse = warehouses[0]?.Description || '';
    if (!firstWarehouse) return;

    if (!profile?.city) return;
    if (profile.warehouse !== firstWarehouse) {
      setProfile(prev =>
        prev
          ? { ...prev, warehouse: firstWarehouse }
          : ({ ...(customer ?? {}), warehouse: firstWarehouse } as ICustomer)
      );
      prevWarehouseRef.current = firstWarehouse;
    }
  }, [profile?.city, profile?.warehouse, warehouses, customer]);

  if (!profile || !profile._id) return <Loader />;

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="w-full max-w-md md:max-w-lg bg-white shadow-2xl rounded-2xl p-8 md:p-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Зміна даних отримувача
            </h2>

            {/* City selection */}
            <div className="relative mb-4">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => {}}
                placeholder="Введіть назву міста"
                className="w-full p-4 pt-6 border-2 rounded-md outline-none border-neutral-300 focus:border-green-500"
              />
              {filteredCities.length > 0 && (
                <div className="absolute z-10 w-full bg-white border rounded-md max-h-60 overflow-y-auto">
                  {filteredCities.map((city, i) => (
                    <div
                      key={i}
                      onMouseDown={() => handleCitySelect(city)}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Warehouse */}
            <EditableField
              label="Відділення"
              field="warehouse"
              value={profile.warehouse ?? ''}
              entityId={profile._id}
              entityType="customer"
              setMessage={setMessage}
              notificationModal={notificationModal}
              onUpdated={val => setProfile({ ...profile, warehouse: val })}
            />

            {/* Payment */}
            <EditableField
              label="Спосіб оплати"
              field="payment"
              value={profile.payment ?? ''}
              entityId={profile._id}
              entityType="customer"
              setMessage={setMessage}
              notificationModal={notificationModal}
              onUpdated={val =>
                setProfile({ ...profile, payment: val as PaymentMethod })
              }
            />
          </motion.div>
        </div>
      </div>

      {/* Модалка уведомления */}
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
