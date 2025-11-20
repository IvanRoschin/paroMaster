'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

import { Loader, ModalNotification } from '@/app/components';
import { useNotificationModal } from '@/app/hooks';
import { Modal } from '@/components/ui';
import { IUser } from '@/types/IUser';

import { EditableField } from './EditableField';

export interface ChangeUserDataClient {
  user?: IUser;
}

const ChangeUserDataClient: React.FC<ChangeUserDataClient> = ({ user }) => {
  const [profile, setProfile] = useState(user);
  const [message, setMessage] = useState('');

  const notificationModal = useNotificationModal();

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
              Зміна даних про користувача
            </h2>

            <EditableField
              label="Ім'я"
              field="name"
              value={profile.name ?? ''}
              entityId={profile._id}
              entityType="user"
              setMessage={setMessage}
              notificationModal={notificationModal}
              onUpdated={val => setProfile({ ...profile, name: val })}
            />

            <EditableField
              label="Прізвище"
              field="surname"
              value={profile.surname ?? ''}
              entityId={profile._id}
              entityType="user"
              setMessage={setMessage}
              notificationModal={notificationModal}
              onUpdated={val => setProfile({ ...profile, surname: val })}
            />

            <EditableField
              label="Email"
              field="email"
              value={profile.email ?? ''}
              entityId={profile._id}
              entityType="user"
              setMessage={setMessage}
              notificationModal={notificationModal}
              onUpdated={val => setProfile({ ...profile, email: val })}
            />

            <EditableField
              label="Телефон"
              field="phone"
              value={profile.phone || ''}
              entityId={profile._id}
              entityType="user"
              setMessage={setMessage}
              notificationModal={notificationModal}
              onUpdated={val => setProfile({ ...profile, phone: val })}
            />
          </motion.div>
        </div>
      </div>

      {/* ОДНА МОДАЛКА НА ВСЮ СТРАНИЦУ */}
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
