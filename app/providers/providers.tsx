'use client';

import { ShoppingCartProvider } from 'app/context/ShoppingCartContext';
import { SessionProvider } from 'next-auth/react';
import { Suspense, useState } from 'react';
import { Toaster } from 'sonner';

import { Loader } from '@/components';
import { FiltersProvider } from '@/context/FiltersContext';
import PreloadedResourses from '@/utils/preloadedResourses';
import {
  DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { CompareProvider } from '../context/CompareContext';
import { FavoritesProvider } from '../context/FavoritesContext';

interface ProvidersProps {
  children: React.ReactNode;
  dehydratedState?: DehydratedState;
}

export function Providers({ children, dehydratedState }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <FiltersProvider>
        <CompareProvider>
          <FavoritesProvider>
            <ShoppingCartProvider>
              <Suspense fallback={<Loader />}>
                <PreloadedResourses />
                <QueryClientProvider client={queryClient}>
                  <HydrationBoundary state={dehydratedState}>
                    {children}
                  </HydrationBoundary>
                  <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
                <Toaster position="top-right" richColors />
              </Suspense>
            </ShoppingCartProvider>
          </FavoritesProvider>
        </CompareProvider>
      </FiltersProvider>
    </SessionProvider>
  );
}
