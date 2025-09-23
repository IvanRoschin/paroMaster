import { URLSearchParams } from 'url';

import { getAllCategories } from '@/actions/categories';
import { queryOptions } from '@tanstack/react-query';

const params = new URLSearchParams();

const categoriesOptions = queryOptions({
  queryKey: ['categories'],
  queryFn: async () => {
    const response = await getAllCategories({ searchParams: params });

    return response;
  },
});

export default categoriesOptions;
