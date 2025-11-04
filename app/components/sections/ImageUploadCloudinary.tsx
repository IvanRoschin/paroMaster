'use client';

import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useCallback, useMemo } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';

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
  const handleUpload = useCallback(
    (result: any) => {
      const url = result?.info?.secure_url;
      if (!url) return;

      console.log('✅ Uploaded URL:', url);

      if (multiple) {
        const updated = Array.isArray(values)
          ? [...values, url]
          : values
            ? [values, url]
            : [url];
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
        values.filter(img => img && img !== url)
      );
    } else {
      setFieldValue('src', '');
    }
  };

  // безопасно формируем список картинок
  const images: string[] = useMemo(() => {
    if (multiple) {
      if (Array.isArray(values)) return values.filter(Boolean);
      if (values) return [values];
      return [];
    } else {
      if (typeof values === 'string' && values.trim() !== '') return [values];
      return [];
    }
  }, [values, multiple]);

  return (
    <div>
      <CldUploadWidget
        uploadPreset={uploadPreset}
        onSuccess={handleUpload} // <-- заменили onUpload
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
      {images.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {images.map(url => (
            <div key={url} className="relative w-28 h-28">
              <Image
                fill
                src={url}
                alt="uploaded"
                className="object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {errors?.src && <p className="text-red-500 text-sm mt-1">{errors.src}</p>}
    </div>
  );
};

export default ImageUploadCloudinary;
