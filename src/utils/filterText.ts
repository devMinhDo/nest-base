export const filterOptions = async (
  sort,
  sortDirection,
  filterItems,
  searchText,
  skipCount,
  maxResultCount,
  database,
  searchTextFiled,
) => {
  const limit = maxResultCount;
  const skip = skipCount;
  const sortField = sort;
  const sortDirectionValue = sortDirection === 1 ? 1 : -1;
  let filter;
  let search;
  if (searchText) {
    search = { $regex: `.*${searchText}.*`, $options: 'i' };
    filter = {
      $and: [
        ...filterItems.map(({ propertyName, value }) => ({
          [propertyName]: value,
        })),
      ],
      $or: [
        ...searchTextFiled.map((item) => ({
          [item]: search,
        })),
      ],
    };
  } else {
    filter = {
      $and: filterItems.map(({ propertyName, value }) => ({
        [propertyName]: value,
      })),
    };
  }

  console.log(JSON.stringify(filter));
  const items = await database
    .find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ [sortField]: sortDirectionValue });
  const totalCount = await database.countDocuments(filter);
  return {
    items,
    totalCount,
  };
};
