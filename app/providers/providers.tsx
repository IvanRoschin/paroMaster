'use client';

import { SessionProvider } from 'next-auth/react';
import { Suspense, useState } from 'react';
import { Toaster } from 'sonner';

import PreloadedResources from '@/app/utils/PreloadedResources';
import { Loader } from '@/components';
import {
  DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface ProvidersProps {
  children: React.ReactNode;
  dehydratedState?: DehydratedState;
}

export function Providers({ children, dehydratedState }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      {/* <FiltersProvider>
        <CompareProvider>
          <FavoritesProvider>
            <ShoppingCartProvider> */}
      <Suspense fallback={<Loader />}>
        <PreloadedResources />
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={dehydratedState}>
            {children}
          </HydrationBoundary>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <Toaster position="top-right" richColors />
      </Suspense>
      {/* </ShoppingCartProvider>
          </FavoritesProvider>
        </CompareProvider>
      </FiltersProvider> */}
    </SessionProvider>
  );
}
