import {
  TheThingImitation,
  TheThingCellDefine,
  TheThingFilter,
  Relationship,
  TheThingFlagDefine,
  TheThing
} from '@ygg/the-thing/core';
import { OmniTypes } from '@ygg/shared/omni-types/core';
import { values } from 'lodash';
import { User } from '@ygg/shared/user/core';
import { ImitationItem } from './item';

export const ImitationBoxFlags: { [id: string]: TheThingFlagDefine } = {
  isPublic: {
    id: 'isPublic',
    label: '公開',
    description:
      '<h3>公開寶箱內的寶物會顯示在公開搜尋結果中，例如藏寶圖以及寶物倉庫</h3><h3>非公開寶箱內的寶物，只有寶箱成員能看得到</h3>'
  }
};

export const ImitationBoxThumbnailImages = [
  '/assets/images/box/thumbnails/01.png',
  '/assets/images/box/thumbnails/02.png',
  '/assets/images/box/thumbnails/03.png',
  '/assets/images/box/thumbnails/04.png',
  '/assets/images/box/thumbnails/05.png',
  '/assets/images/box/thumbnails/06.png',
  '/assets/images/box/thumbnails/07.png',
  '/assets/images/box/thumbnails/08.png'
];

// export const ImitationBoxCells = {
//   public: new TheThingCellDefine({
//     id: 'public',
//     label: '公開',
//     type: OmniTypes.boolean.id,
//     userInput: 'required'
//   })
// };

export const ImitationBox = new TheThingImitation({
  collection: 'ourboxes',
  id: 'ourbox-box',
  name: '我們的寶箱',
  cellsDef: [],
  routePath: 'ourbox',
  icon: 'inbox',
  image: '/assets/images/box/box.png',
  filter: new TheThingFilter({
    name: 'ourbox-box',
    tags: []
  }),
  flags: [ImitationBoxFlags.isPublic.id],
  stateName: 'ourbox-box-state'
});

ImitationBox.states = {
  new: {
    name: 'new',
    label: '新建立',
    value: 10,
    icon: 'drafts'
  },
  open: {
    name: 'open',
    label: '寶箱開開的',
    value: 50,
    icon: 'inbox',
    threadable: true
  },
  close: {
    name: 'close',
    label: '寶箱先關起來',
    value: 100,
    icon: 'lock'
  }
};

ImitationBox.stateChanges = {
  initial: { next: ImitationBox.states.new },
  onSave: { previous: ImitationBox.states.new, next: ImitationBox.states.open }
};

ImitationBox.canModify = (theThing: TheThing) =>
  ImitationBox.isState(theThing, ImitationBox.states.new);

export const RelationshipBoxMember = new Relationship({
  name: 'ourbox-box-member',
  subjectImitation: ImitationBox,
  objectCollection: User.collection
});

export const RelationshipBoxItem = new Relationship({
  name: 'ourbox-box-item',
  subjectImitation: ImitationBox,
  objectImitation: ImitationItem
});

ImitationBox.actions = {
  'add-member': {
    id: 'ourbox-box-add-member',
    icon: 'group_add',
    tooltip: '新增並邀請寶箱成員',
    permissions: ['requireOwner']
  },
  'create-item': {
    id: 'ourbox-box-create-item',
    icon: 'addchart',
    tooltip: '新增寶物',
    permissions: [
      `state:${ImitationBox.states.open.name}`,
      `role:${RelationshipBoxMember.role}`
    ]
  }
};
