import { EntityAccessor } from '@ygg/shared/infra/core';
import {
  Invitation,
  deserializer as invitationDeserializer,
  InvitationCollection
} from './invitation';

export class InvitationAccessor extends EntityAccessor<Invitation> {
  collection = InvitationCollection;
  deserializer = invitationDeserializer;
}
