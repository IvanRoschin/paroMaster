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
      <div className="mr-0 sm:mr-[50px] pb-[40px]">
        {/* Главное изображение */}
        <div className="w-[400px] h-[400px] mb-6">
          <NextImage
            useSkeleton
            src={images[safeIndex]}
            width={400}
            height={400}
            alt={altText}
            classNames={{
              wrapper: 'w-full h-full bg-gray-100 rounded-lg overflow-hidden',
              image: 'object-contain p-2',
            }}
          />
        </div>

        {/* Превьюшки */}
        <ul className="grid grid-cols-3 gap-3">
          {images.map((img, imgIndex) => (
            <li key={imgIndex}>
              <NextImage
                useSkeleton
                src={img}
                alt={`${altText} ${imgIndex + 1}`}
                width={120}
                height={120}
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
    <div>{renderImageGallery(imagesToRender, item?.title || 'Зображення')}</div>
  );
};

export default ImagesBlock;
