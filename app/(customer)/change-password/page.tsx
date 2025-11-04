import { getServerSession } from 'next-auth';

import ChangePasswordForm from '@/components/forms/ChangePasswordForm';
import { authOptions } from '@/config/authOptions';

export default async function ChangePasswordPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-semibold text-red-600">
          Доступ заборонено 🚫
        </h2>
        <p className="mt-2 text-gray-600">
          Увійдіть у свій акаунт, щоб змінити пароль.
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Змінити пароль 🔒</h1>
      <p className="mb-4 text-gray-600 text-center">
        Ви увійшли як <strong>{session.user.email}</strong>
      </p>

      <ChangePasswordForm userId={session.user._id} />
    </div>
  );
}
