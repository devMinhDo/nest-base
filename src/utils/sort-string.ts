export const sortString = (stringArr) => {
  return stringArr.sort(function (a, b) {
    return ('' + a).localeCompare(b);
  });
};
