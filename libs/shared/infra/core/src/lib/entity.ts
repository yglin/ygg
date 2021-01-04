import * as short from 'short-uuid';

export type SerializerJSON = (data: any) => any;
export type DeserializerJSON = (data: any) => any;

export interface Entity {
  id: string;
  [key: string]: any;
}

export function isEntity(value: any): value is Entity {
  return value && value.id ;
}

export function generateID(): string {
  return short().generate();
}
