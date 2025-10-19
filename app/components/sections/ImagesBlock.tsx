'use client';

import Image from 'next/image';
import { useState } from 'react';

import { getCloudinaryUrl } from '@/helpers/index';
import { IGoodUI } from '@/types/IGood';

interface ImagesBlockProps {
  item?: IGoodUI;
  values?: string[] | string;
}

const ImagesBlock: React.FC<ImagesBlockProps> = ({ item, values }) => {
  const [index, setIndex] = useState<number>(0);

  const renderImageGallery = (images: string[], altText: string) => (
    <div className="mr-[50px] pb-[40px]">
      {/* Главное изображение */}
      <div className="w-[400px] h-[400px] mb-6">
        <Image
          src={getCloudinaryUrl(images[index], 400, 400)}
          alt={altText}
          width={400}
          height={400}
          className="rounded-md object-cover w-full h-full"
          priority
        />
      </div>

      {/* Превьюшки */}
      <ul className="grid grid-cols-3 gap-3">
        {images.map((img, imgIndex) => (
          <li key={imgIndex}>
            <Image
              src={getCloudinaryUrl(img, 120, 120)} // ← исправлено здесь!
              alt={`${altText} ${imgIndex + 1}`}
              width={120}
              height={120}
              className={`
                border block cursor-pointer rounded-md object-cover 
                transition-all duration-200 hover:shadow-md hover:scale-105
                ${imgIndex === index ? 'ring-2 ring-blue-400' : ''}
              `}
              onClick={() => setIndex(imgIndex)}
            />
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div>
      {item &&
        (item.src?.length > 0
          ? renderImageGallery(item.src, item.title)
          : Array.isArray(values) && values.length > 0
            ? renderImageGallery(values, 'Зображення')
            : null)}
    </div>
  );
};

export default ImagesBlock;
