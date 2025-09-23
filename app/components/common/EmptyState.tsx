'use client';

import { Heading } from '@/components/sections';
import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
  category?: string;
  onReset?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Відсутні товари 🤷‍♂️',
  subtitle = 'Спробуйте змінити фільтри ⚙️',
  showReset,
  category,
  onReset,
}) => {
  const router = useRouter();
  return (
    <div
      className="
  h-[60vh]
  flex
  flex-col
  gap-2
  justify-center
  items-center
    "
    >
      <Heading center title={title} subtitle={subtitle} category={category} />
      <div className="w-48 mt-4">
        {showReset && (
          <Button
            type="button"
            outline
            label="Видалити фільтри"
            onClick={() => (onReset ? onReset() : router.push('/'))}
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
