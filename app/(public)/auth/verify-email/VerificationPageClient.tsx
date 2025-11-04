'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { routes } from '@/helpers/routes';

export default function VerificationPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [message, setMessage] = useState('Проверка...');
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setMessage('Токен не найден.');
      setSuccess(false);
      return;
    }

    async function verify() {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const result = await res.json();
      setMessage(result.message);
      setSuccess(result.success);

      if (result.success) {
        setTimeout(() => router.push(routes.publicRoutes.auth.signIn), 3000);
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
