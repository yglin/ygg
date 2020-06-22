import {
  TheThingImitation,
  TheThingCellDefine,
  Relationship,
  TheThingFilter
} from '@ygg/the-thing/core';
import { OmniTypes } from '@ygg/shared/omni-types/core';
import { values } from 'lodash';

export const RelationshipBoxMember = {
  role: 'member'
};

export const RelationshipBoxItem = {
  role: 'boxitem'
};

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
    name: '公開',
    type: OmniTypes.boolean.id,
    userInput: 'required'
  }),
  friends: new TheThingCellDefine({
    name: '箱友',
    type: OmniTypes.text.id,
    userInput: 'hidden'
  })
};

export const ImitationBox = new TheThingImitation({
  collection: 'ourboxes',
  id: 'ourbox-box',
  name: '我們的寶箱',
  cellsDef: values(ImitationBoxCells),
  routePath: 'ourbox',
  filter: new TheThingFilter({
    name: 'ourbox-box',
    tags: []
  })
});
