import { mapValues, keyBy, extend } from 'lodash';
import {
  TheThingCellDefine,
  CommonCellIds,
  CommonCellDefines
} from '@ygg/the-thing/core';
import { ShoppingCellIds, ShoppingCellDefines } from '@ygg/shopping/core';

export type CellIds =
  | CommonCellIds
  | ShoppingCellIds
  | 'timeRange'
  | 'timeLength'
  | 'businessHours'
  | 'numParticipants'
  | 'subtitle'
  | 'dateRange'
  | 'dayTimeRange'
  | 'aboutMeals'
  | 'aboutTransport'
  | 'numElders'
  | 'numKids'
  | 'numPartTimes';

export const CellDefines: {
  [key in CellIds]: TheThingCellDefine;
} = extend(
  CommonCellDefines,
  ShoppingCellDefines,
  mapValues(
    {
      timeRange: {
        id: 'timeRange',
        label: '時段',
        type: 'time-range'
      },
      timeLength: {
        id: 'timeLength',
        label: '時長',
        type: 'number'
      },
      businessHours: {
        id: 'businessHours',
        label: '服務時段',
        type: 'business-hours'
      },
      numParticipants: {
        id: 'numParticipants',
        label: '參加人數',
        type: 'number'
      },
      subtitle: {
        id: 'subtitle',
        label: '副標題',
        type: 'text'
      },
      dateRange: {
        id: 'dateRange',
        label: '預計出遊日期',
        type: 'date-range'
      },
      dayTimeRange: {
        id: 'dayTimeRange',
        label: '預計遊玩時間',
        type: 'day-time-range'
      },
      aboutMeals: {
        id: 'aboutMeals',
        label: '用餐需求',
        type: 'longtext'
      },
      aboutTransport: {
        id: 'aboutTransport',
        label: '交通需求',
        type: 'longtext'
      },
      numElders: {
        id: 'numElders',
        label: '長輩人數',
        type: 'number'
      },
      numKids: { id: 'numKids', label: '孩童人數', type: 'number' },
      numPartTimes: {
        id: 'numPartTimes',
        label: '司領人數',
        type: 'number'
      }
    },
    options => new TheThingCellDefine(options)
  )
);
