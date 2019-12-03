import * as short from "short-uuid";

export interface Entity {
  id: string;
}

export function generateID(): string {
  return short().generate();
}