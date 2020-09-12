import {
  ImitationBox,
  ImitationItem,
  RelationshipBoxItem,
  RelationshipBoxMember,
  RelationshipItemHolder,
  RelationshipItemRequester
} from '@ygg/ourbox/core';
import { theMockDatabase } from '@ygg/shared/test/cypress';
import { User } from '@ygg/shared/user/core';
import { RelationRecord, TheThing } from '@ygg/the-thing/core';
import { isEmpty, random, range, sample, sampleSize, defaults } from 'lodash';
// import * as env from "@ygg/env/environments.local.json";

export default function forgeDB() {
  const relationRecords: RelationRecord[] = [];

  // forge users
  const users: User[] = forgeUsers({ count: 50 });

  // forge boxes
  const boxes = forgeBoxes({
    count: 30,
    members: users
  });

  // forge items
  const items = forgeItems({
    count: 100,
    users: users,
    boxes: boxes
  });

  users.forEach(user =>
    theMockDatabase.insert(`${User.collection}/${user.id}`, user)
  );
  boxes.forEach(box =>
    theMockDatabase.insert(`${box.collection}/${box.id}`, box)
  );
  items.forEach(item =>
    theMockDatabase.insert(`${item.collection}/${item.id}`, item)
  );

  // Set PlaywhatTF and yglin as admin users
  theMockDatabase.setAdmins([
    'cenKm7JFZTgqP307xmuE5SLIVtV2',
    'lkMGtk5WErSIz8tmt05lcfwsJGj2'
  ]);

  // // Insert all relation records
  // relationRecords.forEach(rr =>
  //   theMockDatabase.insert(`${RelationRecord.collection}/${rr.id}`, rr)
  // );
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
      box.addUsersOfRole(
        RelationshipBoxMember.role,
        sampleMembers.map(member => member.id)
      );
    }
  }
  return boxes;
}

function forgeItems(
  options: {
    count?: number;
    boxes?: TheThing[];
    users?: User[];
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
      const boxItemRelation = RelationshipBoxItem.createRelation(
        box.id,
        item.id
      );
      box.addRelation(boxItemRelation);
    }
  }
  if (!isEmpty(options.users)) {
    for (const item of items) {
      const sampleUsers = sampleSize(
        options.users,
        Math.min(random(1, 10), options.users.length)
      );
      item.ownerId = sample(sampleUsers).id;

      const holder = sampleUsers[0];
      item.setUserOfRole(RelationshipItemHolder.role, holder.id);

      const requesters = sampleUsers.slice(1);
      if (!isEmpty(requesters)) {
        item.addUsersOfRole(
          RelationshipItemRequester.role,
          requesters.map(rq => rq.id)
        );
      }
    }
  }
  return items;
}
