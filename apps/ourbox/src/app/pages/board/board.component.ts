import { Component, OnInit } from '@angular/core';
import { ImageThumbnailItem } from '@ygg/shared/ui/widgets';
import { range, random, sample } from 'lodash';
import { generateID } from '@ygg/shared/infra/data-access';
import * as moment from 'moment';

interface MessageItem extends ImageThumbnailItem {
  content: string;
  timestamp: Date;
}

function forgeMessageItem(): MessageItem {
  const messageItem: MessageItem = {
    id: generateID(),
    name: `寶箱${random(0, 10)}`,
    image: '/assets/images/box/box.png',
    content: sample([
      '寶箱裡有新的東東：曼秀雷敦(大瓶)',
      'YGG借走醬油',
      '寶箱裡有新的東東：二十年的炒菜鍋',
      '寶箱裡有新的東東：異形系列DVD',
      'YGG借走異形系列',
      '寶箱裡有新的東東：小鳥飛行繩',
      '吉娃娃借走小鳥飛行繩',
      '寶箱裡有新的東東：球棒',
      '流氓借走球棒',
      '寶箱裡有新的東東：梨山高麗菜一箱',
      '菜蟲借走梨山高麗菜'
    ]),
    timestamp: moment()
      .subtract(random(72), 'hour')
      .toDate()
  };
  messageItem.link = `/boxes/${messageItem.id}`;
  return messageItem;
}

@Component({
  selector: 'ygg-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  messages: MessageItem[] = [];

  constructor() {
    this.messages = range(10).map(() => forgeMessageItem());
  }

  ngOnInit(): void {}
}
