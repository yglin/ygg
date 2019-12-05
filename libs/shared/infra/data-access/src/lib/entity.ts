import * as short from "short-uuid";

export interface Entity {
  id: string;
  [key: string]: any;
}

export function generateID(): string {
  return short().generate();
}