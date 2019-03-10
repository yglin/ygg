export interface DataItem {
  id: string;
  createAt: Date;

  fromData(data: any): this;
  toData(): any;
}
