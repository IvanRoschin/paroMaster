'use client'
import PreloadedResourses from '@/utils/preloadedResourses'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ShoppingCartProvider } from 'app/context/ShoppingCartContext'
import { SessionProvider } from 'next-auth/react'
import { Suspense } from 'react'
import { Toaster } from 'sonner'
import { Loader } from '../components'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider>
				<ShoppingCartProvider>
					<Suspense fallback={<Loader />}>
						<PreloadedResourses />
						{children}
						<Toaster position='top-right' richColors />
					</Suspense>
				</ShoppingCartProvider>
			</SessionProvider>
		</QueryClientProvider>
	)
}
