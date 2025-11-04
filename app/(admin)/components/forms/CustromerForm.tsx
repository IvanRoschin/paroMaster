type Props = {};

const CustromerForm = (props: Props) => {
  return <div>CustromerForm</div>;
};

export default CustromerForm;
// 'use client';

// import { Field, Form, Formik, useFormikContext } from 'formik';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { toast } from 'sonner';

// import * as customerActions from '@/actions/customers';
// import {
//   Breadcrumbs,
//   Button,
//   ErrorMessage,
//   FormField,
// } from '@/components/index';
// import { customerFormSchema, storageKeys } from '@/helpers/index';
// import {
//   useAddData,
//   useCities,
//   useUpdateData,
//   useWarehouses,
// } from '@/hooks/index';
// import { ICustomer } from '@/types/index';
// import { PaymentMethod } from '@/types/paymentMethod';

// interface FormikCustomerValues {
//   name: string;
//   surname: string;
//   phone: string;
//   email: string;
//   city: string;
//   warehouse: string;
//   payment: string;
// }

// interface CustomerFormProps {
//   customer?: ICustomer;
//   title?: string;
//   action?: (
//     values: ICustomer
//   ) => Promise<{ success: boolean; message: string }>;
// }

// const CustomerForm: React.FC<CustomerFormProps> = ({
//   customer,
//   title = 'Додати замовника',
//   action,
// }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const { push } = useRouter();

//   const finalAction =
//     action ||
//     (customer ? customerActions.updateCustomer : customerActions.addCustomer);
//   const isUpdating = Boolean(customer?._id);

//   const addCustomerMutation = useAddData(customerActions.addCustomer, [
//     'customers',
//   ]);
//   const updateCustomerMutation = useUpdateData(customerActions.updateCustomer, [
//     'customers',
//   ]);

//   const initialValues: FormikCustomerValues = {
//     name: customer?.name || '',
//     surname: customer?.surname || '',
//     email: customer?.email || '',
//     phone: customer?.phone || '',
//     city: customer?.city || '',
//     warehouse: customer?.warehouse || '',
//     payment: customer?.payment || PaymentMethod.CASH_ON_DELIVERY,
//   };

//   const handleSubmit = async (
//     values: FormikCustomerValues,
//     resetForm: () => void
//   ) => {
//     if (!values.city || !values.warehouse) {
//       toast.error('Будь ласка, виберіть місто та відділення');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const dataToSend: ICustomer = {
//         _id: customer?._id,
//         ...values,
//         payment: values.payment as PaymentMethod,
//       };

//       const result = isUpdating
//         ? await updateCustomerMutation.mutateAsync(dataToSend)
//         : await addCustomerMutation.mutateAsync(dataToSend);

//       if (!result.success) throw new Error(result.message || 'Помилка');

//       resetForm();
//       toast.success(
//         isUpdating ? 'Замовника оновлено!' : 'Нового замовника додано!'
//       );
//       push(isUpdating ? '/admin/customers' : '/admin/orders');
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : 'Невідома помилка');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <Breadcrumbs />
//       <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg space-y-8">
//         <h2 className="text-3xl font-semibold text-primary mb-4">{title}</h2>
//         <Formik
//           enableReinitialize
//           initialValues={initialValues}
//           validationSchema={customerFormSchema}
//           onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
//         >
//           {({ values, setFieldValue, errors, touched }) => (
//             <Form className="flex flex-col space-y-6">
//               <FormEffects />
//               <CustomerFields
//                 city={values.city}
//                 errors={errors}
//                 touched={touched}
//               />
//               <Button type="submit" label="Відправити" disabled={isLoading} />
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default CustomerForm;

// // --- FormEffects ---
// const FormEffects = () => {
//   const { values, setFieldValue } = useFormikContext<FormikCustomerValues>();
//   const { warehouses } = useWarehouses(values.city);

//   useEffect(() => {
//     if (warehouses.length && !values.warehouse) {
//       setFieldValue('warehouse', warehouses[0].Description);
//     }
//     if (
//       values.warehouse &&
//       !warehouses.some(w => w.Description === values.warehouse)
//     ) {
//       setFieldValue('warehouse', '');
//     }
//   }, [warehouses, values.warehouse, values.city, setFieldValue]);

//   useEffect(() => {
//     sessionStorage.setItem(storageKeys.customer, JSON.stringify(values));
//   }, [values]);

//   return null;
// };

