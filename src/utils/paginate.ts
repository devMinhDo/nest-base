export const paginate = async (model, filter, options) => {
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
    options?.limit && parseInt(options.limit, 10) > 0
      ? parseInt(options.limit, 10)
      : 10;
  const page =
    options?.page && parseInt(options.page, 10) > 0
      ? parseInt(options.page, 10)
      : 1;
  const skip = (page - 1) * limit;

  const countPromise = model.countDocuments(filter).exec();
  let docsPromise = model.find(filter).sort(sort).skip(skip).limit(limit);

  if (options?.populate) {
    const populateConvert = options.populate.replaceAll(/\s/g, '');
    populateConvert.split(',').forEach((populateOption) => {
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
    const totalPages = Math.ceil(totalResults / limit);
    const result = { results, page, limit, totalPages, totalResults };
    return Promise.resolve(result);
  });
};
