"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function filterQuery(req) {
    // copy all filter query
    let filters = Object.assign({}, req.query);
    // sort ,page,limit, fields exclude from filters
    const excludeFilters = ["sort", "page", "limit", "fields"];
    excludeFilters.forEach((field) => delete filters[field]);
    // { userId: '1' } => { userId: 1 }
    if (filters && typeof filters.userId === "string") {
        filters.userId = Number(filters.userId);
    }
    // { id: '1' } => { id: 1 }
    if (filters && typeof filters.id === "string") {
        filters.id = Number(filters.id);
    }
    // queries
    const queries = {};
    // Specify the fields to display   (?fields=name,age)
    if (typeof req.query.fields === "string") {
        const fields = req.query.fields.split(",");
        const fieldsObj = fields.reduce((acc, field) => {
            acc[field] = true;
            return acc;
        }, {});
        queries.select = fieldsObj;
    }
    // sort query        ( ?sort=-name[desc] ,  sort=name[asc])
    if (typeof req.query.sort === "string") {
        const sortItems = req.query.sort.split(",");
        const sortItemObj = sortItems.reduce((acc, item) => {
            if (item.startsWith("-")) {
                acc[item.slice(1)] = "desc";
            }
            else {
                acc[item] = "asc";
            }
            return acc;
        }, {});
        queries.orderBy = sortItemObj;
    }
    // default pagination query
    if (!req.query.page && !req.query.limit) {
        queries.take = 10;
        queries.page = 1;
    }
    // pagination query   (?page=1&limit=10)
    if (req.query.page || req.query.limit) {
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        queries.page = Number(page);
        queries.skip = skip;
        queries.take = Number(limit);
    }
    // return
    return { queries, filters };
}
// export
exports.default = filterQuery;
