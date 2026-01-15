'use client';

import { useRouter } from 'next/navigation';

import { useAppStore } from '@/app/store/appStore';
import { Heading } from '@/components/sections';
import { Button } from '@/components/ui';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
  actionLabel?: string;
  actionHref?: string;
  goHomeAfterReset?: boolean;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Відсутні товари 🤷‍♂️',
  subtitle = 'Спробуйте змінити фільтри ⚙️',
  showReset,
  actionLabel,
  actionHref,
  goHomeAfterReset = false,
  onReset,
}) => {
  const router = useRouter();
  const { filters } = useAppStore();

  const setMinPrice = filters.setMinPrice;
  const setMaxPrice = filters.setMaxPrice;
  const setSelectedBrands = filters.setSelectedBrands;
  const setCategory = filters.setCategory;
  const setSort = filters.setSort;

  const handleResetFilters = () => {
    setMinPrice?.(null);
    setMaxPrice?.(null);
    setSelectedBrands?.([]);
    setCategory?.('');
    setSort?.('');
    if (goHomeAfterReset) router.push('/catalog');
    onReset?.();
  };

  return (
    <div className="h-[60vh] flex flex-col gap-2 justify-center items-center text-center">
      <Heading center title={title} subtitle={subtitle} />
      <div className="flex flex-col gap-2 mt-4 w-48">
        {showReset && (
          <Button
            type="button"
            outline
            label="Видалити фільтри"
            onClick={handleResetFilters}
          />
        )}
        {actionLabel && actionHref && (
          <Button
            type="button"
            label={actionLabel}
            onClick={() => router.push(actionHref)}
            outline
            color="border-green-400"
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
