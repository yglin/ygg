import {
  TheThingImitation,
  TheThing,
  TheThingState,
  TheThingFilter
} from '@ygg/the-thing/core';
import { RelationPurchase } from './purchase';
import { keyBy } from 'lodash';
import { ShoppingCellDefines } from './cell-defines';

export const ImitationOrder = new TheThingImitation({
  id: '7cNQdeD6VZxZshH9A7Law9',
  name: '訂單範本',
  description: '定義交易訂單所需的資料欄位及功能',
  icon: 'shop',
  image: '/assets/images/shopping/order.png',
  filter: new TheThingFilter({
    tags: ['order', ' 訂單']
  })
});

const states: TheThingState[] = [
  {
    name: 'new',
    label: '新建立',
    value: 10,
    icon: 'undo',
    permissions: ['requireOwner', 'state:applied'],
    confirmMessage: (theThing: TheThing) =>
      `取消訂單 ${theThing.name} 回到新建立狀態？`
  },
  {
    name: 'editing',
    label: '修改中',
    value: 20
  },
  {
    name: 'applied',
    label: '已提交',
    value: 30,
    icon: 'send',
    permissions: ['requireOwner', 'state:new'],
    confirmMessage: (theThing: TheThing) =>
      `送出訂單 ${theThing.name} 的申請？`,
    threadable: true
  },
  {
    name: 'paid',
    label: '已付款',
    value: 50,
    icon: 'payment',
    permissions: ['requireAdmin', 'state:applied'],
    confirmMessage: (theThing: TheThing) =>
      `已收到訂單 ${theThing.name} 的所有款項？`,
    threadable: true
  },
  {
    name: 'completed',
    label: '已完成',
    value: 100,
    icon: 'done_all',
    permissions: ['requireAdmin', 'state:paid'],
    confirmMessage: (theThing: TheThing) =>
      `此訂單 ${theThing.name} 的所有活動及商品已交付完成？`,
    threadable: true
  }
];

ImitationOrder.stateName = '訂購狀態';
ImitationOrder.states = keyBy(states, 'name');

ImitationOrder.creators.push((order: TheThing) => {
  order.setState(ImitationOrder.stateName, ImitationOrder.states.new);
  return order;
});

export function getTotalCharge(order: TheThing): number {
  let totalCharge = 0;
  const relations = order.getRelations(RelationPurchase.name);
  for (const relation of relations) {
    const quantity = relation.getCellValue(ShoppingCellDefines.quantity.id);
    const price = relation.getCellValue(ShoppingCellDefines.price.id);
    const charge = price * quantity;
    // console.log(`${price} x ${quantity} = ${charge}`);
    if (charge) {
      totalCharge += charge;
    }
  }
  // console.log(`Total charge = ${totalCharge}`);
  return totalCharge;
}

ImitationOrder.valueFunctions['getTotalCharge'] = getTotalCharge;
