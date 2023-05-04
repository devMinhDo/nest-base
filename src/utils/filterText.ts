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
  let filter: any = {};
  let search;
  if (searchText) {
    search = { $regex: `.*${searchText}.*`, $options: 'i' };
    filter = {
      $or: [
        ...searchTextFiled.map((item) => ({
          [item]: search,
        })),
      ],
    };
    if (filterItems && filterItems.length > 0) {
      filter.$and = [
        ...filterItems.map(({ propertyName, value }) => ({
          [propertyName]: value,
        })),
      ];
    }
  } else {
    if (filterItems && filterItems.length > 0) {
      filter.$and = [
        ...filterItems.map(({ propertyName, value }) => ({
          [propertyName]: value,
        })),
      ];
    }
  }

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
