'use client';

import { CldUploadWidget, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';

import { NextImage } from '../common';
import { Button } from '../ui';

interface ImageUploadCloudinaryProps {
  setFieldValue: (field: string, value: any) => void;
  values: string | string[];
  errors?: Record<string, any>;
  uploadPreset?: string;
  multiple?: boolean;
}

const ImageUploadCloudinary: React.FC<ImageUploadCloudinaryProps> = ({
  setFieldValue,
  values,
  errors,
  uploadPreset = 'default',
  multiple = true,
}) => {
  const [previews, setPreviews] = useState<string[]>(() =>
    // Array.isArray(values) ? [...values] : []
    Array.isArray(values) ? [...values] : values ? [values] : []
  );
  useEffect(() => {
    const newPreviews = Array.isArray(values)
      ? [...values]
      : values
        ? [values]
        : [];

    // сравниваем с текущими previews, чтобы не вызывать setPreviews лишний раз
    const isDifferent =
      newPreviews.length !== previews.length ||
      newPreviews.some((v, i) => v !== previews[i]);

    if (isDifferent) {
      setPreviews(newPreviews);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  useEffect(() => {
    setFieldValue('src', multiple ? previews : (previews[0] ?? ''));
  }, [previews, setFieldValue, multiple]);

  // useEffect(() => {
  //   setFieldValue('src', previews);
  // }, [previews, setFieldValue]);

  // const handleUpload = useCallback(
  //   (url: string) => {
  //     if (!url) return;
  //     setPreviews(prev => {
  //       const isEditing = prev.length > 0;
  //       let next: string[];
  //       if (multiple) {
  //         next = isEditing ? [...prev, url] : [url];
  //       } else {
  //         next = [url];
  //       }
  //       const unique = Array.from(new Set(next));
  //       return unique;
  //     });
  //   },
  //   [multiple]
  // );

  const handleUpload = useCallback(
    (url: string) => {
      if (!url) return;

      setPreviews(prev => {
        let next: string[];
        if (multiple) {
          next = [...prev, url];
        } else {
          next = [url];
        }
        const unique = Array.from(new Set(next));
        return unique;
      });
    },
    [multiple]
  );

  const handleRemove = useCallback((url: string) => {
    setPreviews(prev => prev.filter(img => img !== url));
  }, []);

  return (
    <div>
      {/* Зона открытия Cloudinary */}
      <CldUploadWidget
        uploadPreset={uploadPreset}
        options={{ multiple }}
        onSuccess={result => {
          const info = result?.info;
          if (!info) return;

          const url =
            typeof info === 'string'
              ? info
              : ((info as CloudinaryUploadWidgetInfo)?.secure_url ??
                (info as CloudinaryUploadWidgetInfo)?.url);

          if (url) handleUpload(url);
        }}
      >
        {({ open }) => (
          <div
            onClick={() => open?.()}
            className="relative cursor-pointer hover:opacity-80 transition border-dashed border-2 p-4 rounded-md flex flex-col items-center justify-center gap-2 text-neutral-600"
          >
            <AiOutlineCloudUpload size={28} />
            <span className="text-center text-sm">
              Завантажити {multiple ? 'фото' : 'лого'}
            </span>
          </div>
        )}
      </CldUploadWidget>

      {/* Превью */}
      {previews.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 text-center mb-3">
            Прев&apos;ю завантажених зображень
          </p>
          <div
            className="
        grid 
        gap-3 
        sm:grid-cols-2 
        md:grid-cols-3 
        justify-items-center
      "
          >
            {previews.map(url => (
              <div
                key={url}
                className="
            relative 
            w-28 h-28 
            rounded-xl 
            overflow-hidden 
            border border-gray-200 
            shadow-sm
            transition-transform 
            hover:scale-105
          "
              >
                <NextImage
                  useSkeleton
                  width={120}
                  height={120}
                  src={url}
                  alt="uploaded"
                  className="object-cover w-full h-full"
                />
                <Button
                  type="button"
                  onClick={() => handleRemove(url)}
                  small
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white p-0 flex items-center justify-center shadow-md transition-transform hover:scale-110"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {errors?.src && <p className="text-red-500 text-sm mt-1">{errors.src}</p>}
    </div>
  );
};

export default ImageUploadCloudinary;
