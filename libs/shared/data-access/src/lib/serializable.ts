import { has } from 'lodash';

export interface Serializable {
  fromData: (data: any) => this;
  toData: () => any;
}

export interface SerializableJSON {
  fromJSON: (data: any) => this;
  toJSON: () => any;
}

function isSerializableJSON(obj: any = {}): obj is SerializableJSON {
  return (typeof obj.fromJSON === 'function') && (typeof obj.toJSON === 'function');
}

export function toJSONDeep(obj: any = {}): any {
  const data = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const property = obj[key];
      if (typeof property === 'function') {
        continue;
      } else if (isSerializableJSON(property)) {
        data[key] = property.toJSON();
      } else {
        data[key] = JSON.parse(JSON.stringify(property));
      }
    }
  }
  return data;
}