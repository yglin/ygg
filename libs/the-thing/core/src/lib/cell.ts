import { extend } from "lodash";
export const TheThingCellTypes = {
  text: {
    label: '文字'
  },
  longtext: {
    label: '長文字、段落'
  }
};

export class TheThingCell {
  name: string;
  type: string;
  value: any;

  fromJSON(data: any): this {
    extend(this, data);
    return this;
  }

  toJSON(): any {
    return {
      name: this.name,
      type: this.type,
      value:
        this.value && typeof this.value.toJSON === 'function'
          ? this.value.toJSON()
          : this.value
    };
  }
}
