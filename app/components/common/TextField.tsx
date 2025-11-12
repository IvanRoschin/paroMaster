'use client';

import { Field, useField } from 'formik';

interface FormFieldProps {
  item: {
    id: string;
    label?: string;
    as?: string;
    type?: string;
    disabled?: boolean;
    required?: boolean;
  };
}

const TextField: React.FC<FormFieldProps> = ({ item }) => {
  const [, meta] = useField(item.id);

  return (
    <div className="relative w-full mb-4">
      <Field
        as={item.as || 'input'}
        id={item.id}
        name={item.id}
        type={item.type || 'text'}
        disabled={item.disabled}
        className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition
          disabled:opacity-70 disabled:cursor-not-allowed
          ${
            meta.error && meta.touched
              ? 'border-rose-500 focus:border-rose-500'
              : 'border-neutral-300 focus:border-green-500'
          }
        `}
      />

      {item.label && (
        <label
          htmlFor={item.id}
          className="absolute text-md text-primaryTextColor duration-150 left-3 top-5 z-10 origin-[0]
            transform -translate-y-3
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
            peer-focus:scale-75 peer-focus:-translate-y-3"
        >
          {item.label}
        </label>
      )}

      {meta.touched && meta.error && (
        <p className="text-rose-500 text-sm mt-1">
          {typeof meta.error === 'string'
            ? meta.error
            : (meta.error as any)?.message || 'Помилка'}
        </p>
      )}
    </div>
  );
};

export default TextField;
