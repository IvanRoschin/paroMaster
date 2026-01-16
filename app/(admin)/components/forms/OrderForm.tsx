'use client';

import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { addOrderAction, updateOrderAction } from '@/actions/orders';
import { Button, FormField } from '@/components/index';
import { orderStatus } from '@/config/constants';
import { orderFormSchema } from '@/helpers/index';
import { useCities, useWarehouses } from '@/hooks/index';
import { IGoodUI, IOrder } from '@/types/index';
import { ICustomerSnapshot } from '@/types/IOrder';
import { OrderStatus } from '@/types/orderStatus';
import { PaymentMethod } from '@/types/paymentMethod';

import { GoodsFields } from '../GoodsFields';

interface InitialStateType extends Omit<IOrder, '_id' | 'customer'> {
  customerSnapshot: ICustomerSnapshot;
}

interface OrderFormProps {
  order?: IOrder;
  title?: string;
  goods?: IGoodUI[];
}

const OrderForm = ({ order, title, goods }: OrderFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const { push } = useRouter();
  const isUpdating = Boolean(order?._id);

  const [name, surname] = order?.customerSnapshot.user.name?.split(' ') || [
    '',
    '',
  ];

  const initialValues: InitialStateType = {
    number: order?.number || '',
    customerSnapshot: {
      user: {
        name: name || '',
        surname: surname || '',
        phone: order?.customerSnapshot.user.phone || '+380',
        email: order?.customerSnapshot.user.email || '',
      },
      city: order?.customerSnapshot.city || 'Київ',
      warehouse: order?.customerSnapshot.warehouse || '',
      payment:
        order?.customerSnapshot.payment || PaymentMethod.CASH_ON_DELIVERY,
    },
    orderedGoods: order?.orderedGoods || [],
    totalPrice: order?.totalPrice || 0,
    status: order?.status || OrderStatus.NEW,
  };

  const handleSubmit = async (values: InitialStateType) => {
    try {
      setIsLoading(true);

      const preparedOrder: IOrder = {
        ...values,
        customer: order?.customer ?? 'TEMP',
        customerSnapshot: { ...values.customerSnapshot },
      };

      const result = isUpdating
        ? await updateOrderAction({ ...preparedOrder, _id: order?._id })
        : await addOrderAction(preparedOrder);

      if (result.success) {
        toast.success(
          isUpdating ? 'Замовлення оновлено!' : 'Нове замовлення додано!'
        );
        push('/admin/orders');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Невідома помилка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="justify-center items-center p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl mb-4 font-bold">{title || 'Order Form'}</h2>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={orderFormSchema}
        validateOnMount
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            <FormEffects />
            <FormField
              item={{
                id: 'status',
                label: 'Статус замовлення',
                type: 'select',
                required: true,
                options: orderStatus.map(({ id, label }) => ({
                  value: id,
                  label: label,
                })),
              }}
              setFieldValue={setFieldValue}
            />
            <CustomerFields
              snapshot={values.customerSnapshot}
              errors={errors}
              touched={touched}
              setFieldValue={setFieldValue}
            />
            <GoodsFields
              goods={goods}
              showSelect={showSelect}
              setShowSelect={setShowSelect}
            />

            <div className="my-4">
              <h3 className="text-xl font-semibold">
                Загальна ціна: {values.totalPrice} грн
              </h3>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                label={order ? 'Оновити замовлення' : 'Створити замовлення'}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OrderForm;

// ---------- Form Effects ----------
const FormEffects = () => {
  const { values, setFieldValue } = useFormikContext<InitialStateType>();
  const { warehouses } = useWarehouses(values.customerSnapshot.city);

  const totalPrice = useMemo(
    () =>
      values.orderedGoods.reduce(
        (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
        0
      ),
    [values.orderedGoods]
  );

  useEffect(() => {
    if (warehouses.length && !values.customerSnapshot.warehouse) {
      setFieldValue('customerSnapshot.warehouse', warehouses[0].Description);
    }
  }, [warehouses, setFieldValue, values.customerSnapshot.warehouse]);

  useEffect(() => {
    setFieldValue('totalPrice', totalPrice, false);
  }, [totalPrice, setFieldValue]);

  return null;
};

// ---------- City Selection Hook ----------
const useCitySelection = (
  fieldValue: string,
  setFieldValue: (field: string, value: any) => void
) => {
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(fieldValue || '');
  const { allCities } = useCities(searchQuery);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!Array.isArray(allCities)) {
        setFilteredCities([]);
        return;
      }
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const filtered = allCities
        .filter(city =>
          (city.description || '')
            .trim()
            .toLowerCase()
            .includes(normalizedQuery)
        )
        .map(city => city.description || '');
      setFilteredCities(filtered);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, allCities]);

  const handleSelectCity = (city: string) => {
    setFieldValue('customerSnapshot.city', city);
    setSearchQuery(city);
    setTimeout(() => setFilteredCities([]), 0);
  };

  return { filteredCities, searchQuery, setSearchQuery, handleSelectCity };
};

// ---------- Customer Fields ----------
interface CustomerFieldsProps {
  snapshot: ICustomerSnapshot;
  touched: any;
  errors: any;
  setFieldValue: any;
}

const CustomerFields = ({
  snapshot,
  touched,
  errors,
  setFieldValue,
}: CustomerFieldsProps) => {
  const { values } = useFormikContext<InitialStateType>();
  const { warehouses, isLoading } = useWarehouses(snapshot.city);
  const [showDropdown, setShowDropdown] = useState(false);

  const { filteredCities, searchQuery, setSearchQuery, handleSelectCity } =
    useCitySelection(snapshot.city, setFieldValue);

  const customerInputs = [
    {
      name: 'customerSnapshot.user.name',
      id: 'customerSnapshot.name',
      type: 'text',
      label: "Ім'я",
    },
    {
      name: 'customerSnapshot.user.surname',
      id: 'customerSnapshot.surname',
      type: 'text',
      label: 'Прізвище',
    },
    {
      name: 'customerSnapshot.user.email',
      id: 'customerSnapshot.user.email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'customerSnapshot.user.phone',
      id: 'customerSnapshot.phone',
      type: 'tel',
      label: 'Телефон',
    },
    {
      id: 'customerSnapshot.payment',
      name: 'customerSnapshot.payment',
      type: 'select',
      label: 'Оберіть спосіб оплати',
      options: Object.values(PaymentMethod).map(method => ({
        value: method,
        label: method,
      })),
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const value = e.target.value;
    setSearchQuery(value);
    setFieldValue(field.name, value);
    setShowDropdown(true);
  };

  const handleCityClick = (city: string) => {
    handleSelectCity(city);
    setShowDropdown(false);
  };

  return (
    <>
      <h3 className="text-xl font-semibold">Замовник</h3>
      {customerInputs.map((input, i) => (
        <FormField key={i} item={input} setFieldValue={setFieldValue} />
      ))}

      <div className="relative mb-4">
        <Field name="customerSnapshot.city">
          {({ field }: any) => (
            <input
              {...field}
              value={searchQuery}
              onChange={e => handleChange(e, field)}
              placeholder=" "
              className={`text-primaryTextColor peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition
              ${errors.customerSnapshot?.city && touched.customerSnapshot?.city ? 'border-rose-500' : 'border-neutral-300'}
              ${errors.customerSnapshot?.city && touched.customerSnapshot?.city ? 'focus:border-rose-500' : 'focus:border-green-500'}`}
            />
          )}
        </Field>
        <label
          className="text-primaryTextColor absolute text-md duration-150 left-3 top-5 z-10 transform -translate-y-3
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
        >
          Введіть назву міста
        </label>

        {showDropdown && filteredCities.length > 0 && (
          <div className="absolute z-10 w-full bg-white border rounded-md max-h-60 overflow-y-auto">
            {filteredCities.map(city => (
              <div
                key={city}
                onClick={() => handleCityClick(city)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {city}
              </div>
            ))}
          </div>
        )}

        {touched.customerSnapshot?.city && errors.customerSnapshot?.city && (
          <div className="text-rose-500 text-sm mt-1">
            <ErrorMessage name="customerSnapshot.city" />
          </div>
        )}
      </div>

      <div className="relative w-full mb-4">
        <Field
          name="customerSnapshot.warehouse"
          as="select"
          disabled={isLoading}
          className={`text-primaryTextColor peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition
          ${errors.customerSnapshot?.warehouse && touched.customerSnapshot?.warehouse ? 'border-rose-500' : 'border-neutral-300'}
          ${errors.customerSnapshot?.warehouse && touched.customerSnapshot?.warehouse ? 'focus:border-rose-500' : 'focus:border-green-500'}`}
        >
          <option value="">Оберіть відділення</option>
          {warehouses.map((wh, i) => (
            <option key={i} value={wh.Description}>
              {wh.Description}
            </option>
          ))}
        </Field>
        <label
          htmlFor="customerSnapshot.warehouse"
          className="text-primaryTextColor absolute text-md duration-150 left-3 top-3 z-9 transform -translate-y-3
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
        >
          Оберіть відділення
        </label>
        {touched.customerSnapshot?.warehouse &&
          errors.customerSnapshot?.warehouse && (
            <div className="text-rose-500 text-sm mt-1">
              <ErrorMessage name="customerSnapshot.warehouse" />
            </div>
          )}
      </div>
    </>
  );
};
