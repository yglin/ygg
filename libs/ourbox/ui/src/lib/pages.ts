import { Page } from '@ygg/shared/ui/core';

export const pages: { [id: string]: Page } = {
  mapSearch: {
    id: 'mapSearch',
    icon: 'category',
    label: '附近的寶物',
    path: ['ourbox', 'map']
  },
  boxCreate: {
    id: 'boxCreate',
    icon: 'library_add',
    label: '開一個新寶箱',
    path: ['ourbox', 'create-box']
  }
};
