import { EntityAccessor } from '@ygg/shared/infra/core';
import {
  Invitation,
  deserializer as invitationDeserializer
} from './invitation';

export class InvitationAccessor extends EntityAccessor<Invitation> {
  collection = 'invitations';
  deserializer = invitationDeserializer;
}
