export const get0hourDate = (quantityDate) => {
  const findDate = new Date().setDate(new Date().getDate() - quantityDate);
  return new Date(new Date(findDate).setHours(0, 0, 0, 0));
};
