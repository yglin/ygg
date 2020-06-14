import { Entity } from '@ygg/shared/infra/core';
import { cloneDeep } from 'lodash';

export const InvitationCollection = 'invitations';

export interface Invitation extends Entity {
  id: string;
  type: string;
  inviterId: string;
  inviteeId?: string;
  email: string;
  mailSubject: string;
  mailContent: string;
  confirmMessage: string;
  landingUrl?: string;
  expireDate: Date;
  data: any;
}

export function deserializer(data: any): Invitation {
  const invitation: Invitation = cloneDeep(data);
  invitation.expireDate = new Date(invitation.expireDate);
  return invitation;
}
