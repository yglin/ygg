import { Item } from './models';
import { range } from 'lodash';
import { TheThing } from '@ygg/the-thing/core';

export function forgeItems(
  options: { count?: number } = { count: 10 }
): Item[] {
  return range(options.count).map(() => TheThing.forge());
}
