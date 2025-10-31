import Link from 'next/link';

import { verifyUser } from '@/actions/auth';
import { routes } from '@/helpers/routes';

// app/customer/auth/verify-email/page.tsx

interface Props {
  searchParams: { token?: string };
}

export default async function VerificationPage({ searchParams }: Props) {
  const params = await searchParams;
  const token = params.token;
  console.log('token', token);
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h2 className="text-red-600 text-xl">Токен не найден.</h2>
      </div>
    );
  }

  const result = await verifyUser(token);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <h2
        className={`mt-4 text-xl ${
          result.success ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {result.message}
      </h2>

      {result.success && (
        <Link
          href={routes.customerProfile.signIn}
          className="mt-6 text-blue-600 hover:underline"
        >
          Перейти к входу в кабинет
        </Link>
      )}
    </div>
  );
}
