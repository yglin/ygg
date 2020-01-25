import { TheThing } from "@ygg/the-thing/core";
import { DateRange } from "@ygg/shared/omni-types/core";

export const SampleTourPlan = new TheThing().fromJSON({
  tags: ['tour', 'plan', 'scheudle', '遊程規劃'],
  name: '八卦山二日遊',
  cells: [
    {
      name: '預計出遊日期',
      type: 'date-range',
      value: DateRange.forge().toJSON()
    }
  ]
});