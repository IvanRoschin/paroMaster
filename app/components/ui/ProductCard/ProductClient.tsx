'use client';

import { useShoppingCart } from 'app/context/ShoppingCartContext';

import { getGoodByIdAction } from '@/actions/goods';
import { Icon, ImagesBlock, Loader } from '@/components/index';
import { useFetchDataById } from '@/hooks/index';

const ProductClient = ({ id }: { id: string }) => {
  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useShoppingCart();

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

  const quantity = getItemQuantity(good._id);

  return (
    good && (
      <div className="flex">
        <ImagesBlock item={good} />
        <div className="pt-10">
          <h2 className="font-semibold text-2xl mb-[40px]">{good.title} </h2>
          <p className="mb-[20px]">{good.description}</p>
          {good.isAvailable ? (
            <p className="text-green-600 mb-[30px]">В наявності</p>
          ) : (
            <p className="text-red-600 mb-[30px]">Немає в наявності</p>
          )}
          <p className="mb-[20px]">Артикул: {good.sku}</p>
          <p className="text-2xl font-bold mb-[30px]">{good.price} грн</p>
          <div>
            <div>
              {quantity === 0 ? (
                <button
                  type="button"
                  className="p-4 w-full mb-[20px] bg-orange-600 hover:bg-orange-700 focus:bg-orange-700 text-white transition-all font-semibold text-lg
									rounded-md"
                  onClick={() => increaseCartQuantity(good._id)}
                >
                  Купити
                </button>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center">
                    <button
                      className="w-[20px] mb-[10px] mr-[10px] bg-orange-600 hover:bg-orange-700 focus:bg-orange-700 text-white transition-all text-lg rounded-md"
                      onClick={() => decreaseCartQuantity(good._id)}
                    >
                      -
                    </button>
                    <div>
                      <span className="text-2xl">{quantity}</span> в корзині
                    </div>{' '}
                    <button
                      className="w-[20px] mb-[10px] ml-[10px] bg-orange-600 hover:bg-orange-700 focus:bg-orange-700 text-white transition-all text-lg rounded-md"
                      onClick={() => increaseCartQuantity(good._id)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="
										flex 
										items-center 
										justify-center
										w-[50%] mb-[10px] mr-[10px] bg-red-600 hover:bg-red-700 focus:bg-red-700 text-white transition-all text-sm rounded-md py-2 px-3"
                    onClick={() => removeFromCart(good._id)}
                  >
                    <Icon
                      name="icon_trash"
                      className="
											w-5 
											h-5 
											text-white 
											hover:text-primaryAccentColor"
                    />
                    Видалити{' '}
                  </button>
                </div>
              )}
            </div>

            <p className="font-light text-gray-500">
              Сумісність з брендами: {good.isCompatible ? 'так' : 'ні'}
            </p>
            <p className="font-light text-gray-500">
              Виробник: {good.brand?.name}
            </p>
            <p className="font-light text-gray-500">Model: {good.model}</p>
            <p className="font-light text-gray-500">
              Сумісність з брендами: {good.isCompatible}
            </p>
          </div>
          <p className="font-light text-gray-500">
            Сумісність з моделями:{' '}
            {Array.isArray(good.compatibleGoods)
              ? good.compatibleGoods.join(', ')
              : good.compatibleGoods}
          </p>
        </div>
      </div>
    )
  );
};

export default ProductClient;
