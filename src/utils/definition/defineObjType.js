function isLowerCaseChar(char) {
  if (char === char.toLowerCase()) return '0';
  return '1';
}

function isNumeric(str) {
  return !isNaN(str);
}

export function checkFormatString(str) {
  let result = '';
  str.split('').forEach((element) => {
    result += isLowerCaseChar(element);
  });
  return result;
}

function validateObject(str) {
  for (let i = 0; i < str.length; i++) {
    if (!isNaN(str[i])) return false;
    if (i > 0) if (str.slice(0, i - 1).includes(str[i])) return false;
  }
  return true;
}

export function defineObject(value) {
  if (isNumeric(value)) return 'value';
  if (!validateObject(value)) return undefined;
  const formatObj = checkFormatString(value);
  if (value.length === 3) return 'angle';
  switch (formatObj) {
    case '0':
      return 'line';
    case '1':
      return 'point';
    case '10':
      return 'ray';
    case '11':
      return 'segment';
    default:
      return undefined;
  }
}
