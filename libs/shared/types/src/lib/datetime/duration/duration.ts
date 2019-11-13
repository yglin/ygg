import { TimeRange } from '../time-range';

export class Duration {
  timeRange: TimeRange;

  /**
   * Interval between each recurring.
   * undefined or 0 means no recurring.
   */
  recurInterval: number;
}