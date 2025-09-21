import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl

    // Если пользователь авторизован и заходит на /login → редирект на /admin
    if (pathname.startsWith("/login") && req.nextauth?.token) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }

    // Для /admin проверяем авторизацию
    if (pathname.startsWith("/admin") && !req.nextauth?.token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Разрешаем доступ только авторизованным к /admin
        return req.nextUrl.pathname.startsWith("/admin") ? !!token : true
      }
    }
  }
)

// Указываем маршруты, где применяется middleware
export const config = {
  matcher: ["/admin/:path*", "/login"]
}