// // --- CustomerFields ---
// const CustomerFields = ({
//   city,
//   touched,
//   errors,
// }: {
//   city: string;
//   touched: any;
//   errors: any;
// }) => {
//   const { values, setFieldValue } = useFormikContext<FormikCustomerValues>();
//   const { warehouses } = useWarehouses(city);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const { filteredCities, searchQuery, setSearchQuery, handleSelectCity } =
//     useCitySelection(values.city, setFieldValue);

//   const customerInputs = [
//     { id: 'name', name: 'name', type: 'text', label: "Ім'я" },
//     { id: 'surname', name: 'surname', type: 'text', label: 'Прізвище' },
//     { id: 'email', name: 'email', type: 'email', label: 'Email' },
//     { id: 'phone', name: 'phone', type: 'tel', label: 'Телефон' },
//     {
//       id: 'payment',
//       name: 'payment',
//       type: 'select',
//       label: 'Оберіть спосіб оплати',
//       options: Object.values(PaymentMethod).map(method => ({
//         value: method,
//         label: method,
//       })),
//     },
//   ];

//   return (
//     <>
//       {customerInputs.map((input, i) => (
//         <FormField key={i} item={input} setFieldValue={setFieldValue} />
//       ))}

//       {/* Вибір міста */}
//       <div className="relative mb-4">
//         <Field name="city">
//           {({ field }: any) => (
//             <input
//               {...field}
//               value={searchQuery}
//               onChange={e => {
//                 setSearchQuery(e.target.value);
//                 setFieldValue('city', e.target.value);
//                 setFieldValue('warehouse', '');
//                 setShowDropdown(true);
//               }}
//               placeholder=" "
//               autoComplete="off"
//               className={`peer w-full p-4 pt-6 border-2 rounded-md outline-none
//                 ${errors.city && touched.city ? 'border-rose-500' : 'border-neutral-300'}
//               `}
//             />
//           )}
//         </Field>
//         <label className="absolute left-3 top-5 text-md peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-0">
//           Введіть назву міста
//         </label>
//         {showDropdown && filteredCities.length > 0 && (
//           <div className="absolute z-10 w-full bg-white border rounded-md max-h-60 overflow-y-auto">
//             {filteredCities.map(city => (
//               <div
//                 key={city}
//                 onClick={() => handleSelectCity(city)}
//                 className="p-2 hover:bg-gray-200 cursor-pointer"
//               >
//                 {city}
//               </div>
//             ))}
//           </div>
//         )}
//         {touched.city && errors.city && (
//           <div className="text-rose-500 text-sm mt-1">
//             <ErrorMessage error={errors.city} />
//           </div>
//         )}
//       </div>

//       {/* Вибір відділення */}
//       <div className="relative mb-4">
//         <Field
//           as="select"
//           name="warehouse"
//           disabled={!city}
//           value={values.warehouse || ''}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//             setFieldValue('warehouse', e.target.value)
//           }
//           className="peer w-full p-4 pt-6 border-2 rounded-md outline-none"
//         >
//           <option value="">Оберіть відділення</option>
//           {warehouses.map((wh, i) => (
//             <option key={i} value={wh.Description}>
//               {wh.Description}
//             </option>
//           ))}
//         </Field>
//         <label className="absolute left-3 top-3 text-md">
//           Оберіть відділення
//         </label>
//         {touched.warehouse && errors.warehouse && (
//           <div className="text-rose-500 text-sm mt-1">
//             <ErrorMessage error={errors.warehouse} />
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// // --- useCitySelection ---
// const useCitySelection = (
//   fieldValue: string,
//   setFieldValue: (field: string, value: any) => void
// ) => {
//   const [filteredCities, setFilteredCities] = useState<string[]>([]);
//   const [searchQuery, setSearchQuery] = useState(fieldValue || '');
//   const { allCities } = useCities(searchQuery);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       if (!Array.isArray(allCities)) return setFilteredCities([]);
//       const normalized = searchQuery.trim().toLowerCase();
//       setFilteredCities(
//         allCities
//           .filter((c: any) =>
//             (c.description || '').toLowerCase().includes(normalized)
//           )
//           .map((c: any) => c.description)
//       );
//     }, 300);
//     return () => clearTimeout(timeout);
//   }, [searchQuery, allCities]);

//   const handleSelectCity = (city: string) => {
//     setFieldValue('city', city);
//     setFieldValue('warehouse', '');
//     setSearchQuery(city);
//     setFilteredCities([]);
//   };

//   return { filteredCities, searchQuery, setSearchQuery, handleSelectCity };
// };
