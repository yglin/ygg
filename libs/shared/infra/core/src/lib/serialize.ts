export function toJSONDeep(obj: any = {}): any {
  const data = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const property = obj[key];
      if (!property || typeof property === 'function') {
        continue;
      } else if (typeof property.toJSON === 'function') {
        data[key] = property.toJSON();
      } else {
        try {
          data[key] = JSON.parse(JSON.stringify(property));
        } catch (error) {
          console.error(error);
          console.error(
            `JSON.parse error on parsing data["${key}"], the data set as:`
          );
          console.error(data);
        }
      }
    }
  }
  return data;
}
