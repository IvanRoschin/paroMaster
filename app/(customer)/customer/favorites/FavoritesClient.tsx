'use client';

import React from 'react';

import { ProductCard } from '@/app/components';
import { IGoodUI } from '@/types/IGood';

interface FavoritesClientProps {
  goods: IGoodUI[];
}

const FavoritesClient: React.FC<FavoritesClientProps> = ({ goods }) => {
  if (!goods.length)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <h2 className="text-2xl font-semibold mb-2">
          У вас немає улюблених товарів
        </h2>
        <p>Перегляньте каталог та додайте товари у ваші улюблені.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="subtitle mb-6">Улюблені товари</h1>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {goods.map(good => (
            <ProductCard key={good._id} good={good} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FavoritesClient;
