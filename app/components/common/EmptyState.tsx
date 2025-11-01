'use client';

import { useRouter } from 'next/navigation';

import { Heading } from '@/components/sections';
import { Button } from '@/components/ui';
import { useFilter } from '@/context/FiltersContext';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
  category?: string;
  actionLabel?: string; // текст кнопки действия
  actionHref?: string; // путь для перехода
  onAction?: () => void; // колбек вместо перехода
  goHomeAfterReset?: boolean; // если true, после сброса идём на главную
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
  const { setMinPrice, setMaxPrice, setSelectedBrands, setCategory, setSort } =
    useFilter();

  const handleResetFilters = () => {
    setMinPrice(null);
    setMaxPrice(null);
    setSelectedBrands([]);
    setCategory('');
    setSort('');
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
