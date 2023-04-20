export const paginateAgg = async (model, filter, options) => {
  let sort = '';
  if (options.sortBy) {
    const sortingCriteria = [];
    options.sortBy.split(',').forEach((sortOption) => {
      const [key, order] = sortOption.split(':');
      sortingCriteria.push((order === 'desc' ? '-' : '') + key);
    });
    sort = sortingCriteria.join(' ');
  } else {
    sort = 'createdAt';
  }

  const limit =
    options.limit && parseInt(options.limit, 10) > 0
      ? parseInt(options.limit, 10)
      : 10;
  const page =
    options.page && parseInt(options.page, 10) > 0
      ? parseInt(options.page, 10)
      : 1;
  const skip = (page - 1) * limit;

  let docsPromise = model.aggregate(filter).sort(sort).skip(skip).limit(limit);
  const countPromise = model.aggregate(filter).count('name').exec();

  if (options.populate) {
    options.populate.split(',').forEach((populateOption) => {
      docsPromise = docsPromise.populate(
        populateOption
          .split('.')
          .reverse()
          .reduce((a, b) => ({ path: b, populate: a })),
      );
    });
  }
  docsPromise = docsPromise.exec();
  return Promise.all([countPromise, docsPromise]).then((values) => {
    const [totalResults, results] = values;
    let totalPages;
    if (!totalResults[0]) {
      {
        totalPages = 0;
      }
    } else {
      totalPages = Math.ceil(totalResults[0].name / limit);
    }
    const result = {
      results,
      page,
      limit,
      totalPages,
      totalResults: totalResults[0]?.name || 0,
    };
    return Promise.resolve(result);
  });
};
