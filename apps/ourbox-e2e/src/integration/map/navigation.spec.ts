import { Box, Treasure } from '@ygg/ourbox/core';
import { TreasureMapPageObjectCypress } from '@ygg/ourbox/test';
import { Location, LocationRecord } from '@ygg/shared/geography/core';
import { generateID } from '@ygg/shared/infra/core';
import { TagRecord, Tags } from '@ygg/shared/tags/core';
import { theMockDatabase } from '@ygg/shared/test/cypress';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';
import { User } from '@ygg/shared/user/core';
import { testUsers } from '@ygg/shared/user/test';
import { RelationBoxTreasure } from 'libs/ourbox/core/src/lib/box/box-treasure';
import { keyBy, mapValues, range, sample, sampleSize } from 'lodash';
import { myBeforeAll } from '../before-all';
import { defaultMapView, gotoMapNavigatorPage, message } from './map';

describe('Search and navigate in treasure map', () => {
  const treasureMapPO = new TreasureMapPageObjectCypress();
  const emceePO = new EmceePageObjectCypress();

  const fakeUserLocation = Location.forge();

  // const me = testUsers[1];
  // const topCount = 20;
  // const total = topCount * 3;
  // const tagsPool = range(total).map(() => generateID());
  // const boxLocationRecords: LocationRecord[] = [];

  // const mapCenter = Location.forge();
  // const boxesTotal = 10;
  // const boxes = range(boxesTotal).map(() => {
  //   const box = Box.forge({
  //     ownerId: me.id,
  //     public: true,
  //     location: new Location(mapCenter)
  //   });
  //   box.location.geoPoint.randomMove(1500);
  //   boxLocationRecords.push(
  //     new LocationRecord({
  //       latitude: box.location.geoPoint.latitude,
  //       longitude: box.location.geoPoint.longitude,
  //       address: box.location.address,
  //       objectCollection: Box.collection,
  //       objectId: box.id
  //     })
  //   );
  //   return box;
  // });
  // // boxes.forEach(b => console.log(b.location.geoPoint));

  // const treasures = range(total).map(() => Treasure.forge());
  // const boxTreasureRelations = [];
  // const treasuresWithTagOne = [];
  // const treasuresWithTagOneAndTwo = [];
  // const tagOne = generateID();
  // const tagTwo = generateID();
  // const boxesHaveTagOneTreasures = {};
  // const boxesHaveTagOneAndTwoTreasures = {};

  // const treasuresPerProvision = mapValues(
  //   keyBy(Treasure.provisionTypes, 'value'),
  //   () => []
  // );

  // // console.log(treasuresPerProvision);

  // for (const treasure of treasures) {
  //   treasure.name += `_${Date.now()}`;
  //   treasure.tags = new Tags();
  //   treasure.provision = sample(Treasure.provisionTypes);
  //   treasuresPerProvision[treasure.provision.value].push(treasure);
  //   const box = sample(boxes);
  //   const r = new RelationBoxTreasure(null, {
  //     boxId: box.id,
  //     treasureId: treasure.id
  //   });
  //   boxTreasureRelations.push(r);

  //   if (Math.random() > 0.7) {
  //     treasure.tags.add(tagOne);
  //     treasuresWithTagOne.push(treasure);
  //     boxesHaveTagOneTreasures[box.id] = box;

  //     if (Math.random() > 0.5) {
  //       treasure.tags.add(tagTwo);
  //       treasuresWithTagOneAndTwo.push(treasure);
  //       boxesHaveTagOneAndTwoTreasures[box.id] = box;
  //     }
  //   }
  // }

  // const topTags = sampleSize(tagsPool, topCount);
  // for (let i = 0; i < topTags.length; i++) {
  //   const tag = topTags[i];
  //   for (let j = 0; j < treasures.length; j++) {
  //     const treasure = treasures[j];
  //     treasure.tags.add(tag);
  //     if (j >= treasures.length - i) {
  //       break;
  //     }
  //   }
  // }

  before(() => {
    cy.wrap(testUsers).each((user: User) => {
      theMockDatabase.insert(`${User.collection}/${user.id}`, user);
    });
  });

  before(() => {
    myBeforeAll();
  });

  // after(() => {
  //   theMockDatabase.clearCollection(
  //     TagRecord.tagsCollectionName(Treasure.collection)
  //   );
  //   theMockDatabase.clearCollection(Treasure.collection);
  //   theMockDatabase.clearCollection(Box.collection);
  //   theMockDatabase.clearCollection(LocationRecord.collection);
  //   theMockDatabase.clearCollection(RelationBoxTreasure.collection);
  // });

  it('Ask user geolocation at first time visit', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.removeItem('treasureMap');
        // e.g., force Barcelona geolocation
        cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake(cb =>
          cb({
            coords: {
              latitude: fakeUserLocation.geoPoint.latitude,
              longitude: fakeUserLocation.geoPoint.longitude
            }
          })
        );
      }
    });
    emceePO.confirm(message('askGeolocationFirstTime'));
    // gotoMapNavigatorPage();
    treasureMapPO.mapNavigatorPO.expectCenter(fakeUserLocation);
  });

  it('Ask user geolocation but user refused, navigate to default map view', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.removeItem('treasureMap');
      }
    });
    emceePO.confirm(message('askGeolocationFirstTime'), { doConfirm: false });
    treasureMapPO.mapNavigatorPO.expectCenter(defaultMapView.center);
  });
});
