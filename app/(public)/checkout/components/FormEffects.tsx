'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

import { storageKeys } from '@/app/helpers';
import { useWarehouses } from '@/app/hooks';

import { ICustomerFormValues } from '../checkoutClient';

interface FormEffectsProps {
  values: ICustomerFormValues;
  setFieldValue: (field: string, value: any) => void;
}

export const FormEffects = ({ values, setFieldValue }: FormEffectsProps) => {
  const { warehouses } = useWarehouses(values?.city);
  const prevWarehouseRef = useRef<string | null>(null);
  const { data: session } = useSession();

  // Автозаполнение первого склада
  useEffect(() => {
    const firstDescription = warehouses[0]?.Description || '';
    if (!values.city && values.warehouse) {
      setFieldValue('warehouse', '');
      prevWarehouseRef.current = '';
      return;
    }
    if (
      values.city &&
      firstDescription &&
      values.warehouse !== firstDescription &&
      prevWarehouseRef.current !== firstDescription
    ) {
      setFieldValue('warehouse', firstDescription);
      prevWarehouseRef.current = firstDescription;
    }
  }, [values.city, values.warehouse, warehouses, setFieldValue]);

  // Сохраняем значения формы в sessionStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const plainValues = {
        ...values,
        user: session?.user?.id || undefined,
      };
      try {
        sessionStorage.setItem(
          storageKeys.customer,
          JSON.stringify(plainValues)
        );
      } catch (error) {
        console.error(error);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [values, session]);

  return null;
};
