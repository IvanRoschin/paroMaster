'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { verifyUser } from '@/actions/auth';
import { routes } from '@/helpers/routes';

export default function VerificationPageClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const [message, setMessage] = useState<string>('Проверка...');
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setMessage('Токен не найден.');
      setSuccess(false);
      return;
    }

    async function verify() {
      const result = await verifyUser(token);
      setMessage(result.message);
      setSuccess(result.success);

      if (result.success) {
        // Через 3 секунды перенаправляем на логин
        setTimeout(() => {
          router.push(routes.customerProfile.signIn);
        }, 3000);

        // Очистим URL, убрав token
        const url = new URL(window.location.href);
        url.searchParams.delete('token');
        window.history.replaceState({}, '', url.toString());
      }
    }

    verify();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <h2
        className={`mt-4 text-xl ${success ? 'text-green-600' : 'text-red-600'}`}
      >
        {message}
      </h2>
      {success && (
        <p className="mt-2 text-gray-500">
          Вы будете перенаправлены на страницу входа...
        </p>
      )}
    </div>
  );
}

// import Link from 'next/link';

// import { verifyUser } from '@/actions/auth';
// import { routes } from '@/helpers/routes';

// // app/customer/auth/verify-email/page.tsx

// interface Props {
//   searchParams: { token?: string };
// }

// export default async function VerificationPage({ searchParams }: Props) {
//   const params = await searchParams;
//   const token = params.token;
//   if (!token) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
//         <h2 className="text-red-600 text-xl">Токен не найден.</h2>
//       </div>
//     );
//   }

//   const result = await verifyUser(token);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
//       <h2
//         className={`mt-4 text-xl ${
//           result.success ? 'text-green-600' : 'text-red-600'
//         }`}
//       >
//         {result.message}
//       </h2>

//       {result.success && (
//         <Link
//           href={routes.customerProfile.signIn}
//           className="mt-6 text-blue-600 hover:underline"
//         >
//           Перейти к входу в кабинет
//         </Link>
//       )}
//     </div>
//   );
// }
