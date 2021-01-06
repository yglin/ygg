import { Action } from './action';
import { Page } from './page';

export interface SideMenu {
  links: { [id: string]: Page };
  actions: { [id: string]: Action };
}
