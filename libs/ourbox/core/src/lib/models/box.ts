import {
  TheThingImitation,
  TheThingCellDefine,
  TheThingFilter,
  Relationship
} from '@ygg/the-thing/core';
import { OmniTypes } from '@ygg/shared/omni-types/core';
import { values } from 'lodash';
import { User } from '@ygg/shared/user/core';
import { ImitationItem } from './item';

export const ImitationBoxFlags = {
  isPublic: {
    id: 'isPublic',
    label: '公開',
    description: '寶箱資訊以及寶箱內的寶物是否能被公開搜尋找到，例如地圖搜尋'
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

export const ImitationBoxCells = {
  public: new TheThingCellDefine({
    id: 'public',
    label: '公開',
    type: OmniTypes.boolean.id,
    userInput: 'required'
  })
};

export const ImitationBox = new TheThingImitation({
  collection: 'ourboxes',
  id: 'ourbox-box',
  name: '我們的寶箱',
  cellsDef: values(ImitationBoxCells),
  routePath: 'ourbox',
  icon: 'inbox',
  image: '/assets/images/box/box.png',
  filter: new TheThingFilter({
    name: 'ourbox-box',
    tags: []
  }),
  flags: [ImitationBoxFlags.isPublic.id]
});

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

