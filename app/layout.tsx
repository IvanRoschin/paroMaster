import { IGetAllCategories } from "@/actions/categories"
import { IGetAllBrands, IGetPrices } from "@/actions/goods"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { Inter } from "next/font/google"
import { Footer, Header, Sidebar } from "./components"
import { authOptions } from "./config/authOptions"
import "./globals.css"
import { brandsOptions } from "./prefetchOptions/brandsOptions"
import { categoriesOptions } from "./prefetchOptions/categoriesOptions"
import { pricesOptions } from "./prefetchOptions/pricesOptions"
import { Providers } from "./providers/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ParoMaster",
  description: "Веб-сайт по ремонту парогенераторів та продажу запчастин до парогенераторів"
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  const user = {
    name: session?.user?.name ?? "Guest",
    email: session?.user?.email ?? "",
    image: session?.user?.image ?? `${process.env.PUBLIC_URL}/noavatar.png`
  }

  const queryClient = new QueryClient()

  try {
    await queryClient.prefetchQuery(pricesOptions)
    await queryClient.prefetchQuery(categoriesOptions)
    await queryClient.prefetchQuery(brandsOptions)
  } catch (error) {
    console.error("Error prefetching data:", error)
  }
  // Provide default values to avoid 'undefined' issues
  const pricesData = queryClient.getQueryData<IGetPrices>(["prices"]) || {
    success: false,
    minPrice: 0,
    maxPrice: 100
  }
  const categoriesData = queryClient.getQueryData<IGetAllCategories>(["categories"]) || {
    success: false,
    count: 0,
    categories: []
  }
  const brandsData = queryClient.getQueryData<IGetAllBrands>(["brands"]) || {
    success: false,
    count: 0,
    brands: []
  }

  // Check if data exists and has content
  const hasValidData =
    pricesData?.minPrice !== undefined &&
    pricesData.maxPrice !== undefined &&
    categoriesData?.categories.length > 0 &&
    brandsData.brands.length > 0

  return (
    <html lang="uk">
      <body className={`${inter.className} primaryTextColor`}>
        <Providers>
          <Header session={session} />
          <div className="px-8 flex items-start flex-col md:flex-row">
            {session?.user ? (
              <>
                <AdminSidebar user={user} />
                <div className="w-full">{children}</div>
              </>
            ) : hasValidData ? (
              <HydrationBoundary state={dehydrate(queryClient)}>
                <Sidebar
                  pricesData={pricesData}
                  categoriesData={categoriesData}
                  brandsData={brandsData}
                />
                <div className="w-full">{children}</div>
              </HydrationBoundary>
            ) : (
              <div>Error loading data</div>
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
