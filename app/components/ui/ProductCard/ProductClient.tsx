'use client';

import dynamic from 'next/dynamic';

import { getGoodByIdAction } from '@/actions/goods';
import { useAppStore } from '@/app/store/appStore';
import { Icon, ImagesBlock, Loader } from '@/components/index';
import { useFetchDataById } from '@/hooks/index';

const CompareButtonClient = dynamic(
  () => import('@/components/ui/Buttons/CompareButton'),
  { ssr: false }
);
const FavoriteButtonClient = dynamic(
  () => import('@/components/ui/Buttons/FavoriteButton'),
  { ssr: false }
);

const ProductClient = ({ id }: { id: string }) => {
  const { cart, compare, favorites } = useAppStore();

  const {
    data: good,
    isLoading,
    isError,
    error,
  } = useFetchDataById(getGoodByIdAction, ['goodById'], id);

  if (isLoading || !good) return <Loader />;
  if (isError) {
    return (
      <div>
        Error fetching good data:{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  const quantity = cart.getItemQuantity(good._id);
  const isInCompare = compare.items.some(i => i._id === good._id);
  const isFavorite = favorites.isFavorite(good._id);

  return (
    good && (
      <div className="flex flex-col md:flex-row gap-10">
        {/* Изображения */}
        <ImagesBlock item={good} />

        {/* Основная информация */}
        <div className="pt-10 flex-1 flex flex-col gap-6">
          <h2 className="font-semibold text-2xl">{good.title}</h2>
          <p>{good.description}</p>

          {good.isAvailable ? (
            <p className="text-green-600">В наявності</p>
          ) : (
            <p className="text-red-600">Немає в наявності</p>
          )}

          <p>Артикул: {good.sku}</p>
          <p className="text-2xl font-bold">{good.price} грн</p>

          {/* Кнопки корзины */}
          <div className="flex flex-col gap-4">
            {quantity === 0 ? (
              <button
                type="button"
                className="p-4 w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold text-lg rounded-md transition-all"
                onClick={() => cart.increaseCartQuantity(good._id)}
              >
                Купити
              </button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <button
                    className="w-10 h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-md"
                    onClick={() => cart.decreaseCartQuantity(good._id)}
                  >
                    -
                  </button>
                  <span className="text-2xl">{quantity}</span>
                  <button
                    className="w-10 h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-md"
                    onClick={() => cart.increaseCartQuantity(good._id)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="flex items-center justify-center w-32 bg-red-600 hover:bg-red-700 text-white rounded-md py-2 px-3 gap-2"
                  onClick={() => cart.removeFromCart(good._id)}
                >
                  <Icon name="icon_trash" className="w-5 h-5 text-white" />
                  Видалити
                </button>
              </div>
            )}
          </div>

          {/* Блок избранного и сравнения */}
          <div className="flex items-center gap-4 mt-4">
            <FavoriteButtonClient good={good} />
            <CompareButtonClient good={good} />
          </div>

          {/* Метки состояния */}
          <div className="flex gap-4 mt-2">
            {isInCompare && (
              <span className="text-blue-600 font-semibold">У порівнянні</span>
            )}
            {isFavorite && (
              <span className="text-red-500 font-semibold">Улюблений</span>
            )}
          </div>

          {/* Дополнительная информация */}
          <div className="flex flex-col gap-1 mt-4 text-gray-500 text-sm">
            <p>Сумісність з брендами: {good.isCompatible ? 'так' : 'ні'}</p>
            <p>Виробник: {good.brand?.name}</p>
            <p>Model: {good.model}</p>
            <p>
              Сумісність з моделями:{' '}
              {Array.isArray(good.compatibleGoods)
                ? good.compatibleGoods.join(', ')
                : good.compatibleGoods}
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductClient;
