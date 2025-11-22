'use client';

import { useState } from 'react';

import { IGoodUI } from '@/types/IGood';

import { NextImage } from '../common';

interface ImagesBlockProps {
  item?: IGoodUI;
  values?: string[] | string;
}

const ImagesBlock: React.FC<ImagesBlockProps> = ({ item, values }) => {
  const [index, setIndex] = useState<number>(0);

  const renderImageGallery = (images: string[], altText: string) => {
    if (!images || images.length === 0) return null;
    const safeIndex = Math.min(index, images.length - 1);

    return (
      <div className="w-full flex flex-col items-center pb-6 sm:pb-8">
        {/* 🔹 Главное изображение */}
        <div className="w-full max-w-[300px] sm:max-w-[360px] md:max-w-[400px] mb-4 relative mx-auto">
          <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            <NextImage
              useSkeleton
              src={images[safeIndex]}
              alt={altText}
              width={350}
              height={350}
              priority
              classNames={{
                wrapper: 'w-full h-full',
                image:
                  'object-contain w-full h-full max-h-[60vh] p-1 sm:p-1.5 mx-auto',
              }}
            />
          </div>
        </div>

        {/* 🔹 Миниатюры */}
        <ul className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3 justify-center">
          {images.map((img, imgIndex) => (
            <li key={imgIndex} className="flex justify-center">
              <NextImage
                useSkeleton
                src={img}
                alt={`${altText} ${imgIndex + 1}`}
                width={80}
                height={80}
                classNames={{
                  wrapper:
                    'w-[70px] sm:w-[80px] h-[70px] sm:h-[80px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center',
                  image: `
                    border block cursor-pointer object-cover rounded-md 
                    transition-all duration-200 hover:shadow-md hover:scale-105
                    ${imgIndex === safeIndex ? 'ring-2 ring-blue-400' : ''}
                  `,
                }}
                onClick={() => setIndex(imgIndex)}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const imagesToRender = item?.src?.length
    ? item.src
    : typeof values === 'string'
      ? [values]
      : Array.isArray(values)
        ? values
        : [];

  if (imagesToRender.length === 0) return null;

  return (
    <div className="flex justify-center items-start w-full overflow-hidden">
      {renderImageGallery(imagesToRender, item?.title || 'Зображення')}
    </div>
  );
};

export default ImagesBlock;
