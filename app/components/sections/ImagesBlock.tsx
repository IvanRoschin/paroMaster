'use client';

import Image from 'next/image';
import { useState } from 'react';

import { IGood } from '@/types/IGood';

interface ImagesBlockProps {
  item?: IGood;
  values?: string[] | string;
}

const ImagesBlock: React.FC<ImagesBlockProps> = ({ item, values }) => {
  const [index, setIndex] = useState<number>(0);

  const renderImageGallery = (images: string[], altText: string) => (
    <div className="mr-[50px] pb-[40px]">
      <div className="w-[400px] h-[400px] mb-6">
        <Image
          src={images[index]}
          alt={altText}
          width={400}
          height={400}
          className="rounded-md object-cover w-full h-full"
          priority={true}
        />
      </div>
      <ul className="grid grid-cols-3 gap-3">
        {images.map((img, imgIndex) => (
          <li key={imgIndex}>
            <Image
              src={img}
              alt={`${altText} ${imgIndex + 1}`}
              width={120}
              height={120}
              className={`
                border border-gray-300 block cursor-pointer 
                rounded-md object-cover 
                transition-all duration-200 
                hover:shadow-md hover:scale-105
                ${imgIndex === images.length - 1 ? 'mr-0' : ''}
              `}
              onClick={() => setIndex(imgIndex)}
              priority={true}
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
