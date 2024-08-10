'use client'
import PreloadedResourses from '@/utils/preloadedResourses'
import { ShoppingCartProvider } from 'app/context/ShoppingCartContext'
import { SessionProvider } from 'next-auth/react'
import { Suspense } from 'react'
import { Toaster } from 'sonner'
import { Loader } from '../components'

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<ShoppingCartProvider>
				<Suspense fallback={<Loader />}>
					<PreloadedResourses />
					{children}
					<Toaster position='top-right' richColors />
				</Suspense>
			</ShoppingCartProvider>
		</SessionProvider>
	)
}
