'use client';

import { ReactNode } from 'react';

import { SessionUser } from '@/types/IUser';

interface CustomerLayoutProps {
  user: SessionUser | null;
  children: ReactNode;
}

export default function CustomerLayout({
  user,
  children,
}: CustomerLayoutProps) {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <main className="flex-1 bg-white">{children}</main>
    </div>
  );
}
