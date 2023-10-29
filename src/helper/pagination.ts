import { PaginationType } from "../types/types";

const paginationData = (queries: any, count: any): PaginationType => {
  // page & limit
  const page = Number(queries.page);
  const limit = Number(queries.take);

  // pagination object
  const pagination = {
    totalDocuments: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    previousPage: page > 1 ? page - 1 : null,
    nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
  };

  // return pagination
  return pagination;
};

// export
export default paginationData;
