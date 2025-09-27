'use client';

import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useCallback } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';

interface ImageUploadCloudinaryProps {
  setFieldValue: (field: string, value: any) => void;
  values: string | string[];
  errors?: Record<string, any>;
  uploadPreset?: string;
  multiple?: boolean; // 👈 добавил
}

const ImageUploadCloudinary: React.FC<ImageUploadCloudinaryProps> = ({
  setFieldValue,
  values,
  errors,
  uploadPreset = 'default',
  multiple = true,
}) => {
  const handleUpload = useCallback(
    (result: any) => {
      const url = result?.info?.secure_url;
      if (!url) return;

      if (multiple) {
        const updated = Array.isArray(values) ? [...values, url] : [url];
        setFieldValue('src', updated);
      } else {
        setFieldValue('src', url);
      }
    },
    [setFieldValue, values, multiple]
  );

  const handleRemove = (url: string) => {
    if (multiple && Array.isArray(values)) {
      setFieldValue(
        'src',
        values.filter(img => img !== url)
      );
    } else {
      setFieldValue('src', '');
    }
  };

  const images = multiple
    ? Array.isArray(values)
      ? values
      : []
    : values
      ? [values]
      : [];

  return (
    <div>
      <CldUploadWidget
        uploadPreset={uploadPreset}
        onUpload={handleUpload}
        options={{ multiple }}
      >
        {({ open }) => (
          <div
            onClick={() => open?.()}
            className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-4 rounded-md flex flex-col items-center justify-center gap-2 text-neutral-600"
          >
            <AiOutlineCloudUpload size={30} />
            <span>Завантажити {multiple ? 'фото' : 'лого'}</span>
          </div>
        )}
      </CldUploadWidget>

      {/* превью */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {images.map((url, idx) => (
          <div key={idx} className="relative w-28 h-28">
            <Image
              fill
              src={url as string}
              alt="uploaded"
              className="object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => handleRemove(url as string)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {errors?.src && <p className="text-red-500 text-sm mt-1">{errors.src}</p>}
    </div>
  );
};

export default ImageUploadCloudinary;
