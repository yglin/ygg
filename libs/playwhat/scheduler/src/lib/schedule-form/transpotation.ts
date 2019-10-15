export interface TranspotationType {
  id: string;
  label: string;
}

export const TranspotationTypes: { [id: string]: TranspotationType } = {
  'walk': {
    id: 'walk',
    label: '步行'
  },
  'car': {
    id: 'car',
    label: '自行開車'
  },
  'tour-bus': {
    id: 'tour-bus',
    label: ' 遊覽車' 
  }
};

