'use client';

// import { getForgotPassFormSchema } from '@/schemas/forgotPasswordSchema'; // если есть

interface ForgotPasswordFormCreds {
  email: string;
}

// interface ForgotPasswordFormProps {
//   onSuccess?: () => void;
// }

// const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
//   onSuccess,
// }) => {
//   const [status, setStatus] = useState<
//     'idle' | 'loading' | 'success' | 'error'
//   >('idle');
//   const [message, setMessage] = useState<string>('');

//   const initialValues: ForgotPasswordFormCreds = { email: '' };

//   const handleSubmit = async (
//     values: ForgotPasswordFormCreds,
//     { resetForm, setSubmitting }: FormikHelpers<ForgotPasswordFormCreds>
//   ) => {
//     setStatus('loading');
//     setMessage('');

//   //   try {
//   //     const res = await fetch('/api/auth/forgot-password', {
//   //       method: 'POST',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify(values),
//   //     });

//   //     const data = await res.json();

//   //     if (!res.ok || data.error) {
//   //       throw new Error(data.message || 'Помилка при відправці листа');
//   //     }

//   //     setStatus('success');
//   //     setMessage('Лист з інструкцією для відновлення паролю надіслано.');
//   //     resetForm();

//   //     if (onSuccess) onSuccess();
//   //   } catch (error: any) {
//   //     setStatus('error');
//   //     setMessage(error.message || 'Сталася помилка. Спробуйте ще раз.');
//   //   } finally {
//   //     setSubmitting(false);
//   //   }
//   // };

//   return (
//     <div className={s.wrapper}>
//       <h1 className={s.title}>
//         {status === 'success' ? 'Лист надіслано!' : 'Відновлення паролю'}
//       </h1>

//       <p className={s.description}>
//         {status === 'success'
//           ? 'Перевірте свою електронну пошту для подальших інструкцій.'
//           : 'Введіть ваш email, щоб отримати посилання для відновлення паролю.'}
//       </p>

//       {status === 'loading' && <Loader />}

//       {status !== 'success' && (
//         <Formik<ForgotPasswordFormCreds>
//           onSubmit={handleSubmit}
//           initialValues={initialValues}
//           // validationSchema={getForgotPassFormSchema()}
//         >
//           {({ setFieldValue, isSubmitting, isValid, dirty }) => (
//             <Form className={s.forgotPasswordForm}>
//               <TextField
//                 item={{
//                   id: 'email',
//                   label: 'Email',
//                   type: 'email',
//                   // placeholder: 'john@gmail.com',
//                   required: true,
//                 }}
//               />

//               <button
//                 className={s.modalButton}
//                 type="submit"
//                 disabled={isSubmitting || !isValid || !dirty}
//               >
//                 {isSubmitting ? 'Надсилаємо...' : 'Надіслати'}
//               </button>
//             </Form>
//           )}
//         </Formik>
//       )}

//       {message && (
//         <p
//           className={`mt-4 text-center ${
//             status === 'error' ? 'text-red-600' : 'text-green-600'
//           }`}
//         >
//           {message}
//         </p>
//       )}
//     </div>
//   );
// };

// export default ForgotPasswordForm;
