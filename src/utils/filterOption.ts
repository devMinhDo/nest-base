import { pick } from './pick';

export const filterOptions = (query, keyFilter) => {
  const options = pick(query, ['limit', 'page']);
  const filter = pick(query, keyFilter);
  for (const property in filter) {
    if (!+filter[property] || +filter[property] > 9999999999) continue;
    filter[property] = Number(filter[property]);
  }
  if (!query.from) {
    if (query.to) {
      filter.createdAt = { $lte: new Date(Number(query.to)) };
    }
  } else if (query.to) {
    filter.createdAt = { $gte: new Date(Number(query.from)), $lte: new Date(Number(query.to)) };
  } else {
    filter.createdAt = { $gte: new Date(Number(query.from)) };
  }
  delete filter.from;
  delete filter.to;
  options.sortBy = '-createdAt';
  return { options, filter };
};
