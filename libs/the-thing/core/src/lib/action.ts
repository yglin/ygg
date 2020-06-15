import { PermissionName } from '@ygg/shared/user/core';
import { TheThing } from './the-thing';

export type PermissionFunction = (theThing: TheThing) => boolean;

export interface TheThingAction {
  id: string;
  icon: string;
  tooltip: string;
  permissions?: (PermissionName | PermissionFunction)[];
}
