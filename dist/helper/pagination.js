"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paginationData = (queries, count) => {
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
exports.default = paginationData;
