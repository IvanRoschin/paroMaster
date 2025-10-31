import { useEffect, useState } from 'react';

import { IWarehouse } from '@/types/index';

interface Props {
  name: string;
  warehouses: IWarehouse[];
  value: string;
  setFieldValue: (field: string, value: any) => void;
  disabled?: boolean;
  errors?: any;
  touched?: any;
}

export const WarehouseSelect = ({
  name,
  warehouses,
  value,
  setFieldValue,
  disabled,
  errors,
  touched,
}: Props) => {
  const [search, setSearch] = useState(value || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filtered, setFiltered] = useState<IWarehouse[]>([]);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    setFiltered(
      warehouses.filter(
        w =>
          w.Description.toLowerCase().includes(q) ||
          w.ShortAddress.toLowerCase().includes(q)
      )
    );
  }, [search, warehouses]);

  useEffect(() => {
    setSearch(value || '');
  }, [value]);

  const handleSelect = (wh: IWarehouse) => {
    setFieldValue(name, wh.Description);
    setSearch(wh.Description);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full mb-4">
      <input
        value={search}
        disabled={disabled}
        onChange={e => {
          setSearch(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        placeholder="Введіть номер або адресу відділення"
        className={`w-full p-4 pt-6 border-2 rounded-md outline-none
          ${errors?.[name] && touched?.[name] ? 'border-rose-500' : 'border-neutral-300'}
          ${errors?.[name] && touched?.[name] ? 'focus:border-rose-500' : 'focus:border-green-500'}
        `}
      />
      <label className="absolute left-3 top-0 text-md z-9">
        Оберіть відділення
      </label>

      {showDropdown && filtered.length > 0 && (
        <div className="absolute z-10 w-full bg-white border rounded-md max-h-60 overflow-y-auto">
          {filtered.map((wh, i) => (
            <div
              key={wh.Ref}
              onMouseDown={() => handleSelect(wh)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {wh.Description}
            </div>
          ))}
        </div>
      )}
      {touched?.[name] && errors?.[name] && (
        <div className="text-rose-500 text-sm mt-1">{errors[name]}</div>
      )}
    </div>
  );
};
