import * as short from 'short-uuid';
import { SerializableJSON, isSerializableJSON } from './serializable';

export interface Entity extends SerializableJSON {
  id: string;
  [key: string]: any;
}

export function isEntity(value: any): value is Entity {
  return value && value.id && isSerializableJSON(value);
}

export function generateID(): string {
  return short().generate();
}
