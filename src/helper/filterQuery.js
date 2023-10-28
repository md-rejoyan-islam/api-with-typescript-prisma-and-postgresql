/**
 * @query_URL      :      domain? status=in-stock  & email=a@gmail.com & sort=name,age & price[gt]=50 & page=4 & limit=12
 * @return         :     {filters,queries}
 */

const filterQuery = (req) => {
  let filters = { ...req.query };

  // sort ,page,limit exclude from filters
  const excludeFilters = ["sort", "page", "limit"];
  excludeFilters.forEach((field) => delete filters[field]);

  // change data type of from object to string
  let filterString = JSON.stringify(filters);

  /**
   *
   * @filter_search_query    :    ?price[gt]=50 & age[lt]=12 & name=joy & email=a@gmail.com
   *
   * @receive_data_format    :    { price: { gt: '50' }, age: { lt: '12' } , name: 'joy' , email: 'a@gmail.com' }
   *
   * @change_data_format     :    { "price":{"$gt":"50"}, "age":{"$lt":"12"} }
   *
   * @regex                  :    /\b(gt|gte|lt|lte|eq,neq)\b/g  ==> \b => full block check
   */

  filterString = filterString.replace(
    /\b(gt|gte|lt|lte|eq,neq)\b/g,
    (match) => `$${match}`
  );

  filters = JSON.parse(filterString);



  // full text search with regular expression
  if (req.query.q) {
    const search = req.query.q;

    const regularExpression = { $regex: search, $options: "i" };
    // or
    const regex = new RegExp(".*" + search + ".*", "i");
    filters = {
      $or: [
        { name: regularExpression },
        { email: regularExpression },
        { mobile: regularExpression},
      ],
    };
  }

  /***
   *
   * @query : [sort]         :    ?sort=name,price
   *
   * @receive_data_format    :    { sort : 'name,price' }
   *
   * @change_data_format     :    { sort : 'name price' }
   *
   */

  const queries = {};

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queries.sortBy = sortBy;
  }

  /***
   *
   * @description              :    fields use for select specific fields which we want to show or hide in response.
   *
   * @query : [fields]         :    ?fields=name,email,-age
   *
   * @receive_data_format      :    { fields: 'name,email,-age'}
   *
   * @change_data_format       :    { fields: 'name email -age'}
   *
   */

  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queries.fields = fields;
  }

  /***
   *
   * @query : [page,limit]    :    ?page=4&limit=12
   *
   * @receive_data_format     :    { page: '4', limit :'12'}
   *
   */
   if (!req.query.page && !req.query.limit) {
    queries.limit = 10;
     queries.page = 1;
   }

  if (req.query.page || req.query.limit) {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * Number(limit);
    queries.page=Number(page);
    queries.skip = skip;
    queries.limit = Number(limit);
  }

  return { filters, queries };
};

// export filterQuery
module.exports = filterQuery;
