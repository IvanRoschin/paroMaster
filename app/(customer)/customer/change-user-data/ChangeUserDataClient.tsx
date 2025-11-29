'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

import { Loader, ModalNotification } from '@/app/components';
import { useNotificationModal } from '@/app/hooks';
import { Modal } from '@/components/ui';
import { IUser } from '@/types/IUser';

import { EditableField } from '../components/EditableField';

export interface ChangeUserDataClientProps {
  user?: IUser;
}

const ChangeUserDataClient: React.FC<ChangeUserDataClientProps> = ({
  user,
}) => {
  const [profile, setProfile] = useState(user);
  const [message, setMessage] = useState('');

  const notificationModal = useNotificationModal();

  if (!profile || !profile._id) return <Loader />;

  // Определяем список полей для редактирования
  const editableFields: Array<{
    label: string;
    field: 'name' | 'surname' | 'email' | 'phone';
    value: string;
  }> = [
    { label: "Ім'я", field: 'name', value: profile.name ?? '' },
    { label: 'Прізвище', field: 'surname', value: profile.surname ?? '' },
    { label: 'Email', field: 'email', value: profile.email ?? '' },
    { label: 'Телефон', field: 'phone', value: profile.phone ?? '' },
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
            <h2 className="subtitle mb-6">Змінити дані користувача</h2>

            {editableFields.map(({ label, field, value }) => (
              <EditableField
                editor={{ type: 'input' }}
                key={field}
                label={label}
                field={field}
                value={value}
                entityId={profile._id?.toString() || ''}
                entityType="user"
                setMessage={setMessage}
                notificationModal={notificationModal}
                onUpdated={val =>
                  setProfile(prev => ({ ...prev!, [field]: val }))
                }
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Универсальная модалка */}
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

export default ChangeUserDataClient;
