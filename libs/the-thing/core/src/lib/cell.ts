import { extend, sample, keys } from 'lodash';

interface TheThingCellType {
  id: string;
  label: string;
  forge: (options?: any) => any;
}

export const TheThingCellTypes: { [id: string]: TheThingCellType } = {
  text: {
    id: 'text',
    label: '文字',
    forge: (options: any = {}) => {
      return sample([
        '白痴YGG',
        '十二指腸',
        '小腹',
        '天空之城',
        '讓美國再次偉大',
        'KAKAPO & KIWI',
        'I O B BK',
        '北斗神拳',
        '有那魔炎粽嗎幹'
      ]);
    }
  },
  longtext: {
    id: 'longtext',
    label: '長文字、段落',
    forge: (options: any = {}) => {
      return sample([
        '在非洲，每六十秒，就有一分鐘過去',
        '凡是每天喝水的人，有高機率在100年內死去',
        '每呼吸60秒，就減少一分鐘的壽命',
        '當你吃下吃下廿碗白飯，換算竟相當於吃下了二十碗白飯的熱量',
        '誰能想的到，這名16歲少女，在四年前，只是一名12歲少女',
        '台灣人在睡覺時，大多數的美國人都在工作',
        '當蝴蝶在南半球拍了兩下翅膀，牠就會稍微飛高一點點',
        '據統計，未婚生子的人數中有高機率為女性',
        '只要每天省下買一杯奶茶的錢，十天後就能買十杯奶茶',
        '當你的左臉被人打，那你的左臉就會痛',
        '今年中秋節剛好是滿月、今年七夕恰逢鬼月、今年母親節正好是星期日',
        '台灣競爭力低落，在美國就連小學生都會說流利的英語',
        '要一例一休 跟你們老闆說',
        '鹿茸是鹿耳朵裡面的毛',
        '捕蜂捉蛇 這是做功德的事情',
        '30歲未婚女佔30％ 國安危機',
        '防禽流感 過冬避免養禽',
        '不想擴大才挖深，挖深後儲水可以養魚',
        '性侵沒抓到就合法'
      ]);
    }
  }
};

export class TheThingCell {
  name: string;
  type: string;
  value: any;

  static forge(options: any = {}): TheThingCell {
    const cell = new TheThingCell();
    cell.name = sample([
      '身高',
      '體重',
      '性別',
      '血型',
      '售價',
      '棲息地',
      '主食',
      '喜歡',
      '天敵',
      '討厭'
    ]);
    if (options.type) {
      cell.type = options.type;
    } else {
      cell.type = sample(keys(TheThingCellTypes));
    }
    cell.value = TheThingCellTypes[cell.type].forge();
    return cell;
  }

  fromJSON(data: any): this {
    extend(this, data);
    return this;
  }

  toJSON(): any {
    return {
      name: this.name,
      type: this.type,
      value:
        this.value && typeof this.value.toJSON === 'function'
          ? this.value.toJSON()
          : this.value
    };
  }
}
