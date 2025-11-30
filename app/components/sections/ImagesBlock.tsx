'use client';

import { useState } from 'react';

import { IGoodUI } from '@/types/IGood';

import { NextImage } from '../common';

interface ImagesBlockProps {
  item?: IGoodUI;
  values?: string[] | string;
  className?: string;
}

const ImagesBlock: React.FC<ImagesBlockProps> = ({
  item,
  values,
  className,
}) => {
  const [index, setIndex] = useState<number>(0);

  const renderImageGallery = (images: string[], altText: string) => {
    if (!images || images.length === 0) return null;
    const safeIndex = Math.min(index, images.length - 1);

    return (
      <div className="flex flex-col items-center pb-6 sm:pb-8 w-full">
        {/* 🔹 Главное изображение */}
        <div className="w-full max-w-[400px] md:max-w-[450px] mb-4 relative mx-auto">
          <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            <NextImage
              useSkeleton
              src={images[safeIndex]}
              alt={altText}
              width={450}
              height={450}
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
        <ul className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3 justify-center w-full">
          {images.map((img, imgIndex) => (
            <li key={imgIndex} className="flex justify-center">
              <NextImage
                useSkeleton
                src={img}
                alt={`${altText} ${imgIndex + 1}`}
                width={80}
                height={80}
                classNames={{
                  wrapper: `
                    w-[60px] sm:w-[70px] md:w-[80px] 
                    h-[60px] sm:h-[70px] md:h-[80px] 
                    bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center
                  `,
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
    <div
      className={`flex justify-center items-start overflow-hidden ${className || ''}`}
    >
      {renderImageGallery(imagesToRender, item?.title || 'Зображення')}
    </div>
  );
};

export default ImagesBlock;
