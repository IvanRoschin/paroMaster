'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Props = {
  count: number;
  pageNumbers: number[];
};

const Pagination = ({ count, pageNumbers }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams.toString());
  const page = parseInt(searchParams.get('page') || '1');
  const ITEM_PER_PAGE = 4;
  params.set('limit', ITEM_PER_PAGE.toString());

  const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
  const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count;

  const handleChangePage = (type: 'назад' | 'вперед') => {
    const newPage = type === 'назад' ? page - 1 : page + 1;
    params.set('page', newPage.toString());
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex p-2 justify-between">
      <button
        className="cursor-pointer py-2 disabled:cursor-not-allowed nav bg-slate-300 rounded-2xl px-8"
        disabled={!hasPrev}
        onClick={() => handleChangePage('назад')}
      >
        Назад
      </button>
      <div className="flex gap-4 justify-center items-center">
        {pageNumbers.map((pageNumber, index) => (
          <div key={index}>
            <Link
              href={`?page=${pageNumber}`}
              className={
                page === pageNumber
                  ? '  bg-transparent text-primaryAccentColor p-3  '
                  : '  bg-transparent text-primaryTextColor hover:text-primaryAccentColor p-2 '
              }
            >
              {pageNumber}
            </Link>
          </div>
        ))}
      </div>
      <button
        className="cursor-pointer py-2 disabled:cursor-not-allowed nav bg-slate-300 rounded-2xl px-8"
        disabled={!hasNext}
        onClick={() => handleChangePage('вперед')}
      >
        Вперед
      </button>
    </div>
  );
};

export default Pagination;
