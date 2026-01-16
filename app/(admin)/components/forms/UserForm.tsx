'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import { toast } from 'sonner';

import { CustomButton, FormField, Switcher } from '@/components/index';
import { userFormSchema } from '@/helpers/index';
import { IUser, UserRole } from '@/types/IUser';

interface UserFormProps {
  user?: Partial<IUser>;
  title?: string;
  action: (
    values: Partial<IUser>
  ) => Promise<{ success: boolean; message: string }>;
}

const UserForm: React.FC<UserFormProps> = ({ user, title, action }) => {
  const inputs = [
    { id: 'name', label: 'Ім`я', type: 'text', required: true },
    { id: 'surname', label: 'Прізвище', type: 'text', required: true },
    { id: 'phone', label: 'Телефон', type: 'tel', required: true },
    { id: 'email', label: 'Email', type: 'email', required: true },
    { id: 'password', label: 'Пароль', type: 'password', required: !user?._id },
  ];

  const initialValues: Partial<IUser> = {
    name: user?.name || '',
    surname: user?.surname || '',
    phone: user?.phone || '',
    email: user?.email || '',
    password: '',
    role: user?.role || UserRole.CUSTOMER,
    isActive: user?.isActive ?? true,
  };

  const handleSubmit = async (
    values: Partial<IUser>,
    { resetForm }: FormikHelpers<Partial<IUser>>
  ) => {
    try {
      const result = await action(values);
      if (result.success) {
        toast.success(
          user?._id ? 'Користувача оновлено!' : 'Нового користувача додано!'
        );
        resetForm();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Помилка!');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-4xl mb-6">
        {title || (user?._id ? 'Редагувати користувача' : 'Додати користувача')}
      </h2>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={userFormSchema}
        enableReinitialize
      >
        {({ errors, setFieldValue, values }) => (
          <Form className="flex flex-col w-[600px] gap-4">
            {inputs.map(item => (
              <FormField
                key={item.id}
                item={item}
                errors={errors}
                setFieldValue={setFieldValue}
              />
            ))}

            {/* Роль */}
            <div>
              <label className="block mb-2">Роль</label>
              <Switcher
                checked={values.role === UserRole.ADMIN}
                labels={['Користувач', 'Адмін']}
                onChange={() =>
                  setFieldValue(
                    'role',
                    values.role === UserRole.ADMIN
                      ? UserRole.CUSTOMER
                      : UserRole.ADMIN
                  )
                }
              />
            </div>

            {/* Активність */}
            <div>
              <label className="block mb-2">Активний?</label>
              <Switcher
                checked={values.isActive ?? false} // если undefined, будет false
                labels={['Неактивний', 'Активний']}
                onChange={() =>
                  setFieldValue('isActive', !(values.isActive ?? false))
                }
              />
            </div>

            <CustomButton type="submit" label="Зберегти" />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserForm;
