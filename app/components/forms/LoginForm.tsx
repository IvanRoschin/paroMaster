'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';

import { FormField } from '@/components/common';
import { Button } from '@/components/ui';
import { userLoginSchema } from '@/helpers/index';

interface InitialStateType {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const initialValues: InitialStateType = {
    email: '',
    password: '',
  };

  const handleSubmit = async (
    values: InitialStateType,
    { resetForm }: FormikHelpers<InitialStateType>
  ) => {
    setIsLoading(true);
    signIn('credentials', {
      email: values.email.toLowerCase(),
      password: values.password,
      redirect: false,
    }).then(callback => {
      setIsLoading(false);
      if (callback?.ok) {
        toast.success('Успішний вхід');
        resetForm();
        router.push('/admin');
        window.location.replace('/admin');
      }
      if (callback?.error) {
        toast.error(callback.error || 'Помилка');
      }
    });
  };

  const inputs = [
    { label: 'Email', type: 'text', id: 'email', required: true },
    { label: 'Password', type: 'password', id: 'password', required: true },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md md:max-w-lg bg-white shadow-2xl rounded-2xl p-8 md:p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Сторінка авторизації
          </h2>

          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={userLoginSchema}
            enableReinitialize
          >
            {({ errors }) => (
              <Form className="flex flex-col gap-5">
                {inputs.map((item, i) => (
                  <FormField item={item} key={i} errors={errors} />
                ))}

                {/* Кнопка входа */}
                <div className="w-full">
                  <motion.div
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0px 0px 12px rgba(59,130,246,0.5)',
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Button
                      type="submit"
                      label={isLoading ? 'Завантаження...' : 'Увійти'}
                    />
                  </motion.div>
                </div>
              </Form>
            )}
          </Formik>

          <div className="flex items-center my-8">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 text-gray-500 text-sm">або</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google кнопка */}
          <motion.div
            whileHover={{
              scale: 1.02,
              boxShadow: '0px 0px 12px rgba(234,67,53,0.4)',
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Button
              outline
              label="Continue with Google"
              icon={FcGoogle}
              onClick={() => {
                setIsLoading(true);
                signIn('google').then(callback => {
                  setIsLoading(false);
                  if (callback?.ok) {
                    toast.success('Успішний вхід');
                    router.push('/admin');
                    window.location.replace('/admin');
                  }
                  if (callback?.error) {
                    toast.error(callback.error || 'Помилка');
                  }
                });
              }}
            />
          </motion.div>

          <p className="mt-8 text-center text-sm text-gray-500">
            Забули пароль?{' '}
            <a
              href="/reset-password"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Відновити
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;
