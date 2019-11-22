export enum ProductType {
  Unknown = 'XXX',
  Play = 'play',
  Equipment = 'equipment'
}

export interface Product {
  id: string;
  productType: ProductType;
  name: string;
  price: number;
  products?: Product[];
}