import { ImitationPlay } from '@ygg/playwhat/core';
import { PlayAdminPageObjectCypress, SiteNavigator } from '@ygg/playwhat/test';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
import {
  EmceePageObjectCypress,
  ImageThumbnailListPageObjectCypress
} from '@ygg/shared/ui/test';
import { User } from '@ygg/shared/user/core';
import { logout } from '@ygg/shared/user/test';
import { PurchaseAction } from '@ygg/shopping/core';
import { TheThing, TheThingState } from '@ygg/the-thing/core';
import {
  MyThingsDataTablePageObjectCypress,
  TheThingPageObjectCypress
} from '@ygg/the-thing/test';
import promisify from 'cypress-promise';
import { omit, values } from 'lodash';
import { MinimumPlay, SampleEquipments, SamplePlays } from './sample-plays';

describe('Manipulate play states', () => {
  const siteNavigator = new SiteNavigator();
  const myPlayListPO = new MyThingsDataTablePageObjectCypress(
    '',
    ImitationPlay
  );
  const playPO = new TheThingPageObjectCypress('', ImitationPlay);
  const playAdminPO = new PlayAdminPageObjectCypress();
  const SampleThings = SamplePlays.concat(SampleEquipments);
  const homePlayList = new ImageThumbnailListPageObjectCypress();
  let user: User;

  // const playForRequestAssess = MinimumPlay.clone();
  // playForRequestAssess.name = '測試新體驗送審核操作流程';
  // ImitationPlay.setState(playForRequestAssess, ImitationPlay.states.editing);
  // SampleThings.push(playForRequestAssess);

  // const MinimumPlay = MinimumPlay.clone();
  // MinimumPlay.name = '測試體驗狀態審核中=>上架';
  // ImitationPlay.setState(MinimumPlay, ImitationPlay.states.assess);
  // SampleThings.push(MinimumPlay);

  const playsByState: { [state: string]: TheThing } = {};
  for (const stateName in ImitationPlay.states) {
    if (ImitationPlay.states.hasOwnProperty(stateName)) {
      const state = ImitationPlay.states[stateName];
      const play = MinimumPlay.clone();
      play.name = `測試體驗狀態：${state.label}_${Date.now()}`;
      ImitationPlay.setState(play, state);
      playsByState[state.name] = play;
    }
  }
  SampleThings.push(...values(playsByState));

  function gotoMyPlay(play: TheThing) {
    siteNavigator.goto(['plays', 'my'], myPlayListPO);
    myPlayListPO.theThingDataTablePO.gotoTheThingView(play);
    playPO.expectVisible();
  }

  before(() => {
    login().then(_user => {
      user = _user;
      theMockDatabase.setAdmins([]);
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
      });
      cy.visit('/');
    });
  });

  beforeEach(() => {
    //Reset plays by states
    // getCurrentUser().then(user => {
    //   cy.wrap(values(playsByState)).each((thing: any) => {
    //     theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
    //   });
    // });
  });

  after(() => {
    // // Goto my-things page and delete all test things
    // const myThingsPO = new MyThingsPageObjectCypress();
    // siteNavigator.goto(['the-things', 'my'], myThingsPO);
    // cy.wait(3000);
    // myThingsPO.deleteAll();
    theMockDatabase.clear();
    // theMockDatabase.restoreRTDB();
  });

  it('State of just created play should be "new"', () => {
    siteNavigator.goto(['plays', 'my'], myPlayListPO);
    myPlayListPO.clickCreate();
    playPO.expectVisible();
    playPO.expectState(ImitationPlay.states.new);
  });

  it('State of "new" plays accessibility', () => {
    playPO.expectModifiable();
    // All actions are not avalibale
    for (const action of values(ImitationPlay.actions)) {
      playPO.expectNoActionButton(action);
    }
  });

  it('State of saved play should be "editing"', () => {
    playPO.setValue(MinimumPlay);
    playPO.save(MinimumPlay);
    playPO.expectState(ImitationPlay.states.editing);
  });

  it('State of "editing" play accessibility of owner', () => {
    playPO.expectModifiable();
    for (const action of values(ImitationPlay.actions)) {
      if (action.id === 'request-assess') {
        playPO.expectActionButton(action);
      } else {
        playPO.expectNoActionButton(action);
      }
    }
  });

  it('Send request for state "assess" of play', () => {
    playPO.runAction(ImitationPlay.actions['request-assess']);
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(
      `送出 ${MinimumPlay.name} 給管理者審核？送出後資料便無法修改，審核成功即可上架販售`
    );
    emceePO.alert(`${MinimumPlay.name} 已送出，請等待管理者審核`);
    playPO.expectState(ImitationPlay.states.assess);
  });

  it('State of "assess" play accessibility of owner', () => {
    playPO.expectReadonly();
    for (const action of values(ImitationPlay.actions)) {
      playPO.expectNoActionButton(action);
    }
  });

  it('Show plays of state "assess" in admin page', () => {
    theMockDatabase.setAdmins([user.id]).then(() => {
      siteNavigator.goto(['admin', 'play'], playAdminPO);
      playAdminPO.switchToTab(ImitationPlay.states.assess.name);
      playAdminPO.theThingDataTables[
        ImitationPlay.states.assess.name
      ].expectTheThing(MinimumPlay);
      playAdminPO.theThingDataTables[
        ImitationPlay.states.assess.name
      ].gotoTheThingView(MinimumPlay);
    });
  });

  it('State of "assess" play accessibility of admin', () => {
    playPO.expectReadonly();
    for (const action of values(ImitationPlay.actions)) {
      if (action.id === 'approve-for-sale' || action.id === 'back-to-editing') {
        playPO.expectActionButton(action);
      } else {
        playPO.expectNoActionButton(action);
      }
    }
  });

  it('Withdraw play from "assess" to state "editing"', async () => {
    playPO.runAction(ImitationPlay.actions['back-to-editing']);
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(`將體驗 ${MinimumPlay.name} 退回資料修改？`);
    emceePO.alert(`體驗 ${MinimumPlay.name} 已退回資料修改狀態`);
    playPO.expectState(ImitationPlay.states.editing);
    // Restore state to assess
    theMockDatabase.setState(
      MinimumPlay,
      ImitationPlay,
      ImitationPlay.states.assess
    );
    playPO.expectState(ImitationPlay.states.assess);
  });

  it('Approve play from "assess" to state "for-sale"', () => {
    playPO.runAction(ImitationPlay.actions['approve-for-sale']);
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(`體驗 ${MinimumPlay.name} 已通過審核，確定上架？`);
    emceePO.alert(`體驗 ${MinimumPlay.name} 已上架`);
    playPO.expectState(ImitationPlay.states.forSale);
  });

  it('Show plays of state "for-sale" in admin page', () => {
    siteNavigator.goto(['admin', 'play'], playAdminPO);
    playAdminPO.switchToTab(ImitationPlay.states.forSale.name);
    playAdminPO.theThingDataTables[
      ImitationPlay.states.forSale.name
    ].expectTheThing(MinimumPlay);
  });

  it('Show plays of state "for-sale" in home page', () => {
    siteNavigator.goto(['home']);
    homePlayList.expectSomeItem();
    homePlayList.expectItem(MinimumPlay);
  });

  it('Withdraw play from "for-sale" to state "editing"', () => {
    gotoMyPlay(MinimumPlay);
    playPO.runAction(ImitationPlay.actions['back-to-editing']);
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(`將體驗 ${MinimumPlay.name} 退回資料修改？會一併下架體驗`);
    emceePO.alert(`體驗 ${MinimumPlay.name} 已退回資料修改狀態`);
    playPO.expectState(ImitationPlay.states.editing);
  });

  it('Only plays of state "for-sale" listed in home page', () => {
    siteNavigator.goto(['home']);
    homePlayList.expectSomeItem();
    cy.wrap(values(ImitationPlay.states)).each((state: TheThingState) => {
      if (state.name === ImitationPlay.states.forSale.name) {
        homePlayList.expectItem(playsByState[state.name]);
      } else {
        homePlayList.expectNoItem(playsByState[state.name]);
      }
    });
  });

  it('Guest user accessibility', () => {
    const playForSale = playsByState[ImitationPlay.states.forSale.name];
    logout().then(async () => {
      siteNavigator.goto([]);
      homePlayList.clickItemLink(playForSale);
      for (const state of values(ImitationPlay.states)) {
        await promisify(
          cy.wrap(
            new Cypress.Promise((resolve, reject) => {
              theMockDatabase
                .setState(playForSale, ImitationPlay, state)
                .then(() => {
                  playPO.expectState(state);
                  playPO.expectReadonly();
                  for (const action of values(
                    omit(ImitationPlay.actions, PurchaseAction.id)
                  )) {
                    playPO.expectNoActionButton(action);
                  }
                  if (state.name === ImitationPlay.states.forSale.name) {
                    playPO.expectActionButton(
                      ImitationPlay.actions[PurchaseAction.id]
                    );
                  } else {
                    playPO.expectNoActionButton(
                      ImitationPlay.actions[PurchaseAction.id]
                    );
                  }
                  resolve();
                });
            }),
            {
              timeout: 20000
            }
          )
        );
      }
    });
  });
});
