import { SiteNavigator, PlayAdminPageObjectCypress } from '@ygg/playwhat/test';
import {
  TheThingPageObjectCypress,
  MyThingsPageObjectCypress,
  MyThingsDataTablePageObjectCypress
} from '@ygg/the-thing/test';
import { ImitationPlay } from '@ygg/playwhat/core';
import {
  theMockDatabase,
  login,
  getCurrentUser
} from '@ygg/shared/test/cypress';
import { MinimumPlay, SamplePlays, SampleEquipments } from './sample-plays';
import { TheThing, TheThingState } from '@ygg/the-thing/core';
import {
  EmceePageObjectCypress,
  ImageThumbnailListPageObjectCypress
} from '@ygg/shared/ui/test';
import { PurchaseAction } from '@ygg/shopping/core';
import { values } from 'lodash';

describe('Manipulate play states', () => {
  const siteNavigator = new SiteNavigator();
  const myPlayListPO = new MyThingsDataTablePageObjectCypress(
    '',
    ImitationPlay
  );
  const playPO = new TheThingPageObjectCypress('', ImitationPlay);
  const playAdminPO = new PlayAdminPageObjectCypress();
  const SampleThings = SamplePlays.concat(SampleEquipments);

  // const playForRequestAssess = MinimumPlay.clone();
  // playForRequestAssess.name = '測試新體驗送審核操作流程';
  // ImitationPlay.setState(playForRequestAssess, ImitationPlay.states.editing);
  // SampleThings.push(playForRequestAssess);

  // const playInAssess = MinimumPlay.clone();
  // playInAssess.name = '測試體驗狀態審核中=>上架';
  // ImitationPlay.setState(playInAssess, ImitationPlay.states.assess);
  // SampleThings.push(playInAssess);

  const playsByState: { [state: string]: TheThing } = {};
  for (const stateName in ImitationPlay.states) {
    if (ImitationPlay.states.hasOwnProperty(stateName)) {
      const state = ImitationPlay.states[stateName];
      const play = MinimumPlay.clone();
      play.name = `測試體驗狀態：${state.label}`;
      ImitationPlay.setState(play, state);
      playsByState[state.name] = play;
    }
  }
  SampleThings.push(...values(playsByState));

  before(() => {
    login().then(user => {
      theMockDatabase.setAdmins([user.id]);
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
      });
      cy.visit('/');
    });
  });

  beforeEach(() => {
    //Reset plays by states
    getCurrentUser().then(user => {
      cy.wrap(values(playsByState)).each((thing: any) => {
        theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
      });
    });
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
    const play = MinimumPlay.clone();
    play.name = '測試新體驗的狀態=新建立';
    siteNavigator.goto(['plays', 'my'], myPlayListPO);
    myPlayListPO.clickCreate();
    playPO.expectVisible();
    playPO.expectState(ImitationPlay.states.new);
  });

  it('State of saved play should be "editing"', () => {
    const play = MinimumPlay.clone();
    play.name = '測試已儲存體驗的狀態=修改中';
    siteNavigator.goto(['plays', 'my'], myPlayListPO);
    myPlayListPO.clickCreate();
    playPO.expectVisible();
    playPO.setValue(play);
    playPO.save(play);
    playPO.expectState(ImitationPlay.states.editing);
  });

  it('Only plays of state "new", "edting" are modifiable', () => {
    cy.wrap(values(ImitationPlay.states)).each((state: TheThingState) => {
      const play = playsByState[state.name];
      cy.visit(`/the-things/${ImitationPlay.id}/${play.id}`);
      playPO.expectVisible();
      if (
        state.name === ImitationPlay.states.new.name ||
        state.name === ImitationPlay.states.editing.name
      ) {
        playPO.expectModifiable();
      } else {
        playPO.expectReadonly();
      }
    });
  });

  it('Only owner and play of state "editing" can request for state "assess"', () => {
    const play = MinimumPlay.clone();
    play.name = '測試新體驗送審核按鈕會不會顯示';
    theMockDatabase.insert(`${TheThing.collection}/${play.id}`, play);
    cy.visit(`/the-things/${ImitationPlay.id}/${play.id}`);
    playPO.expectVisible();
    playPO.expectNoActionButton(ImitationPlay.actions['request-assess']);
    getCurrentUser().then(user => {
      play.ownerId = user.id;
      theMockDatabase.insert(`${TheThing.collection}/${play.id}`, play);
      playPO.expectNoActionButton(ImitationPlay.actions['request-assess']);
      ImitationPlay.setState(play, ImitationPlay.states.editing);
      theMockDatabase.insert(`${TheThing.collection}/${play.id}`, play);
      playPO.expectActionButton(ImitationPlay.actions['request-assess']);
    });
  });

  it('Send request for state "assess" of play', () => {
    const playForRequestAssess = playsByState[ImitationPlay.states.editing.name];
    siteNavigator.goto(['plays', 'my'], myPlayListPO);
    myPlayListPO.theThingDataTablePO.gotoTheThingView(playForRequestAssess);
    playPO.expectVisible();
    playPO.runAction(ImitationPlay.actions['request-assess']);
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(
      `送出 ${playForRequestAssess.name} 給管理者審核？送出後資料便無法修改，審核成功即可上架販售`
    );
    emceePO.alert(`${playForRequestAssess.name} 已送出，請等待管理者審核`);
    playPO.expectState(ImitationPlay.states.assess);
  });

  it('Show plays of state "assess" in admin page', () => {
    const playInAssess = playsByState[ImitationPlay.states.assess.name];
    siteNavigator.goto(['admin', 'play'], playAdminPO);
    playAdminPO.switchToTab(ImitationPlay.states.assess.name);
    playAdminPO.theThingDataTables[
      ImitationPlay.states.assess.name
    ].expectTheThing(playInAssess);
  });

  it('Only admins can approve play from "assess" to state "for-sale"', () => {
    const playInAssess = playsByState[ImitationPlay.states.assess.name];
    theMockDatabase.setAdmins([]);
    siteNavigator.goto(['plays', 'my'], myPlayListPO);
    myPlayListPO.theThingDataTablePO.gotoTheThingView(playInAssess);
    playPO.expectVisible();
    playPO.expectNoActionButton(ImitationPlay.actions['approve-for-sale']);
    getCurrentUser().then(user => {
      theMockDatabase.setAdmins([user.id]);
      playPO.expectActionButton(ImitationPlay.actions['approve-for-sale']);
    });
  });

  it('Approve play from "assess" to state "for-sale"', () => {
    const playInAssess = playsByState[ImitationPlay.states.assess.name];
    siteNavigator.goto(['admin', 'play'], playAdminPO);
    playAdminPO.switchToTab(ImitationPlay.states.assess.name);
    playAdminPO.theThingDataTables[
      ImitationPlay.states.assess.name
    ].gotoTheThingView(playInAssess);
    playPO.expectVisible();
    playPO.runAction(ImitationPlay.actions['approve-for-sale']);
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(`體驗 ${playInAssess.name} 已通過審核，確定上架？`);
    emceePO.alert(`體驗 ${playInAssess.name} 已上架`);
    playPO.expectState(ImitationPlay.states.forSale);
    siteNavigator.goto(['admin', 'play'], playAdminPO);
    playAdminPO.switchToTab(ImitationPlay.states.forSale.name);
    playAdminPO.theThingDataTables[
      ImitationPlay.states.forSale.name
    ].expectTheThing(playInAssess);
  });

  it('Only plays of state "for-sale" show add-to-cart button', () => {
    cy.wrap(values(ImitationPlay.states)).each((state: TheThingState) => {
      const play = playsByState[state.name];
      cy.visit(`/the-things/${ImitationPlay.id}/${play.id}`);
      playPO.expectVisible();
      if (state.name === ImitationPlay.states.forSale.name) {
        playPO.expectActionButton(ImitationPlay.actions[PurchaseAction.id]);
      } else {
        playPO.expectNoActionButton(ImitationPlay.actions[PurchaseAction.id]);
      }
    });
  });

  it('Only plays of state "for-sale" listed in home page', () => {
    siteNavigator.goto(['home']);
    const homePlayList = new ImageThumbnailListPageObjectCypress();
    homePlayList.expectSomeItem();
    cy.wrap(values(ImitationPlay.states)).each((state: TheThingState) => {
      if (state.name === ImitationPlay.states.forSale.name) {
        homePlayList.expectItem(playsByState[state.name]);
      } else {
        homePlayList.expectNoItem(playsByState[state.name]);
      }
    });
  });

  it('Only admins can withdraw play "assess" or "for-sale" to state "editing"', () => {
    theMockDatabase.setAdmins([]);
    const playInAssess = playsByState[ImitationPlay.states.assess.name];
    cy.visit(`/the-things/${ImitationPlay.id}/${playInAssess.id}`);
    playPO.expectVisible();
    playPO.expectNoActionButton(ImitationPlay.actions['back-to-editing']);
    getCurrentUser().then(user => {
      theMockDatabase.setAdmins([user.id]);
      playPO.expectActionButton(ImitationPlay.actions['back-to-editing']);
    });
  });

  it('Withdraw play from "assess" to state "editing"', () => {
    const playInAssess = playsByState[ImitationPlay.states.assess.name];
    siteNavigator.goto(['admin', 'play'], playAdminPO);
    playAdminPO.switchToTab(ImitationPlay.states.assess.name);
    playAdminPO.theThingDataTables[
      ImitationPlay.states.assess.name
    ].gotoTheThingView(playInAssess);
    playPO.expectVisible();
    playPO.runAction(ImitationPlay.actions['back-to-editing']);
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(`將體驗 ${playInAssess.name} 退回資料修改？`);
    emceePO.alert(`體驗 ${playInAssess.name} 已退回資料修改狀態`);
    playPO.expectState(ImitationPlay.states.editing);
  });

  it('Withdraw play from "for-sale" to state "editing"', () => {
    const playInForSale = playsByState[ImitationPlay.states.forSale.name];
    siteNavigator.goto(['admin', 'play'], playAdminPO);
    playAdminPO.switchToTab(ImitationPlay.states.forSale.name);
    playAdminPO.theThingDataTables[
      ImitationPlay.states.forSale.name
    ].gotoTheThingView(playInForSale);
    playPO.expectVisible();
    playPO.runAction(ImitationPlay.actions['back-to-editing']);
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(`將體驗 ${playInForSale.name} 退回資料修改？會一併下架體驗`);
    emceePO.alert(`體驗 ${playInForSale.name} 已退回資料修改狀態`);
    playPO.expectState(ImitationPlay.states.editing);
  });
});
