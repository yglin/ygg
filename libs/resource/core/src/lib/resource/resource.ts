import { Album, BusinessHours, Location } from '@ygg/shared/types';
import { ResourceType } from './resource-type';
import { DataItem } from '@ygg/shared/infra/data-access';

export interface Resource {
  id: string;
  name: string;
  resourceType: ResourceType;
  introduction?: string;
  stock?: number;
  businessHours?: BusinessHours;
  album?: Album;
  location?: Location;
  links?: URL[];
  [key: string]: any;
}