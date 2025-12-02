'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { TailSpin } from 'react-loader-spinner';

import { getAllGoodsAction } from '@/actions/goods';
import { GoodsSection } from '@/app/(admin)/components';
import { useAppStore } from '@/app/store/appStore';
import { IGoodUI } from '@/types/IGood';
import { UserRole } from '@/types/IUser';
import { ISearchParams } from '@/types/searchParams';

import EmptyState from './EmptyState';

interface InfiniteScrollProps {
  initialGoods: IGoodUI[];
  searchParams: ISearchParams;
  role: UserRole;
}

export default function InfiniteScroll({
  initialGoods,
  searchParams,
  role,
}: InfiniteScrollProps) {
  const [goods, setGoods] = useState<IGoodUI[]>(initialGoods || []);
  const [pagesLoaded, setPagesLoaded] = useState(1);
  const [allGoodsLoaded, setAllGoodsLoaded] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [firstLoadDone, setFirstLoadDone] = useState(false);
  const { filters } = useAppStore();

  const { ref, inView } = useInView({ threshold: 0.5 });

  // Подписка на фильтры
  const minPrice = filters.minPrice;
  const maxPrice = filters.maxPrice;
  const selectedBrands = filters.selectedBrands;
  const selectedCategory = filters.selectedCategory;
  const sort = filters.sort;

  // Массив _id брендов для фильтрации
  const brandIds = useMemo(
    () => selectedBrands?.map(b => b.value).filter(Boolean) ?? [],
    [selectedBrands]
  );

  const sortParam = sort === 'asc' || sort === 'desc' ? sort : '';

  // ===== Фильтрация при изменении фильтров =====
  useEffect(() => {
    const fetchInitialGoods = async () => {
      setIsFetchingMore(true);

      const filteredGoods = await getAllGoodsAction({
        ...searchParams,
        page: '1',
        low: minPrice ?? null,
        high: maxPrice ?? null,
        brands: brandIds,
        category: selectedCategory ?? '',
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
      setFirstLoadDone(true);
    };

    const handler = setTimeout(fetchInitialGoods, 300);

    return () => clearTimeout(handler);
  }, [minPrice, maxPrice, brandIds, sortParam, selectedCategory, searchParams]);

  // ===== Подгрузка следующих страниц =====
  const loadMoreGoods = useCallback(async () => {
    if (isFetchingMore || allGoodsLoaded) return;
    setIsFetchingMore(true);

    const nextPage = pagesLoaded + 1;
    const newGoods = await getAllGoodsAction({
      ...searchParams,
      page: nextPage.toString(),
      low: minPrice ?? null,
      high: maxPrice ?? null,
      brands: brandIds,
      category: selectedCategory ?? '',
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
    brandIds,
    selectedCategory,
    minPrice,
    maxPrice,
    sortParam,
    isFetchingMore,
    allGoodsLoaded,
    pagesLoaded,
    searchParams,
  ]);

  // Автоподгрузка при скролле
  useEffect(() => {
    if (inView && !allGoodsLoaded && !isFetchingMore) {
      loadMoreGoods();
    }
  }, [inView, allGoodsLoaded, isFetchingMore, loadMoreGoods]);

  return (
    <>
      <section>
        <GoodsSection
          goods={goods}
          role={role}
          searchParams={searchParams}
          isLoading={isFetchingMore}
          firstLoadDone={firstLoadDone}
        />
      </section>

      <section className="flex flex-col items-center justify-center py-10 gap-4">
        {isFetchingMore ? (
          <div className="flex items-center justify-center py-10">
            <TailSpin
              visible={true}
              height="40"
              width="40"
              color="#ea580c"
              ariaLabel="tail-spin-loading"
              radius="1"
            />
          </div>
        ) : !firstLoadDone ? null : goods.length === 0 ? (
          <EmptyState showReset goHomeAfterReset />
        ) : allGoodsLoaded ? (
          <p className="subtitle text-center">Це всі 🤷‍♂️ наявні Товари 🛒</p>
        ) : null}
      </section>
    </>
  );
}
