// app/components/FooterServer.tsx
import { getAllCategories } from '@/actions/categories';
import { ISearchParams } from '@/types/searchParams';

import FooterClient from './FooterClient';

interface FooterServerProps {
  searchParams?: ISearchParams;
}

export default async function FooterServer({
  searchParams,
}: FooterServerProps) {
  const res = await getAllCategories(searchParams ?? {});
  const categories = res?.categories ?? [];

  return <FooterClient categories={categories} />;
}
