import { Emcee, Router } from '@ygg/shared/infra/core';
import { Location } from '@ygg/shared/omni-types/core';
import {
  Authenticator,
  InvitationFactory,
  User,
  UserAccessor
} from '@ygg/shared/user/core';
import {
  RelationFactory,
  RelationRecord,
  TheThing,
  TheThingFactory
} from '@ygg/the-thing/core';
import { first, isEmpty } from 'lodash';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import {
  ImitationItem,
  ImitationItemTransfer,
  RelationshipItemTransferGiver,
  RelationshipItemTransferItem,
  RelationshipItemTransferReceiver,
  ImitationItemTransferActions,
  ImitationItemTransferStates
} from '../models';
import { ItemFactory } from './item-factory';

export const ItemTransferInvitationType = 'ourbox-item-transfer';

export interface ItemTransferCompleteInfo {
  newLocation: Location;
}

export abstract class ItemTransferFactory {
  subscription: Subscription = new Subscription();

  constructor(
    protected emcee: Emcee,
    protected router: Router,
    protected authenticator: Authenticator,
    // protected itemAccessor: ItemAccessor,
    protected itemFactory: ItemFactory,
    // protected theThingAccessor: TheThingAccessor,
    protected theThingFactory: TheThingFactory,
    protected relationFactory: RelationFactory,
    protected userAccessor: UserAccessor,
    protected invitationFactory: InvitationFactory
  ) {
    this.subscription.add(
      this.theThingFactory.runAction$.subscribe(actionInfo => {
        switch (actionInfo.action.id) {
          case ImitationItemTransfer.actions['send-request'].id:
            this.sendRequest(actionInfo.theThing);
            break;

          case ImitationItemTransfer.actions['consent-reception'].id:
            this.consentReception(actionInfo.theThing);
            break;

          case ImitationItemTransfer.actions['confirm-completed'].id:
            this.completeReception(actionInfo.theThing);
            break;

          default:
            break;
        }
      })
    );
  }

  abstract async inquireCompleteInfo(
    item: TheThing
  ): Promise<ItemTransferCompleteInfo>;

  async create(item: TheThing, giver: User, receiver: User): Promise<TheThing> {
    try {
      const newItemTrnasfer = await this.theThingFactory.create({
        imitation: ImitationItemTransfer
      });
      newItemTrnasfer.name = `${giver.name} 交付 ${item.name} 給 ${receiver.name} 的交付記錄`;
      await this.relationFactory.create({
        subjectCollection: ImitationItemTransfer.collection,
        subjectId: newItemTrnasfer.id,
        objectCollection: ImitationItem.collection,
        objectId: item.id,
        objectRole: RelationshipItemTransferItem.role
      });
      await this.relationFactory.create({
        subjectCollection: ImitationItemTransfer.collection,
        subjectId: newItemTrnasfer.id,
        objectCollection: User.collection,
        objectId: giver.id,
        objectRole: RelationshipItemTransferGiver.role
      });
      await this.relationFactory.create({
        subjectCollection: ImitationItemTransfer.collection,
        subjectId: newItemTrnasfer.id,
        objectCollection: User.collection,
        objectId: receiver.id,
        objectRole: RelationshipItemTransferReceiver.role
      });
      this.router.navigate([
        '/',
        ImitationItemTransfer.routePath,
        newItemTrnasfer.id
      ]);
      const itemTransfer = await this.theThingFactory.onSave$
        .pipe(
          filter(thing => thing.id === newItemTrnasfer.id),
          take(1)
        )
        .toPromise();
      await this.sendRequest(itemTransfer);
    } catch (error) {
      this.emcee.error(`新增交付約定記錄失敗，錯誤原因：${error.message}`);
      return;
    }
  }

  async getLatestItemTransfer(item: TheThing): Promise<TheThing> {
    try {
      const relations: RelationRecord[] = await this.relationFactory
        .findByObjectAndRole$(item.id, RelationshipItemTransferItem.role)
        .pipe(take(1))
        .toPromise();
      const relationLatest: RelationRecord = RelationRecord.findLatest(
        relations
      );
      return this.theThingFactory.load(
        relationLatest.subjectId,
        relationLatest.subjectCollection
      );
    } catch (error) {
      this.emcee.error(`找不到${item.name}的交付記錄`);
      return Promise.reject();
    }
  }

  async giveAway(itemId: string) {
    let item: TheThing;
    try {
      item = await this.theThingFactory.load(itemId, ImitationItem.collection);
      const user: User = await this.authenticator.requestLogin();
      const requestBorrowers: User[] = await this.itemFactory
        .getItemRequestBorrowers$(item.id)
        .pipe(take(1))
        .toPromise();
      if (isEmpty(requestBorrowers)) {
        throw new Error(`目前沒有人正在等候索取 ${item.name}`);
      }
      const receiver: User = first(requestBorrowers);
      const itemTransfer = await this.create(item, user, receiver);
      await this.theThingFactory.setState(
        item,
        ImitationItem,
        ImitationItem.states.transfer,
        {
          force: true
        }
      );
      this.router.navigate(['/', ImitationItem.routePath, item.id]);
    } catch (error) {
      this.emcee.error(
        `建立 ${!!item ? item.name : itemId} 的交付任務失敗，錯誤原因：${
          error.message
        }`
      );
    }
  }

  async getTransferItem(itemTransferId: string): Promise<TheThing> {
    const relations: RelationRecord[] = await this.relationFactory
      .findBySubjectAndRole$(itemTransferId, RelationshipItemTransferItem.role)
      .pipe(take(1))
      .toPromise();
    if (isEmpty(relations)) {
      throw new Error(`Not found item of item-transfer: ${itemTransferId}`);
    }
    return this.theThingFactory.load(
      relations[0].objectId,
      relations[0].objectCollection
    );
  }

