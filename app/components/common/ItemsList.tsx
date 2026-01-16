'use client';

import { motion } from 'framer-motion';

import { formatCurrency } from '@/app/utils/formatCurrency';
import { Icon, NextImage } from '@/components';
import { IGoodUI } from '@/types/index';

interface ItemListProps {
  items: IGoodUI[];
  onRemove?: (good: IGoodUI) => void;
  className?: string;
}

const ItemList: React.FC<ItemListProps> = ({
  items,
  onRemove,
  className = '',
}) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {items.map(good => {
        const effectivePrice =
          good.discountPrice && good.discountPrice < good.price
            ? good.discountPrice
            : good.price;

        return (
          <motion.div
            key={good._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 p-3 relative"
          >
            {/* Image */}
            <div className="relative w-[120px] h-[120px] rounded-lg overflow-hidden bg-gray-50">
              <NextImage
                useSkeleton
                src={good.src[0] ?? '/placeholder.png'}
                alt={good.title}
                sizes="120px"
                classNames={{
                  wrapper:
                    'w-full h-full bg-gray-50 rounded-lg overflow-hidden',
                  image: 'object-contain p-2',
                }}
                fill
              />
            </div>

            {/* Title */}
            <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 text-center">
              {good.title}
            </h3>

            {/* Price */}
            <div className="flex flex-col items-center text-center">
              <span className="font-semibold text-primaryAccentColor text-sm">
                {formatCurrency(effectivePrice, 'uk-UA', 'UAH')}
              </span>
              {good.discountPrice && good.discountPrice < good.price && (
                <span className="text-[10px] text-gray-500 line-through">
                  {formatCurrency(good.price, 'uk-UA', 'UAH')}
                </span>
              )}
            </div>

            {/* Remove button */}
            {onRemove && (
              <button
                onClick={() => onRemove(good)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Icon name="icon_trash" className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default ItemList;
