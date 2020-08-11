import { User } from '@ygg/shared/user/core';
import { theMockDatabase } from '@ygg/shared/test/cypress';
import {
  range,
  defaults,
  isEmpty,
  sample,
  sampleSize,
  random,
  find
} from 'lodash';
import { TheThing, TheThingRelation } from '@ygg/the-thing/core';
import {
  ImitationEquipment,
  ImitationPlay,
  ImitationTourPlan,
  ImitationPlayCellDefines,
  RelationshipEquipment,
  ImitationEvent,
  ScheduleAdapter,
  ImitationEventCellDefines,
  ImitationTourPlanCellDefines,
  RelationshipPlay
} from '@ygg/playwhat/core';
import {
  Purchase,
  RelationPurchase,
  ShoppingCellDefines
} from '@ygg/shopping/core';
import { TimeRange, DateRange } from '@ygg/shared/omni-types/core';
import * as moment from 'moment';

export default function forgeDB() {
  // forge users
  const users: User[] = forgeUsers();
  users.forEach(user =>
    theMockDatabase.insert(`${User.collection}/${user.id}`, user)
  );

  // Forge equipments
  const equipments: TheThing[] = forgeEquipments();
  equipments.forEach(equip =>
    theMockDatabase.insert(
      `${ImitationEquipment.collection}/${equip.id}`,
      equip
    )
  );

  // Forge plays
  const plays: TheThing[] = forgePlays({
    users,
    equipments
  });
  plays.forEach(play =>
    theMockDatabase.insert(`${ImitationPlay.collection}/${play.id}`, play)
  );

  // Forge tour-plans
  const tourPlans: TheThing[] = forgeTourPlans({
    users,
    plays,
    equipments
  });
  tourPlans.forEach(tourPlan =>
    theMockDatabase.insert(
      `${ImitationTourPlan.collection}/${tourPlan.id}`,
      tourPlan
    )
  );

  // Forge scheduled events from half of tourPlans
  const sampleTourPlans = sampleSize(
    tourPlans,
    Math.ceil(tourPlans.length / 2)
  );
  for (const tourPlan of sampleTourPlans) {
    const events: TheThing[] = forgeEvents({
      tourPlan,
      plays
    });
    events.forEach(event =>
      theMockDatabase.insert(`${ImitationEvent.collection}/${event.id}`, event)
    );
  }
}

function forgeUsers(options?: { count: number }): User[] {
  options = defaults(options, { count: 100 });
  return range(options.count).map(() => User.forge());
}

function forgeEquipments(options?: { count: number }): TheThing[] {
  options = defaults(options, { count: 50 });
  return range(options.count).map(() => ImitationEquipment.forgeTheThing());
}

function forgePlays(options?: {
  users?: User[];
  equipments?: TheThing[];
  count?: number;
}): TheThing[] {
  options = defaults(options, {
    users: [],
    equipments: [],
    count: 70
  });
  const plays: TheThing[] = [];
  for (let index = 0; index < options.count; index++) {
    const play = ImitationPlay.forgeTheThing();
    if (!isEmpty(options.users)) {
      play.ownerId = sample(options.users).id;
    }
    const state = sample(ImitationPlay.states);
    ImitationPlay.setState(play, state);
    plays.push(play);
  }
  return plays;
}

function forgeTourPlans(options?: {
  users?: User[];
  plays?: TheThing[];
  equipments?: TheThing[];
  count?: number;
}): TheThing[] {
  options = defaults(options, {
    users: [],
    plays: [],
    equipments: [],
    count: 50
  });
  const tourPlans: TheThing[] = [];
  while (tourPlans.length < options.count) {
    const tourPlan = ImitationTourPlan.forgeTheThing();
    if (!isEmpty(options.users)) {
      tourPlan.ownerId = sample(options.users).id;
    }
    if (!isEmpty(options.plays)) {
      const samplePlays = sampleSize(
        options.plays,
        random(Math.min(10, options.plays.length))
      );
      for (const play of samplePlays) {
        const purchase: Purchase = new Purchase({
          consumerId: tourPlan.id,
          productId: play.id,
          price: play.getCellValue(ShoppingCellDefines.price.id),
          quantity: random(
            play.getCellValue(ImitationPlayCellDefines.minimum.id),
            play.getCellValue(ImitationPlayCellDefines.maximum.id)
          )
        });
        tourPlan.addRelation(purchase.toRelation());

        if (
          !isEmpty(options.equipments) &&
          play.hasRelation(RelationshipEquipment.name)
        ) {
          for (const relations of play.getRelations(
            RelationshipEquipment.name
          )) {
            const equipment = find(
              options.equipments,
              equip => equip.id === relations.id
            );
            if (equipment) {
              const purchaseEquip: Purchase = new Purchase({
                consumerId: tourPlan.id,
                productId: equipment.id,
                price: equipment.getCellValue(ShoppingCellDefines.price.id),
                quantity: random(1, 10)
              });
              tourPlan.addRelation(purchaseEquip.toRelation());
            }
          }
        }
      }
    }
    const state = sample(ImitationTourPlan.states);
    ImitationTourPlan.setState(tourPlan, state);
    tourPlans.push(tourPlan);
  }
  return tourPlans;
}

function forgeEvents(options: {
  tourPlan: TheThing;
  plays: TheThing[];
}): TheThing[] {
  const events: TheThing[] = [];
  for (const relation of options.tourPlan.getRelations(RelationPurchase.name)) {
    const play = find(options.plays, p => p.id === relation.objectId);
    if (play) {
      const event = ImitationEvent.createTheThing(play);
      event.name = play.name;
      const dateRange: DateRange = options.tourPlan.getCellValue(
        ImitationTourPlanCellDefines.dateRange.id
      );
      const tmpMoment = moment(dateRange.start);
      const playLength = play.getCellValue(
        ImitationPlayCellDefines.timeLength.id
      );
      const timeRange: TimeRange = new TimeRange(
        tmpMoment.add(random(360), 'minute').toDate(),
        tmpMoment.add(playLength, 'minute').toDate()
      );

      event.setCellValue(ImitationEventCellDefines.timeRange.id, timeRange);
      event.setCellValue(
        ImitationEventCellDefines.numParticipants.id,
        relation.getCellValue(ShoppingCellDefines.quantity.id)
      );
      event.addRelation(RelationshipPlay.createRelation(event.id, play.id));
      events.push(event);
    }
  }
  return events;
}
