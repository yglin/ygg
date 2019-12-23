import { FormControlType } from '@ygg/shared/ui/dynamic-form';

export const AdditionFormGroupModel = {
  name: 'addition-form',
  controls: {
    name: {
      name: 'name',
      type: FormControlType.text,
      label: '附屬品名稱',
      validators: [{ type: 'required', errorMessage: '請填入附屬品名稱' }]
    },
    stock: {
      name: 'stock',
      type: FormControlType.number,
      label: '庫存數量',
      default: 0
    },
    price: {
      name: 'price',
      type: FormControlType.number,
      label: '單價',
      default: 0
    },
    album: {
      name: 'album',
      type: FormControlType.album,
      label: '照片'
    }
  },
  controlsOrder: ['name', 'stock', 'price', 'album']
};
