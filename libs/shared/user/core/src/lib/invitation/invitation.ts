import { Entity } from '@ygg/shared/infra/core';
import { cloneDeep } from 'lodash';

export interface Invitation extends Entity {
  id: string;
  type: string;
  inviterId: string;
  inviteeId?: string;
  email: string;
  confirmMessage: string;
  expireDate: Date;
  data: any;
}

export function deserializer(data: any): Invitation {
  const invitation: Invitation = cloneDeep(data);
  invitation.expireDate = new Date(invitation.expireDate);
  return invitation;
}
