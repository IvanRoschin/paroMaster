import { cn } from '../../../lib/cn';

export function ScrollArea({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent',
        className
      )}
    >
      {children}
    </div>
  );
}
