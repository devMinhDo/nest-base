export const getFirstDayOfWeek = (d) => {
  const date = new Date(d);
  const day = date.getDay();

  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const findDate = new Date().setDate(diff);
  return new Date(new Date(findDate).setHours(0, 0, 0, 0));
};