  async getReceiver(itemTransferId: string): Promise<User> {
    const relations: RelationRecord[] = await this.relationFactory
      .findBySubjectAndRole$(
        itemTransferId,
        RelationshipItemTransferReceiver.role
      )
      .pipe(take(1))
      .toPromise();
    if (isEmpty(relations)) {
      throw new Error(`Not found receiver of item-transfer: ${itemTransferId}`);
    }
    return this.userAccessor.get(relations[0].objectId);
  }

  async getGiver(itemTransferId: string): Promise<User> {
    const relations: RelationRecord[] = await this.relationFactory
      .findBySubjectAndRole$(itemTransferId, RelationshipItemTransferGiver.role)
      .pipe(take(1))
      .toPromise();
    if (isEmpty(relations)) {
      throw new Error(`Not found giver of item-transfer: ${itemTransferId}`);
    }
    return this.userAccessor.get(relations[0].objectId);
  }

  async sendRequest(itemTransfer: TheThing) {
    let item: TheThing;
    let giver: User;
    let receiver: User;
    try {
      item = await this.getTransferItem(itemTransfer.id);
      giver = await this.getGiver(itemTransfer.id);
      receiver = await this.getReceiver(itemTransfer.id);
      const confirm = await this.emcee.confirm(
        `<h3>確認約定時間和地點無誤，送出交付請求給${receiver.name}？</h3>`
      );
      if (!confirm) {
        return;
      }
      await this.invitationFactory.create({
        type: ItemTransferInvitationType,
        inviterId: giver.id,
        email: receiver.email,
        mailSubject: `${giver.name} 想要將 ${item.name} 交給你`,
        mailContent: `${giver.name} 想要將 ${item.name} 交給你，請點選以下網址檢視交付約定的相關訊息`,
        confirmMessage: `<h3>您將前往交付通知的頁面</h3><br><h3>請確認相關約定事項</h3>`,
        landingUrl: `/${ImitationItemTransfer.routePath}/${itemTransfer.id}`,
        data: {}
      });
      await this.theThingFactory.setState(
        itemTransfer,
        ImitationItemTransfer,
        ImitationItemTransferStates.waitReceiver,
        { force: true }
      );
      await this.emcee.info(
        `<h3>已送出 ${item.name} 的交付要求，請等待 ${receiver.name} 的回應</h3>`
      );
    } catch (error) {
      this.emcee.error(
        `送出${
          giver && item && receiver
            ? ' ' +
              giver.name +
              ' => ' +
              item.name +
              ' => ' +
              receiver.name +
              ' '
            : ''
        }交付約定失敗，錯誤原因：${error.message}`
      );
    }
  }

  async consentReception(itemTransfer: TheThing) {
    let item: TheThing;
    let giver: User;
    let receiver: User;
    try {
      item = await this.getTransferItem(itemTransfer.id);
      giver = await this.getGiver(itemTransfer.id);
      receiver = await this.getReceiver(itemTransfer.id);
      const confirm = await this.emcee.confirm(
        `<h3>確定要依照約定前往收取寶物 ${item.name} 嗎？</h3>`
      );
      if (confirm) {
        await this.theThingFactory.setState(
          itemTransfer,
          ImitationItemTransfer,
          ImitationItemTransfer.states.consented,
          { force: true }
        );
        await this.invitationFactory.create({
          type: ItemTransferInvitationType,
          inviterId: receiver.id,
          email: giver.email,
          mailSubject: `${receiver.name} 已確認要收取 ${item.name}`,
          mailContent: `${receiver.name} 已確認要收取 ${item.name}，請點選以下網址檢視交付約定的相關訊息`,
          confirmMessage: `<h3>您將前往交付通知的頁面</h3><br><h3>請確認相關約定事項</h3>`,
          landingUrl: `/${ImitationItemTransfer.routePath}/${itemTransfer.id}`,
          data: {}
        });
        this.emcee.info(
          `<h3>已通知 ${giver.name} ，請依照約定時間地點前往進行交付</h3>`
        );
      }
    } catch (error) {
      this.emcee.error(`確認交付失敗，錯誤原因：${error.message}`);
      return Promise.reject();
    }
  }

  async completeReception(itemTransfer: TheThing) {
    let item: TheThing;
    let giver: User;
    let receiver: User;
    try {
      item = await this.getTransferItem(itemTransfer.id);
      giver = await this.getGiver(itemTransfer.id);
      receiver = await this.getReceiver(itemTransfer.id);
      const completeInfo = await this.inquireCompleteInfo(item);
      if (completeInfo && completeInfo.newLocation) {
        await this.itemFactory.transfer(
          item,
          receiver,
          completeInfo.newLocation
        );
        await this.theThingFactory.setState(
          itemTransfer,
          ImitationItemTransfer,
          ImitationItemTransfer.states.completed,
          { force: true }
        );
        await this.invitationFactory.create({
          type: ItemTransferInvitationType,
          inviterId: receiver.id,
          email: giver.email,
          mailSubject: `${receiver.name} 已收到 ${item.name}`,
          mailContent: `${receiver.name} 已收到 ${item.name}，請點選以下網址檢視交付記錄`,
          confirmMessage: `<h3>您將前往交付記錄頁面</h3>`,
          landingUrl: `/${ImitationItemTransfer.routePath}/${itemTransfer.id}`,
          data: {}
        });
        this.emcee.info(`<h3>已通知 ${giver.name}, ${item.name} 的交付已完成</h3>`);
      }
    } catch (error) {
      this.emcee.error(`確認完成失敗，錯誤原因：${error.message}`);
      return Promise.reject();
    }
  }
}
