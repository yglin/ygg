export enum ProductType {
  Unknown = 'XXX',
  Play = 'play'
}

export interface Product {
  id: string;
  name: string;
  price: number;
}