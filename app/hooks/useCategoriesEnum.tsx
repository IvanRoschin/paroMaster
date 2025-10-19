import { getAllCategories } from '@/actions/categories';
import { useFetchData } from '@/hooks/index';
import { ICategory } from '@/types/index';

const useCategoriesEnum = () => {
  const { data, isLoading, isError } = useFetchData(
    getAllCategories,
    ['categories'],
    {
      limit: 100,
      page: 1,
    }
  );

  const allowedCategories =
    data?.categories?.map((cat: ICategory) => cat.name) ?? [];

  return {
    categories: data?.categories ?? [],
    allowedCategories,
    isLoading,
    isError,
  };
};

export default useCategoriesEnum;
