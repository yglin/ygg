import { ImitationItem } from './models';
import { range } from 'lodash';
import { TheThing } from '@ygg/the-thing/core';

export function forgeItems(
  options: { count?: number } = { count: 10 }
): TheThing[] {
  return range(options.count).map(() => ImitationItem.forgeTheThing());
}
