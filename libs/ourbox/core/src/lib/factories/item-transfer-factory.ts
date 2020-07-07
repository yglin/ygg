import {
  TheThing,
  TheThingFactory,
  RelationFactory,
  RelationRecord
} from '@ygg/the-thing/core';
import {
  User,
  Authenticator,
  UserAccessor,
  InvitationFactory,
  Invitation
} from '@ygg/shared/user/core';
import { Emcee, Router } from '@ygg/shared/infra/core';
import { first, isEmpty } from 'lodash';
import { ItemFactory } from './item-factory';
import { take, filter } from 'rxjs/operators';
import {
  ImitationItem,
  ImitationItemTransfer,
  RelationshipItemTransferItem,
  RelationshipItemTransferGiver,
  RelationshipItemTransferReceiver,
  ImitationItemTransferCellDefines,
  ImitationItemTransferStates
} from '../models';

export const ItemTransferInvitationType = 'ourbox-item-transfer';

export class ItemTransferFactory {
  constructor(
    protected emcee: Emcee,
    protected router: Router,
    protected authenticator: Authenticator,
    // protected itemAccessor: ItemAccessor,
    protected itemFactory: ItemFactory,
    protected theThingFactory: TheThingFactory,
    protected relationFactory: RelationFactory,
    protected userAccessor: UserAccessor,
    protected invitationFactory: InvitationFactory
  ) {}

  async create(item: TheThing, giver: User, receiver: User): Promise<TheThing> {
    try {
      const newItemTrnasfer = await this.theThingFactory.create({
        imitation: ImitationItemTransfer
      });
      newItemTrnasfer.name = `${giver.name} 讓渡 ${item.name} 給 ${receiver.name} 的交付記錄`;
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
      return this.theThingFactory.onSave$
        .pipe(
          filter(thing => thing.id === newItemTrnasfer.id),
          take(1)
        )
        .toPromise()
        .then(async (resultItemTransfer: TheThing) => {
          await this.sendNotification(resultItemTransfer);
          return resultItemTransfer;
        });
    } catch (error) {
      this.emcee.error(`新增寶物失敗，錯誤原因：${error.message}`);
      return;
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
        `建立 ${!!item ? item.name : itemId} 的讓渡任務失敗，錯誤原因：${
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

  async sendNotification(itemTransfer: TheThing) {
    let item: TheThing;
    let giver: User;
    let receiver: User;
    try {
      item = await this.getTransferItem(itemTransfer.id);
      giver = await this.getGiver(itemTransfer.id);
      receiver = await this.getReceiver(itemTransfer.id);
      this.invitationFactory.create({
        type: ItemTransferInvitationType,
        inviterId: giver.id,
        email: receiver.email,
        mailSubject: `${giver.name} 想要將 ${item.name} 交給你`,
        mailContent: `${giver.name} 想要將 ${item.name} 交給你，請點選以下網址檢視讓渡約定的相關訊息`,
        confirmMessage: `<h3>您將前往讓渡通知的頁面</h3><br><h3>請確認相關約定事項</h3>`,
        landingUrl: `/${ImitationItemTransfer.routePath}/${itemTransfer.id}`,
        data: {}
      });
      await this.emcee.info(
        `已送出 ${item.name} 的讓渡要求，請等待 ${receiver.name} 的回應`
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
        }讓渡通知失敗，錯誤原因：${error.message}`
      );
    }
  }
}
