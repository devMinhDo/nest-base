export const generateNumber = (length) => {
  const digits = '0123456789';
  let number = '';
  for (let i = 0; i < length; i++) {
    number += digits[Math.floor(Math.random() * 10)];
  }
  return parseInt(number, 10);
};

export const generateString = (length) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
