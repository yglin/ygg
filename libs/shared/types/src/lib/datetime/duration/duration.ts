import { TimeRange } from '../time-range';
import { SerializableJSON } from '@ygg/shared/infra/data-access';

export class Duration implements SerializableJSON {
  timeRange: TimeRange;

  /**
   * Interval between each recurring.
   * undefined or 0 means no recurring.
   */
  recurInterval: number;

  fromJSON(data: any): this {
    if (data.timeRange) {
      this.timeRange = new TimeRange(data.timeRange);
    }
    if (data.recurInterval) {
      this.recurInterval = data.recurInterval;
    }
    return this;
  }

  toJSON(): any {
    return {
      timeRange: this.timeRange.toJSON(),
      recurInterval: this.recurInterval || 0
    };
  }
}