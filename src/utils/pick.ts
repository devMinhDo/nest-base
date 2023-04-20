export const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

export const pickSubtract = (object, keys) => {
  const obj: any = {};
  const keysObj = Object.keys(object);
  for (let i = 0; i < keysObj.length; i++) {
    if (!keys.includes(keysObj[i])) {
      obj[keysObj[i]] = object[keysObj[i]];
    }
  }
  return obj;
};
