import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { useDebouncedCallback } from 'use-debounce';

import { getAllGoods } from '@/actions/goods';
import { Button, Icon } from '@/components/ui';
import { useFetchData } from '@/hooks/index';
import { IGood } from '@/types/index';

const Search = ({ placeholder }: { placeholder: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { replace, push } = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<IGood[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const { data } = useFetchData(getAllGoods, ['goods'], searchParams);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const debouncedSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }

    if (value.length > 2 && data?.goods) {
      const searchFields: (keyof IGood)[] = [
        'title',
        'model',
        'vendor',
        'brand',
      ];
      const filtered = data.goods.filter(good =>
        searchFields.some(field =>
          good[field]?.toString().toLowerCase().includes(value.toLowerCase())
        )
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, 300);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const clearInput = () => {
    setInputValue('');
    setSuggestions([]);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const value = inputValue.trim();
    if (value.length === 0) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('q', value);

    push(`/search?${params.toString()}`);
    setSuggestions([]);
  };

  return (
    <form className="w-full mx-7 relative" onSubmit={handleSubmit}>
      <label className="mb-2 text-sm font-medium text-gray-900 sr-only">
        Пошук
      </label>
      <div className="relative w-full flex justify-center items-center">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none z-10">
          <CiSearch />
        </div>
        <input
          type="text"
          name="search"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          className="relative py-1 block w-full ps-10 mr-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primaryAccentColor focus:border-primaryAccentColor"
        />

        <button
          type="button"
          className="absolute top-[15%] right-[120px]"
          style={{ display: inputValue ? 'block' : 'none' }}
          onClick={clearInput}
        >
          <Icon
            name="icon_close"
            className="w-5 h-5 border border-primaryAccentColor text-primaryAccentColor p-1 rounded-full hover:bg-primaryAccentColor hover:text-white"
          />
        </button>

        <Button type="submit" label="Знайти" small width="80" />
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute z-20 w-full bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
          {suggestions.map(product => (
            <li key={product._id}>
              <Link
                href={`/good/${product._id}`}
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  setSuggestions([]);
                  setInputValue('');
                }}
              >
                <div className="font-medium">{product.category}</div>
                <div className="text-gray-600 text-sm">
                  {product.title} &middot; {product.brand} &middot;
                  {Number(product.price).toFixed(2)} ₴
                </div>
                {product.model && (
                  <div className="text-gray-500 text-sm mt-1">
                    Модель: {product.model}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default Search;
