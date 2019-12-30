export const TheThingCellTypes = {
  text: {
    label: '文字'
  },
  longtext: {
    label: '長文字、段落'
  }
};

export interface TheThingCell {
  name: string;
  type: string;
  value: any;
}
