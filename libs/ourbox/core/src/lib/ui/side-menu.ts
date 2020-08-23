import { SideMenu } from '@ygg/shared/ui/core';
import { keyBy } from 'lodash';
import { ImitationBox } from '../models';

export const OurBoxSideMenu: SideMenu = {
  links: keyBy(
    [
      {
        id: 'boxCreate',
        icon: ImitationBox.icon,
        label: '開新寶箱',
        path: ['ourbox', 'create-box']
      }
    ],
    'id'
  )
};
