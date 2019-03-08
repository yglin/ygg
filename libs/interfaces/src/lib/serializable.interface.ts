export interface Serializable {
  fromData(data: any): this;
  toData(): any;
}
