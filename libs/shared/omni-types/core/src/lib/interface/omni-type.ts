import { sample, random } from 'lodash';
import {
  Album,
  Address,
  Location,
  BusinessHours,
  Html,
  DateRange,
  DayTimeRange,
  Contact,
  TimeRange
} from '../types';
import * as moment from 'moment';
import { TimeLength } from '../types/datetime/time-length';

export type OmniTypeComparator = (a: any, b: any, isAsc: boolean) => number;

export type OmniTypeMatcher = (testValue: any, controlValue: any) => boolean;

export type OmniTypeID =
  | 'boolean'
  | 'text'
  | 'longtext'
  | 'number'
  | 'album'
  | 'html'
  | 'email'
  | 'address'
  | 'location'
  | 'datetime'
  | 'date-range'
  | 'time-range'
  | 'day-time-range'
  | 'business-hours'
  | 'contact'
  | 'time-length';

interface OmniType {
  id: OmniTypeID;
  label: string;
  default?: any;
  forge?: (options?: any) => any;
  comparator?: OmniTypeComparator;
  matchers?: { [matcherId: string]: OmniTypeMatcher };
}

export const OmniTypes: { [id: string]: OmniType } = {
  boolean: {
    id: 'boolean',
    label: '二元勾選',
    forge: () => (Math.random() > 0.5 ? true : false),
    comparator: (a: boolean, b: boolean, isAsc: boolean) => {
      return a === b ? -1 : 1;
    },
    default: false
  },
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
        '有那魔炎粽嗎幹',
        '一兼二顧，摸蜊仔兼洗褲',
        '一樣米飼百樣人',
        '一樣生，百樣死',
        '七月半鴨仔',
        '二月初二打雷，稻尾較重秤錘',
        '人衰，種瓠仔生菜瓜',
        '乞食趕廟公',
        '大人爬起，囡仔佔椅',
        '不識字個兼無衛生',
        '公親變事主',
        '生雞卵無，放雞屎有',
        '囝仔人，尻川三斗火',
        '黑矸仔底豆油'
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
    default: null
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
  email: {
    id: 'email',
    label: 'E-mail',
    forge: () =>
      sample([
        'yggisfkinggy@ygmail.com',
        '厚德路78號@ygmail.com',
        '有這個信箱哇頭吼哩@ygmail.com',
        '54088@ygmail.com',
        '59478@ygmail.com',
        'BIGGG5566@ygmail.com',
        'localmama@ygmail.com',
        'loserrrr@ygmail.com',
        'spam@ygmail.com'
      ]),
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
  datetime: {
    id: 'datetime',
    label: '日期＋時間',
    forge: (options: any = {}): Date => {
      return moment()
        .add(random(30), 'day')
        .toDate();
    },
    comparator: (a: Date, b: Date, isAsc: boolean) => {
      return (a.getTime() - b.getTime()) * (isAsc ? 1 : -1);
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
  'time-range': {
    id: 'time-range',
    label: '時間段',
    forge: (options: any = {}): TimeRange => {
      return TimeRange.forge();
    },
    comparator: TimeRange.compare,
    matchers: {
      in: (testValue: TimeRange, controlValue: TimeRange) => {
        return (
          TimeRange.isTimeRange(testValue) &&
          TimeRange.isTimeRange(controlValue) &&
          controlValue.include(testValue)
        );
      }
    },
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
  'time-length': {
    id: 'time-length',
    label: '時長',
    forge: TimeLength.forge,
    comparator: TimeLength.compare,
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
