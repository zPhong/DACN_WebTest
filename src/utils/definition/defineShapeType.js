export function defineShapeType(data) {
  let returner = {};
  Object.keys(data).forEach((key) => {
    if (key.includes('type')) {
      const result = data[key].toString().split(' ');
      const shape = result[result.length - 1];
      const shapeName = key.split(' ').pop();
      returner[shapeName] = shape;
      returner['type'] = data[key]
        .toString()
        .replace(shape, '')
        .trim();
    } else {
      returner[key] = data[key].toString();
    }
  });
  return returner;
}
