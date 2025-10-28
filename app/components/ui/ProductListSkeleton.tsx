import React from 'react';

const ProductListSkeleton: React.FC = () => {
  // Количество "скелетонов" на странице
  const skeletonCount = 8;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 bg-white shadow-sm animate-pulse"
        >
          <div className="w-full h-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

export default ProductListSkeleton;
