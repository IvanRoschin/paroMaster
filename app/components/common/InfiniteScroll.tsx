'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { TailSpin } from 'react-loader-spinner';

import { getAllGoods } from '@/actions/goods';
import { ProductList } from '@/components/ui';
import { useFilter } from '@/context/FiltersContext';
import { IGoodUI } from '@/types/IGood';
import { ISearchParams } from '@/types/searchParams';

interface Option {
  value: string;
  label: string;
}

interface InfiniteScrollProps {
  categories?: Option[];
  brands?: Option[];
  initialGoods: IGoodUI[];
  searchParams: ISearchParams;
}

export default function InfiniteScroll({
  initialGoods,
  searchParams,
  categories,
  brands,
}: InfiniteScrollProps) {
  const [goods, setGoods] = useState<IGoodUI[]>(initialGoods || []);
  const [pagesLoaded, setPagesLoaded] = useState(1);
  const [allGoodsLoaded, setAllGoodsLoaded] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.5 });

  const { minPrice, maxPrice, selectedBrands, selectedCategory, sort } =
    useFilter();

  const brandsSlugs = useMemo(
    () => selectedBrands.map(b => b.slug),
    [selectedBrands]
  );
  console.log('brandsSlugs', brandsSlugs);
  const sortParam = sort === 'asc' || sort === 'desc' ? sort : undefined;
  console.log('sortParam', sortParam);

  // ✅ Debounced fetch при изменении фильтров
  useEffect(() => {
    const handler = setTimeout(async () => {
      setIsFetchingMore(true);

      const filteredGoods = await getAllGoods({
        ...searchParams,
        page: '1',
        low: minPrice?.toString(),
        high: maxPrice?.toString(),
        brands: brandsSlugs,
        category: selectedCategory,
        sort: sortParam,
      });

      if (filteredGoods?.goods?.length) {
        setGoods(filteredGoods.goods);
        setPagesLoaded(1);
        setAllGoodsLoaded(false);
      } else {
        setGoods([]);
        setAllGoodsLoaded(true);
      }

      setIsFetchingMore(false);
    }, 300); // ⏳ задержка 300 мс

    return () => clearTimeout(handler); // очистка при каждом изменении
  }, [
    minPrice,
    maxPrice,
    brandsSlugs,
    sortParam,
    selectedCategory,
    searchParams,
  ]);

  // Подгрузка следующей страницы
  const loadMoreGoods = useCallback(async () => {
    if (isFetchingMore || allGoodsLoaded) return;
    setIsFetchingMore(true);

    const nextPage = pagesLoaded + 1;
    const newGoods = await getAllGoods({
      ...searchParams,
      page: nextPage.toString(),
      low: minPrice?.toString(),
      high: maxPrice?.toString(),
      brands: brandsSlugs,
      sort: sortParam,
    });

    if (newGoods?.goods?.length > 0) {
      setGoods(prev => [...prev, ...newGoods.goods]);
      setPagesLoaded(nextPage);
    } else {
      setAllGoodsLoaded(true);
    }

    setIsFetchingMore(false);
  }, [
    sortParam,
    isFetchingMore,
    allGoodsLoaded,
    pagesLoaded,
    searchParams,
    minPrice,
    maxPrice,
    brandsSlugs,
  ]);

  // Триггер подгрузки при скролле
  useEffect(() => {
    if (inView && !allGoodsLoaded && !isFetchingMore) {
      loadMoreGoods();
    }
  }, [inView, allGoodsLoaded, isFetchingMore, loadMoreGoods]);

  return (
    <>
      <section>
        <ProductList goods={goods} categories={categories} brands={brands} />
      </section>

      <section className="flex flex-col items-center justify-center py-10 gap-4">
        {allGoodsLoaded ? (
          <p className="subtitle mb-4 text-center">
            Це всі 🤷‍♂️ наявні Товари 🛒
          </p>
        ) : (
          <div ref={ref} className="flex items-center justify-center py-10">
            <TailSpin
              visible={true}
              height="40"
              width="40"
              color="#ea580c"
              ariaLabel="tail-spin-loading"
              radius="1"
            />
          </div>
        )}
      </section>
    </>
  );
}
