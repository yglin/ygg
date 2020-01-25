import { TheThing } from '@ygg/the-thing/core';
import { DateRange } from '@ygg/shared/omni-types/core';

export const TourPlanTemplate = new TheThing().fromJSON({
  tags: ['tour', 'tour-plan', 'schedule', '遊程計畫'],
  name: '遊程計畫名稱',
  imitation: 'tour-plan',
  cells: [
    {
      name: '預計出遊日期',
      type: 'date-range',
      value: DateRange.forge()
    }
  ]
});
