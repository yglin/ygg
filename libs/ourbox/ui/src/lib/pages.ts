import { Page } from '@ygg/shared/ui/core';
import { ImitationItem } from '@ygg/ourbox/core';

export const pages: { [id: string]: Page } = {
  mapSearch: {
    id: 'mapSearch',
    icon: 'map',
    label: '附近的寶物',
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
  }
};
