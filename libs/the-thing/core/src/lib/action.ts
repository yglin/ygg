import { PermissionName } from '@ygg/shared/user/core';
import { TheThing } from './the-thing';

export type PermissionFunction = (theThing: TheThing) => boolean;
export type Permission = PermissionName | PermissionFunction;

export interface TheThingAction {
  id: string;
  icon: string;
  tooltip: string;
  permissions?: Permission[];
  display?: {
    position: 'custom';
  };
}
