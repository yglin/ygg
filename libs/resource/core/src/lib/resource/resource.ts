import { Album, BusinessHours } from '@ygg/shared/types';

export interface Resource {
  id: string;
  name: string;
  stock?: number;
  businessHours?: BusinessHours;
  album?: Album;
  [key: string]: any;
}