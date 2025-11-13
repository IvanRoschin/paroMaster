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
      <div className="mr-0 sm:mr-[40px] pb-[30px] flex flex-col items-center">
        {/* 🔹 Главное изображение */}
        <div className="w-full max-w-[400px] sm:max-w-[450px] mb-4">
          <NextImage
            useSkeleton
            src={images[safeIndex]}
            width={400}
            height={400}
            alt={altText}
            classNames={{
              wrapper:
                'w-full h-auto aspect-square bg-gray-100 rounded-lg overflow-hidden',
              image:
                'object-contain w-full h-full p-2 sm:p-3 max-h-[250px] sm:max-h-[350px] md:max-h-[400px] mx-auto',
            }}
          />
        </div>

        {/* 🔹 Миниатюры */}
        <ul className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3 justify-center">
          {images.map((img, imgIndex) => (
            <li key={imgIndex}>
              <NextImage
                useSkeleton
                src={img}
                alt={`${altText} ${imgIndex + 1}`}
                width={90}
                height={90}
                classNames={{
                  wrapper:
                    'w-full h-full bg-gray-100 rounded-lg overflow-hidden',
                  image: `
                    border block cursor-pointer rounded-md object-cover 
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
    <div className="flex justify-center items-center w-full">
      {renderImageGallery(imagesToRender, item?.title || 'Зображення')}
    </div>
  );
};

export default ImagesBlock;
