import { Page } from '@ygg/shared/ui/core';
import { ImitationItem, ImitationBox, ImitationItemTransfer } from '../models';

export const pages: { [id: string]: Page } = {
  mapSearch: {
    id: 'mapSearch',
    icon: 'map',
    label: '藏寶圖',
    path: ['ourbox', 'map']
  },
  boxCreate: {
    id: 'boxCreate',
    icon: 'library_add',
    label: '開一個新寶箱',
    path: ['ourbox', 'create-box']
  },
  itemWarehouse: {
    id: 'itemWarehouse',
    icon: ImitationItem.icon,
    label: '寶物倉庫',
    path: ['ourbox', 'item-warehouse']
  },
  myBoxes: {
    id: 'myBoxes',
    icon: ImitationBox.icon,
    label: '我的寶箱',
    path: ['ourbox', 'my-boxes']
  },
  myHeldItems: {
    id: 'myHeldItems',
    icon: 'local_offer',
    label: '持有寶物',
    path: ['ourbox', 'my-held-items']
  },
  myItemTransfers: {
    id: 'myItemTransfers',
    icon: ImitationItemTransfer.icon,
    label: '交付任務',
    path: ['ourbox', 'my-item-transfers']
  }
};
