import { BusinessHours, Location } from '@ygg/shared/types';
import { Album } from '@ygg/shared/omni-types/core';
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
  links?: string[];
  [key: string]: any;
}
