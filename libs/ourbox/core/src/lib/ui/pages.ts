import { Page } from '@ygg/shared/ui/core';
// import { ImitationItem, ImitationBox, ImitationItemTransfer } from '../models';

export const pages: { [id: string]: Page } = {
  createTreasure: {
    id: 'create-treasure',
    icon: 'local_pizza',
    label: '分享我的寶物',
    path: ['/', 'treasure', 'create']
  },
  // mapSearch: {
  //   id: 'mapSearch',
  //   icon: 'map',
  //   label: '藏寶圖',
  //   image: '/assets/images/map.png',
  //   path: ['/', 'ourbox', 'map']
  // },
  // boxCreate: {
  //   id: 'boxCreate',
  //   icon: 'library_add',
  //   label: '開一個新寶箱',
  //   image: '/assets/images/box/create.png',
  //   path: ['/', 'ourbox', 'create-box']
  // },
  // itemWarehouse: {
  //   id: 'itemWarehouse',
  //   icon: ImitationItem.icon,
  //   label: '寶物倉庫',

  //   path: ['/', 'ourbox', 'item-warehouse']
  // },
  // myBoxes: {
  //   id: 'myBoxes',
  //   icon: ImitationBox.icon,
  //   label: '我的寶箱',
  //   image: '/assets/images/box/box.png',
  //   path: ['/', 'ourbox', 'my-boxes']
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
  'createTreasure',
  'mapSearch',
  'boxCreate',
  'itemWarehouse',
  'siteHowto'
];
