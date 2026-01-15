'use client';

import { useEffect, useState } from 'react';

import { getAllUsersAction } from '@/actions/users';
import { FormField } from '@/app/components';
import { IUser } from '@/types';

interface Props {
  id?: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  value: string;
}

export default function UserSelect({
  id = 'userId',
  setFieldValue,
  value,
}: Props) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const result = await getAllUsersAction();

        if (!active) return;
        if (result.success) setUsers(result.users);
      } catch (e) {
        console.error('Error loading users:', e);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const selectOptions = loading
    ? [{ value: '', label: 'Завантаження...' }]
    : [
        { value: '', label: '-- Оберіть клієнта --' },
        ...users
          .filter(u => Boolean(u._id))
          .map(u => ({
            value: u._id!, // теперь можно безопасно утверждать
            label: `${u.name} ${u.surname} — ${u.email}`,
          })),
      ];

  return (
    <FormField
      item={{
        id,
        label: 'Клієнт',
        as: 'select',
        options: selectOptions,
        value,
      }}
      setFieldValue={setFieldValue}
    />
  );
}
