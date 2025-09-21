import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { Inter } from "next/font/google"

import { getAllCategories, IGetAllCategories } from "@/actions/categories"
import { getMinMaxPrice, IGetAllBrands, IGetPrices, uniqueBrands } from "@/actions/goods"
import { ISearchParams } from "../types"
import AdminSidebar from "./admin/components/AdminSidebar"
import { Footer, Header, Sidebar } from "./components"
import { authOptions } from "./config/authOptions"
import { Providers } from "./providers/providers"

import "./globals.css"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ParoMaster",
  description: "Веб-сайт по ремонту парогенераторів та продажу запчастин до парогенераторів"
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  console.log("session?.user:", session?.user) // 🔎 для дебага

  const queryClient = new QueryClient()

  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: ["prices"],
      queryFn: getMinMaxPrice
    }),
    queryClient.prefetchQuery({
      queryKey: ["categories"],
      queryFn: () => getAllCategories({} as ISearchParams)
    }),
    queryClient.prefetchQuery({
      queryKey: ["brands"],
      queryFn: uniqueBrands
    })
  ])

  const pricesData = queryClient.getQueryData<IGetPrices>(["prices"]) ?? {
    success: false,
    minPrice: 0,
    maxPrice: 100
  }

  const categoriesData = queryClient.getQueryData<IGetAllCategories>(["categories"]) ?? {
    success: false,
    count: 0,
    categories: []
  }

  const brandsData = queryClient.getQueryData<IGetAllBrands>(["brands"]) ?? {
    success: false,
    count: 0,
    brands: []
  }

  const user = session?.user
    ? {
        name: session.user.name ?? "Guest",
        email: session.user.email ?? "",
        image: session.user.image ?? `${process.env.PUBLIC_URL}/noavatar.png`
      }
    : null

  return (
    <html lang="uk">
      <body className={`${inter.className} primaryTextColor`}>
        <Providers>
          <Header session={session} />
          <div className="px-8 flex items-start flex-col md:flex-row">
            {user ? (
              <>
                <AdminSidebar user={user} />
                <div className="w-full">{children}</div>
              </>
            ) : (
              <HydrationBoundary state={dehydrate(queryClient)}>
                <Sidebar
                  pricesData={pricesData}
                  categoriesData={categoriesData}
                  brandsData={brandsData}
                />
                <div className="w-full">{children}</div>
              </HydrationBoundary>
            )}
          </div>
          <section id="footer" className="snap-start px-4">
            <Footer categories={categoriesData.categories} />
          </section>
        </Providers>
      </body>
    </html>
  )
}
