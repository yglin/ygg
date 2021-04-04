import { Page } from '@ygg/shared/ui/core';
import { Box } from '../box';
import { Treasure } from '../treasure';
// import { ImitationItem, ImitationBox, ImitationItemTransfer } from '../models';

export const pages: { [id: string]: Page } = {
  'create-treasure': {
    id: 'create-treasure',
    icon: 'local_pizza',
    label: '分享寶物',
    path: ['/', 'treasure', 'create']
  },
  'box-create': {
    id: 'box-create',
    icon: 'library_add',
    label: '開新寶箱',
    event: { name: 'box.create' }
  },
  'my-boxes': {
    id: 'my-boxes',
    icon: Box.icon,
    label: '我的寶箱',
    image: '/assets/images/box/box.png',
    path: ['/', 'my', 'boxes']
  },
  'my-treasures': {
    id: 'my-treasures',
    icon: Treasure.icon,
    label: '我的寶物',
    path: ['/', 'my', 'treasures']
  },
  'treasure-map': {
    id: 'treasure-map',
    icon: 'map',
    label: '藏寶地圖',
    path: ['/', 'treasure-map']
  }
  // itemWarehouse: {
  //   id: 'itemWarehouse',
  //   icon: ImitationItem.icon,
  //   label: '寶物倉庫',

  //   path: ['/', 'ourbox', 'item-warehouse']
  // },
  // myHeldItems: {
  //   id: 'myHeldItems',
  //   icon: 'local_offer',
  //   label: '持有寶物',
  //   path: ['/', 'ourbox', 'my-held-items']
  // },
  // myItemTransfers: {
  //   id: 'myItemTransfers',
  //   icon: ImitationItemTransfer.icon,
  //   label: '交付任務',
  //   path: ['/', 'ourbox', 'my-item-transfers']
  // },
  // siteHowto: {
  //   id: 'siteHowto',
  //   icon: 'help_center',
  //   label: '如何使用本站',
  //   image: '/assets/images/howto/howto.png',
  //   path: ['/', 'ourbox', 'site-howto']
  // }
};

export const pagesInSideDrawer = [
  'treasure-map',
  'create-treasure',
  'box-create',
  'my-treasures',
  'my-boxes'
  // 'mapSearch',
  // 'boxCreate',
  // 'itemWarehouse',
  // 'siteHowto'
];
