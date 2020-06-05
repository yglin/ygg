import { PermissionName } from '@ygg/shared/user/core';

export interface TheThingAction {
  id: string;
  icon: string;
  tooltip: string;
  permissions?: PermissionName[];
}
