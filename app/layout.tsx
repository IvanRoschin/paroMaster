import "./globals.css"

import AdminSidebar from "app/admin/components/AdminSidebar"
import { getServerSession } from "next-auth"
import { Inter } from "next/font/google"

import { getAllCategories, IGetAllCategories } from "@/actions/categories"
import { getMinMaxPrice, IGetAllBrands, IGetPrices, uniqueBrands } from "@/actions/goods"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

import { ISearchParams } from "../types"
import { Footer, Header, Sidebar } from "./components"
import ErrorMessage from "./components/ui/ErrorMessage"
import { authOptions } from "./config/authOptions"
import { usePrefetchData } from "./hooks"
import { Providers } from "./providers/providers"

import type { Metadata } from "next"
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

  const preFetchPrices = async () => {
    const response = await getMinMaxPrice()
    return { success: true, minPrice: response.minPrice, maxPrice: response.maxPrice }
  }

  const preFetchCategories = async () => {
    const response = await getAllCategories({} as ISearchParams)
    return { success: true, categories: response.categories }
  }

  const preFetchBrands = async () => {
    const response = await uniqueBrands()
    return { success: true, brands: response.brands }
  }

  const queries = [
    { key: "prices", fetchFn: preFetchPrices },
    { key: "categories", fetchFn: preFetchCategories },
    { key: "brands", fetchFn: preFetchBrands }
  ]

  try {
    await usePrefetchData(getMinMaxPrice, ["prices"])

    await Promise.all(
      queries.map(({ key, fetchFn }) =>
        queryClient.prefetchQuery({
          queryKey: [key],
          queryFn: fetchFn as () => Promise<unknown>
        })
      )
    )
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
              <div>
                <ErrorMessage error={"Error loading data"} />
              </div>
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
