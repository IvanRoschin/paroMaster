import Image from 'next/image';
import Link from 'next/link';

import { getAllCategoriesAction } from '@/app/actions/categories';
import { ICategory } from '@/types/ICategory';

// app/(public)/category/page.tsx

export default async function CategoriesPage() {
  const { categories } = await getAllCategoriesAction({});

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600">Категорії відсутні</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 container">
      <h1 className="subtitle text-center mb-8">Категорії товарів</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map((c: ICategory) => (
          <Link
            key={c._id}
            href={`/category/${c.slug}`}
            className="block bg-secondaryBackground rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
          >
            <div className="w-20 h-20 mx-auto mb-3">
              <Image
                src={c.src || '/placeholder.svg'}
                alt={c.name}
                width={80}
                height={80}
                className="object-contain mx-auto"
              />
            </div>
            <p className="font-medium text-sm">{c.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
