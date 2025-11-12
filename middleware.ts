import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

import { routes } from './app/helpers/routes';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const url = req.nextUrl;

  const role = token?.role?.toUpperCase() || 'GUEST';
  const isAdminRoute = url.pathname.startsWith('/admin');
  const isCustomerRoute = url.pathname.startsWith('/customer');

  // ✅ Админ может везде
  if (role === 'ADMIN') {
    return NextResponse.next();
  }

  // ✅ Клиент может на публичные и /customer
  if (role === 'CUSTOMER' && !isAdminRoute) {
    return NextResponse.next();
  }

  // ✅ Гость может только на публичные
  if (!isAdminRoute && !isCustomerRoute) {
    return NextResponse.next();
  }

  // 🚫 Остальные случаи — редирект на вход
  return NextResponse.redirect(
    new URL(routes.publicRoutes.auth.signIn, req.url)
  );
}

// ✅ ограничиваем скоуп
export const config = {
  matcher: ['/admin/:path*', '/customer/:path*'],
};
