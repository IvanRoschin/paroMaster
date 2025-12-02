import { getAllBrandsAction } from '@/actions/brands';
import { useFetchData } from '@/hooks/index';
import { IBrand } from '@/types/index';

const useBrandsEnum = () => {
  const { data, isLoading, isError } = useFetchData(
    getAllBrandsAction,
    ['brands'],
    {
      limit: 100,
      page: 1,
    }
  );

  const allowedBrands = data?.brands?.map((brand: IBrand) => brand.name) ?? [];

  return {
    brands: data?.brands ?? [],
    allowedBrands,
    isLoading,
    isError,
  };
};

export default useBrandsEnum;
