import * as React from 'react';

import Image, { ImageProps } from 'next/image';

import { Skeleton } from '@/components/common';
import { cn } from '@/lib';

type NextImageProps = {
  useSkeleton?: boolean;
  classNames?: {
    image?: string;
    wrapper?: string;
  };
  alt: string;
  fill?: boolean;
} & ImageProps;

export default function NextImage({
  useSkeleton = false,
  src,
  width,
  height,
  alt,
  fill,
  className,
  classNames,
  ...rest
}: NextImageProps) {
  const [isLoading, setIsLoading] = React.useState(useSkeleton);
  const widthIsSet = className?.includes('w-') ?? false;

  return (
    <figure
      style={
        !fill && !widthIsSet
          ? { width: `${width}px`, height: `${height}px` }
          : undefined
      }
      className={cn('relative overflow-hidden', classNames?.wrapper, className)}
    >
      {useSkeleton && isLoading && (
        <Skeleton
          className={cn(
            'absolute inset-0 z-0 w-full h-full rounded-md animate-pulse'
          )}
        />
      )}

      <Image
        {...(fill ? { fill: true } : { width, height })}
        className={cn(
          'transition-opacity duration-500 object-contain',
          isLoading ? 'opacity-0' : 'opacity-100',
          classNames?.image
        )}
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        {...rest}
      />
    </figure>
  );
}
