export interface Product {
  name: string;
  price: number;
  link?: string;
  thumbnail?: string;
  [propName: string]: any;
}
