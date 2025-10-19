'use client';

import { FormikErrors } from 'formik';
import { ChangeEvent, useState } from 'react';

import { ImagesBlock } from '@/components/index';
import { IGoodUI } from '@/types/IGood';
import { uploadCloudinary } from '@/utils/uploadCloudinary';

interface FormikProps {
  setFieldValue: (
    field: string,
    value: string[],
    shouldValidate?: boolean
  ) => void;
  values?: string[] | string;
  errors?: {
    [key: string]: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  };
  good?: IGoodUI;
}

const ImagesUpload: React.FC<FormikProps> = ({
  setFieldValue,
  values,
  errors,
  good,
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);

  const upload = async () => {
    try {
      let arr: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const data = await uploadCloudinary(images[i]);
        if (data?.url) arr.push(data.url);
      }
      setFieldValue('src', arr);
      setIsUploaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* Display uploaded images */}
      {values && values.length > 0 && (
        <ImagesBlock item={good} values={values} />
      )}

      <div className="my-10">
        <h3 className="text-lg mb-4">Додати фото товару</h3>
        <div className="flex justify-center items-center">
          <input
            type="file"
            placeholder="Додати фото"
            multiple
            className="mb-5"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) {
                const fileList = Array.from(e.target.files);
                setImages(fileList);
              }
            }}
          />
          <button
            type="button"
            onClick={upload}
            className="p-2 mr-8 w-[150px] border border-gray-400 rounded-md hover:bg-gray-300 transition ease-in-out relative"
          >
            Завантажити{isUploaded && '...'}
            {errors?.src && (
              <span className="text-red-500">{errors?.src as any}</span>
            )}
            {isUploaded && (
              <span
                className={`bg-[url('/success-check.png)'] bg-no-repeat bg-center bg-cover w-[20px] h-[20px] absolute top-[-10px] right-[-10px]`}
              ></span>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setImages([]);
              setIsUploaded(false);
            }}
            className="p-2 w-[150px] border border-gray-400 rounded-md hover:bg-gray-300 transition ease-in-out"
          >
            Скасувати
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagesUpload;
