export const weekOfMonth = () => {
  const d = new Date();
  const date = d.getDate();
  const day = d.getDay();
  return Math.ceil((date - 1 - day) / 7);
};
