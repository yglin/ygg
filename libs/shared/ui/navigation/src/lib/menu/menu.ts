import { Image } from '@ygg/shared/types';

export interface MenuItem {
  id: string;
  link: string;
  label: string;
  icon: Image;
  tooltip: string;
}