'use client';

import React, { Suspense } from 'react';

import { ICategorySerialized } from '@/app/actions/categories';
import { Breadcrumbs, CardView, ProductListSkeleton } from '@/app/components';
import { IGoodUI, ISearchParams } from '@/types/index';
import { UserRole } from '@/types/IUser';

interface CategoryClientProps {
  category: ICategorySerialized;
  goods: IGoodUI[];
  search: ISearchParams;
  role: UserRole;
}

const CategoryClient: React.FC<CategoryClientProps> = ({
  category,
  goods,
  search,
  role,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-3 container">
      <Breadcrumbs />
      <h2 className="subtitle mb-3 text-center">
        {category.name}{' '}
        <span className="text-sm text-gray-500">({goods.length})</span>
      </h2>
      <Suspense fallback={<ProductListSkeleton />}>
        <CardView goods={goods} role={role} searchParams={search} />
      </Suspense>
    </div>
  );
};

export default CategoryClient;
