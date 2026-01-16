export type PaginationParams = {
  page?: number | string;
  limit?: number | string;
  [key: string]: any; // позволяет добавлять любые фильтры, не запрещая их
};
const buildPagination = (filters: PaginationParams, currentPage = 1) => {
  const page = Number(filters.page) || currentPage;
  const limit = Number(filters.limit) || 10;

  return {
    page,
    skip: (page - 1) * limit,
    limit,
  };
};

export default buildPagination;
