import { Album } from '@ygg/shared/types';

export enum ProductType {
  Unknown = 'XXX',
  Play = 'play',
  Addition = 'addition'
}

export interface Product {
  id: string;
  productType: ProductType;
  name: string;
  price: number;
  album?: Album;
  products?: Product[];
}