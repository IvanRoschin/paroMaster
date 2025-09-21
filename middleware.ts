import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl

    // Если пользователь авторизован и заходит на /login → редирект на /admin
    if (pathname.startsWith("/login") && req.nextauth?.token) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }

    // Если пользователь не авторизован и пытается зайти на /admin → редирект на /login
    if (pathname.startsWith("/admin") && !req.nextauth?.token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Для остальных маршрутов — пропускаем
    return NextResponse.next()
  },
  {
    callbacks: {
      // Контролируем доступ только для /admin
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token // true только если есть токен
        }
        return true // для остальных маршрутов доступ разрешён
      }
    }
  }
)

// Настраиваем middleware на маршруты
export const config = {
  matcher: ["/admin/:path*", "/login"]
}
