import AdminSidebar from '@/components/admin/AdminSidebar'
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { auth } from '../auth.js'
import { Header, Sidebar } from './components'
import "./globals.css"
import { Providers } from './providers/providers'
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ParoMaster",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="uk">
      <body className={`${inter.className} primaryTextColor`}>
        <Providers>
          <Header />
          <div className='px-8 flex items-start'>
            {session?.user ? (
              <>
                <AdminSidebar user={session.user} />
                <div className='w-full'>
                  {children}
                </div>
                {/* <Navbar /> */}
              </>
            ) : (
              <>
                <Sidebar />
                <div className='w-full'>
                  {children}
                </div>
              </>
            )}
          </div>
        </Providers>
      </body>
    </html>
  );
}
