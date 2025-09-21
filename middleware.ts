import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl

    // Проверяем только авторизованных на login → редирект на admin
    if (pathname.startsWith("/login") && req.nextauth?.token) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Авторизация только для /admin
        return req.nextUrl.pathname.startsWith("/admin") ? !!token : true // для /login всегда true (чтобы не было редиректа)
      }
    }
  }
)

export const config = {
  matcher: ["/admin/:path*", "/login"]
}
export { default } from "next-auth/middleware"

export const config = { matcher: ["/admin", "/protected/:path"] }

