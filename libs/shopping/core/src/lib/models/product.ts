// import { Album } from '@ygg/shared/omni-types/core';

// export enum ProductType {
//   Unknown = 'XXX',
//   Play = 'play',
//   Addition = 'addition'
// }

// export interface Product {
//   id: string;
//   productType: ProductType;
//   name: string;
//   price: number;
//   album?: Album;
//   products?: Product[];
// }

import { TheThingImitation } from '@ygg/the-thing/core';
export const CellNamePrice = '費用';
export const CellNameStock = '庫存量';

export const ImitationProduct: TheThingImitation = new TheThingImitation().fromJSON(
  {
    id: 'z21vrLvyVEqS9jssv5dgXg',
    name: '商品範本',
    description: '有費用與庫存量，可以作為商品供使用者訂購',
    image: '/assets/images/shopping/product.svg',
    tags: ['product', '商品'],
    cellsDef: [
      {
        name: CellNamePrice,
        type: 'number',
        userInput: 'required'
      },
      {
        name: CellNameStock,
        type: 'number',
        userInput: 'required'
      }
    ],
    filter: {
      name: '搜尋商品',
      tags: ['product', '商品']
    }
  }
);