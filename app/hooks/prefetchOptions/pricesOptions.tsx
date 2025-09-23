import { getMinMaxPrice } from '@/actions/goods';
import { queryOptions } from '@tanstack/react-query';

const pricesOptions = queryOptions({
  queryKey: ['prices'],
  queryFn: async () => {
    const response = await getMinMaxPrice();

    return response;
  },
});

export default pricesOptions;
