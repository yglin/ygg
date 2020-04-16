import { sample, random } from 'lodash';
import {
  Album,
  Address,
  Location,
  BusinessHours,
  Html,
  DateRange,
  DayTimeRange,
  Contact
} from '../types';

export type OmniTypeComparator = (a: any, b: any, isAsc: boolean) => number;

export type OmniTypeID =
  | 'text'
  | 'longtext'
  | 'number'
  | 'album'
  | 'html'
  | 'address'
  | 'location'
  | 'date-range'
  | 'day-time-range'
  | 'business-hours'
  | 'contact';

interface OmniType {
  id: OmniTypeID;
  label: string;
  default?: any;
  forge?: (options?: any) => any;
  comparator?: OmniTypeComparator;
}

export const OmniTypes: { [id: string]: OmniType } = {
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
    },
    comparator: (a: string, b: string, isAsc: boolean) => {
      return (+a < +b ? -1 : 1) * (isAsc ? 1 : -1);
    },
    default: ''
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
    },
    comparator: (a: string, b: string, isAsc: boolean) => {
      return (+a < +b ? -1 : 1) * (isAsc ? 1 : -1);
    },
    default: ''
  },
  number: {
    id: 'number',
    label: '數字',
    forge: (options: any = {}) => {
      return random(0, 1000);
    },
    comparator: (a: number, b: number, isAsc: boolean) => {
      return (a - b) * (isAsc ? 1 : -1);
    },
    default: 0
  },
  album: {
    id: 'album',
    label: '照片，相簿',
    forge: (options: any = {}): Album => {
      return Album.forge();
    },
    default: null
  },
  html: {
    id: 'html',
    label: 'HTML網頁內容',
    forge: (options: any = {}): Html => {
      return Html.forge(options);
    },
    default: ''
  },
  address: {
    id: 'address',
    label: '地址',
    forge: (options: any = {}): Address => {
      return Address.forge();
    },
    default: null
  },
  location: {
    id: 'location',
    label: '地點',
    forge: (options: any = {}): Location => {
      return Location.forge();
    },
    default: null
  },
  'date-range': {
    id: 'date-range',
    label: '日期期間',
    forge: (options: any = {}): DateRange => {
      return DateRange.forge();
    },
    comparator: DateRange.compare,
    default: null
  },
  'day-time-range': {
    id: 'day-time-range',
    label: '日時間區段（24小時）',
    forge: (options: any = {}): DayTimeRange => {
      return DayTimeRange.forge();
    },
    comparator: DayTimeRange.compare,
    default: null
  },
  'business-hours': {
    id: 'business-hours',
    label: '服務時段(每週)',
    forge: (options: any = {}): BusinessHours => {
      return BusinessHours.forge();
    },
    default: null
  },
  contact: {
    id: 'contact',
    label: '聯絡資料',
    forge: (options: any = {}): Contact => {
      return Contact.forge();
    },
    default: null
  }
};