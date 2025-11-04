'use client';

import { Field } from 'formik';
import React, { useEffect, useState } from 'react';

import { WarehouseSelect } from '@/app/components/common/WarehouseSelect';
import { paymentMethods } from '@/app/config/constants';
import { useWarehouses } from '@/app/hooks';
import { FormField } from '@/components';

import { useCitySelection } from '../../../hooks/useCitySelection';
import { ICustomerFormValues } from '../page';

interface CustomerFieldsProps {
  values: ICustomerFormValues;
  errors: any;
  touched: any;
  setFieldValue: (field: string, value: any) => void;
}

export const CustomerFields = ({
  values,
  errors,
  touched,
  setFieldValue,
}: CustomerFieldsProps) => {
  const {
    warehouses,
    isLoading: isWarehousesLoading,
    fetchWarehouses,
  } = useWarehouses(values.city);

  const { search, setSearch, filteredCities, handleSelect } = useCitySelection(
    values.city,
    setFieldValue,
    fetchWarehouses
  );

  const [showDropdown, setShowDropdown] = useState(false);

  // Форматирование телефона
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+380')) val = '+380' + val.replace(/^\+?0*/, '');
    val = '+380' + val.slice(4).replace(/\D/g, '');
    setFieldValue('phone', val);
  };

  useEffect(() => {
    if (!values.phone.startsWith('+380')) setFieldValue('phone', '+380');
  }, [values.phone, setFieldValue]);

  useEffect(() => {
    setFieldValue('warehouse', '');
  }, [values.city, setFieldValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const value = e.target.value;
    setSearch(value);
    setFieldValue(field.name, value);
    setShowDropdown(true);
  };

  const handleCityClick = (city: string) => {
    handleSelect(city);
    setShowDropdown(false);
  };

  const customerInputs = [
    { name: 'name', type: 'text', id: 'name', label: "Ім'я" },
    { name: 'surname', type: 'text', id: 'surname', label: 'Прізвище' },
    { name: 'email', type: 'email', id: 'email', label: 'Email' },
    { name: 'phone', type: 'tel', id: 'phone', label: 'Телефон' },
    {
      id: 'payment',
      label: 'Оберіть спосіб оплати',
      options: Object.values(paymentMethods).map(pm => ({
        value: pm.id,
        label: pm.label,
      })),
      type: 'select',
    },
  ];

  return (
    <>
      <h3 className="text-xl font-semibold">Замовник</h3>
      {customerInputs.map((input, i) => (
        <FormField
          key={i}
          item={input}
          setFieldValue={(field, value) => {
            if (field === 'phone')
              handlePhoneChange({ target: { value } } as any);
            else setFieldValue(field, value);
          }}
          errors={errors}
          touched={touched}
        />
      ))}

      {/* City input */}
      <div className="relative mb-4">
        <Field name="city" id="city">
          {({ field }: any) => (
            <input
              {...field}
              value={search}
              onChange={e => handleChange(e, field)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder=" "
              className={`peer w-full p-4 pt-6 border-2 rounded-md outline-none
                ${errors?.city && touched?.city ? 'border-rose-500' : 'border-neutral-300'}
                ${errors?.city && touched?.city ? 'focus:border-rose-500' : 'focus:border-green-500'}
              `}
            />
          )}
        </Field>
        <label className="absolute left-3 top-5 z-10 text-md transform -translate-y-3">
          Введіть назву міста
        </label>
        {touched?.city && errors?.city && (
          <div className="text-rose-500 text-sm mt-1">
            {typeof errors.city === 'string'
              ? errors?.city
              : (errors?.city as any).message || 'Помилка'}
          </div>
        )}
        {showDropdown && filteredCities.length > 0 && (
          <div className="absolute z-10 w-full bg-white border rounded-md max-h-60 overflow-y-auto">
            {filteredCities.map((city, i) => (
              <div
                key={i}
                onMouseDown={() => handleCityClick(city)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {city}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Warehouse select */}
      <div className="relative w-full mb-4">
        <WarehouseSelect
          name="warehouse"
          warehouses={warehouses}
          value={values.warehouse}
          setFieldValue={setFieldValue}
          disabled={isWarehousesLoading || warehouses.length === 0}
          errors={errors}
          touched={touched}
        />
      </div>
    </>
  );
};
