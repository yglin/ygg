import {
  ImitationBox,
  ImitationItem,
  RelationshipBoxItem,
  RelationshipBoxMember,
  RelationshipItemHolder,
  RelationshipItemRequestBorrow
} from '@ygg/ourbox/core';
import { theMockDatabase } from '@ygg/shared/test/cypress';
import { User } from '@ygg/shared/user/core';
import { RelationRecord, TheThing } from '@ygg/the-thing/core';
import { isEmpty, random, range, sample, sampleSize, defaults } from 'lodash';
// import * as env from "@ygg/env/environments.local.json";

export default function forgeDB() {
  const relationRecords: RelationRecord[] = [];

  // forge users
  const users: User[] = forgeUsers({count: 50});
  users.forEach(user =>
    theMockDatabase.insert(`${User.collection}/${user.id}`, user)
  );

  // forge boxes
  const boxes = forgeBoxes({
    count: 30,
    members: users,
    relationRecords
  });
  boxes.forEach(box =>
    theMockDatabase.insert(`${box.collection}/${box.id}`, box)
  );

  // forge items
  const items = forgeItems({
    count: 100,
    users: users,
    boxes: boxes,
    relationRecords
  });
  items.forEach(item =>
    theMockDatabase.insert(`${item.collection}/${item.id}`, item)
  );

  // Insert all relation records
  relationRecords.forEach(rr =>
    theMockDatabase.insert(`${RelationRecord.collection}/${rr.id}`, rr)
  );
}

function forgeUsers(options: { count?: number } = {}): User[] {
  defaults(options, {
    count: 50
  });
  return range(options.count).map(() => User.forge());
}

function forgeBoxes(
  options: {
    count?: number;
    members?: User[];
    relationRecords?: RelationRecord[];
  } = {}
): TheThing[] {
  defaults(options, {
    count: 50,
    members: [],
    relationRecords: []
  });
  const boxes = range(options.count).map(() => ImitationBox.forgeTheThing());
  if (!isEmpty(options.members)) {
    for (const box of boxes) {
      const countMembers = Math.min(random(1, 10), options.members.length);
      const sampleMembers: User[] = sampleSize(options.members, countMembers);
      const owner = sample(sampleMembers);
      box.ownerId = owner.id;

      for (const member of sampleMembers) {
        const memberRelation = RelationshipBoxMember.createRelationRecord(
          box.id,
          member.id
        );
        options.relationRecords.push(memberRelation);
      }
    }
  }
  return boxes;
}

function forgeItems(
  options: {
    count?: number;
    boxes?: TheThing[];
    users?: User[];
    relationRecords?: RelationRecord[];
  } = {}
): TheThing[] {
  defaults(options, {
    count: 100,
    boxes: [],
    users: [],
    relationRecords: []
  });
  const items = range(options.count).map(() => ImitationItem.forgeTheThing());
  if (!isEmpty(options.boxes)) {
    for (const item of items) {
      const box = sample(options.boxes);
      const boxItemRelation = RelationshipBoxItem.createRelationRecord(
        box.id,
        item.id
      );
      options.relationRecords.push(boxItemRelation);
    }
  }
  if (!isEmpty(options.users)) {
    const sampleUsers = sampleSize(
      options.users,
      Math.min(random(1, 10), options.users.length)
    );
    for (const item of items) {
      item.ownerId = sample(sampleUsers).id;

      const holder = sampleUsers[0];
      const itemHolderRelation = RelationshipItemHolder.createRelationRecord(
        item.id,
        holder.id
      );
      options.relationRecords.push(itemHolderRelation);

      const requesters = sampleUsers.slice(1);
      if (!isEmpty(requesters)) {
        for (const requester of requesters) {
          const requestRelation = RelationshipItemRequestBorrow.createRelationRecord(
            item.id,
            requester.id
          );
          options.relationRecords.push(requestRelation);
        }
      }
    }
  }
  return items;
}
