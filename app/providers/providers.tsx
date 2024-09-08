'use client'
import PreloadedResourses from '@/utils/preloadedResourses'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ShoppingCartProvider } from 'app/context/ShoppingCartContext'
import { SessionProvider } from 'next-auth/react'
import { Suspense, useState } from 'react'
import { Toaster } from 'sonner'
import { Loader } from '../components'
export function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient())

	return (
		<SessionProvider>
			<ShoppingCartProvider>
				<Suspense fallback={<Loader />}>
					<PreloadedResourses />
					<QueryClientProvider client={queryClient}>
						{children}
						<ReactQueryDevtools initialIsOpen={false} />
					</QueryClientProvider>
					<Toaster position='top-right' richColors />
				</Suspense>
			</ShoppingCartProvider>
		</SessionProvider>
	)
}
