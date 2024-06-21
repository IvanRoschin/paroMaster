'use client'
import { Suspense } from 'react'
import { Toaster } from 'sonner'
import { ShoppingCartProvider } from 'app/context/ShoppingCartContext'
import { Loader } from '../components'
import PreloadedResourses from '@/utils/preloadedResourses'

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ShoppingCartProvider>
			<Suspense fallback={<Loader />}>
				<PreloadedResourses />
				{children}
				<Toaster position='top-right' richColors />
			</Suspense>
		</ShoppingCartProvider>
	)
}
