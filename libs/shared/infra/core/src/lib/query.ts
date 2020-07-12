export class Query {
  fieldPath: string;
  comparator: string;
  value: any;

  constructor(fieldPath?: string, comparator?: string, value?: any) {
    this.fieldPath = fieldPath;
    this.comparator = comparator;
    this.value = value;
  }

  toString(): string {
    return `${this.fieldPath}${this.comparator}${this.value}`;
  }
}
