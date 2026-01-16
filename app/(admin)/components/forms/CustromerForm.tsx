'use client';

import { Form, Formik, FormikValues } from 'formik';
import { motion } from 'framer-motion';
import { Types } from 'mongoose';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import * as customerActions from '@/actions/customers';
import { CustomerFields } from '@/app/(public)/checkout/components/CustomerFields';
import { FormEffects } from '@/app/(public)/checkout/components/FormEffects';
import { customerFormSchema, storageKeys } from '@/app/helpers';
import { useAddData, useUpdateData } from '@/app/hooks';
import { Button } from '@/components';
import { ICustomer } from '@/types';
import { ICustomerUI } from '@/types/ICustomer';
import { PaymentMethod } from '@/types/paymentMethod';

import UserPreview from '../../admin/customers/add/UserPreview';
import UserSelect from '../../admin/customers/add/UserSelect';

interface FormikCustomerValues {
  userId: string;
  city: string;
  warehouse: string;
  payment: PaymentMethod;

  name: string;
  surname: string;
  email: string;
  phone: string;
}

interface CustomerFormProps {
  customer?: ICustomerUI;
  title?: string;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, title }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const isUpdating = Boolean(customer?._id);

  const [initialValues, setInitialValues] = useState<FormikCustomerValues>({
    userId: '',
    name: customer?.user.name || '',
    surname: customer?.user.surname || '',
    email: customer?.user.email || '',
    phone: customer?.user.phone || '+380',
    city: customer?.city || '',
    warehouse: customer?.warehouse || '',
    payment:
      (customer?.payment as PaymentMethod) || PaymentMethod.CASH_ON_DELIVERY,
  });

  const addMutation = useAddData(customerActions.addCustomerAction, [
    'customers',
  ]);
  const updateMutation = useUpdateData(
    ({ _id, ...values }: ICustomer) => {
      if (!_id) throw new Error('ID не задан');
      return customerActions.updateCustomerAction(_id, values);
    },
    ['customers']
  );

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKeys.customer);
      if (saved) setInitialValues(JSON.parse(saved));
    } catch (err) {
      console.error(err);
    }
    if (customer) {
      setInitialValues(prev => ({
        ...prev,
        name: customer.user.name || '',
        surname: customer.user.surname || '',
        email: customer.user.email || '',
        phone: customer.user.phone || '+380',
        city: customer.city || '',
        warehouse: customer.warehouse || '',
        payment:
          (customer.payment as PaymentMethod) || PaymentMethod.CASH_ON_DELIVERY,
      }));
    }
  }, [customer]);

  const handleSubmit = async (values: FormikValues) => {
    try {
      if (!values.city || !values.warehouse) {
        toast.error('Виберіть місто та відділення');
        return;
      }

      const payload: ICustomer = {
        _id: customer?._id,
        user: isUpdating
          ? new Types.ObjectId(customer!.user._id)
          : new Types.ObjectId(values.userId),
        city: values.city,
        warehouse: values.warehouse,
        payment: values.payment,
      };

      const result = isUpdating
        ? await updateMutation.mutateAsync(payload)
        : await addMutation.mutateAsync(payload);

      if (!result.success) throw new Error(result.message);

      toast.success(isUpdating ? 'Дані оновлено!' : 'Клієнта створено!');
      push('/admin/customers');
    } catch (e: any) {
      toast.error(e.message || 'Помилка');
    }
  };

  return (
    <div className="my-10 p-6 rounded-2xl shadow-sm bg-white flex justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="title mb-4">
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {title ||
              (isUpdating
                ? 'Редагувати дані доставки'
                : 'Додати дані доставки')}
          </motion.h3>
        </div>

        <Formik<FormikCustomerValues>
          enableReinitialize
          initialValues={initialValues}
          validationSchema={customerFormSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form className="flex flex-col w-[600px] gap-4 space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <FormEffects values={values} setFieldValue={setFieldValue} />

                {/* ADD MODE → User select */}
                {!isUpdating && (
                  <UserSelect
                    value={values.userId}
                    setFieldValue={setFieldValue}
                    id={customer?.user._id}
                  />
                )}

                {/* EDIT MODE → User preview */}
                {isUpdating && <UserPreview user={customer!.user} />}

                <CustomerFields
                  values={values}
                  errors={errors}
                  touched={touched}
                  setFieldValue={setFieldValue}
                  disabled
                  hidden
                  title={' '}
                />
              </motion.div>
              <Button type="submit" label="Відправити" disabled={isLoading} />
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default CustomerForm;
