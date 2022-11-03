export const isNumber = (str: string): boolean => {
  if (typeof str !== 'string') {
    return false;
  }

  if (str.trim() === '') {
    return false;
  }

  return !Number.isNaN(Number(str));
};

export const isInteger = (str: string): boolean =>
  isNumber(str) && Number.isInteger(Number(str));

export default { isNumber };
