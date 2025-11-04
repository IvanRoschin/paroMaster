'use client';

import { useRouter } from 'next/navigation';
import { useContextSelector } from 'use-context-selector';

import { Heading } from '@/components/sections';
import { Button } from '@/components/ui';
import { FiltersContext } from '@/context/FiltersContext';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
  category?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  goHomeAfterReset?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Відсутні товари 🤷‍♂️',
  subtitle = 'Спробуйте змінити фільтри ⚙️',
  showReset,
  category,
  actionLabel,
  actionHref,
  onAction,
  goHomeAfterReset = false,
}) => {
  const router = useRouter();

  // ✅ Достаём только нужные сеттеры — без подписки на значения
  const setMinPrice = useContextSelector(FiltersContext, c => c?.setMinPrice);
  const setMaxPrice = useContextSelector(FiltersContext, c => c?.setMaxPrice);
  const setSelectedBrands = useContextSelector(
    FiltersContext,
    c => c?.setSelectedBrands
  );
  const setCategory = useContextSelector(FiltersContext, c => c?.setCategory);
  const setSort = useContextSelector(FiltersContext, c => c?.setSort);

  const handleResetFilters = () => {
    setMinPrice?.(null);
    setMaxPrice?.(null);
    setSelectedBrands?.([]);
    setCategory?.('');
    setSort?.('');
    if (goHomeAfterReset) router.push('/');
  };

  return (
    <div className="h-[60vh] flex flex-col gap-2 justify-center items-center text-center">
      <Heading center title={title} subtitle={subtitle} category={category} />

      <div className="flex flex-col gap-2 mt-4 w-48">
        {showReset && (
          <Button
            type="button"
            outline
            label="Видалити фільтри"
            onClick={handleResetFilters}
          />
        )}

        {actionLabel && (actionHref || onAction) && (
          <Button
            type="button"
            label={actionLabel}
            onClick={() => {
              if (onAction) return onAction();
              if (actionHref) return router.push(actionHref);
            }}
            outline
            color="border-green-400"
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
