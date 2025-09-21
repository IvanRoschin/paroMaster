import { withAuth } from "next-auth/middleware"
import { NextFetchEvent, NextRequest, NextResponse } from "next/server"

// Список публичных страниц
const publicPages = [
  "/",
  "/catalog",
  "/good/[productId]",
  "/ourworks",
  "/services",
  "/delivery",
  "/guarantee",
  "/contact",
  "/login",
  "/404"
]

// Настраиваем authMiddleware
const authMiddleware = withAuth({
  callbacks: {
    authorized: ({ token }) => !!token
  }
})

// Обёртка для middleware, чтобы корректно обрабатывать публичные страницы
export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const isPublic = publicPages.some(path => {
    const regexPath = path.replace(/\[([^\]]+)\]/g, "[^/]+")
    const regex = new RegExp(`^${regexPath}/?$`, "i")
    return regex.test(req.nextUrl.pathname)
  })

  if (isPublic) {
    return NextResponse.next()
  }

  // Принудительно кастуем req к NextRequestWithAuth
  return authMiddleware(req as any, ev)
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"]
}
