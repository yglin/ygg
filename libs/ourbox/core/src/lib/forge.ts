import { ImitationItem } from './models';
import { defaults, isEmpty, random, range, sampleSize } from 'lodash';
import { TheThing } from '@ygg/the-thing/core';
import { forgeTags, Tag, Tags } from '@ygg/tags/core';

export function forgeItems(
  options: { count?: number; tags?: Tag[] } = {}
): TheThing[] {
  options = defaults(options, { count: 10 });

  const items = range(options.count).map((value, index) => {
    const item = ImitationItem.forgeTheThing();
    item.name += `_${index}`;
    return item;
  });

  if (!isEmpty(options.tags)) {
    const tagsPool = options.tags.map(tag => tag.id);
    items.forEach(item => {
      item.setTags(new Tags(sampleSize(tagsPool, random(3, tagsPool.length))));
    });
  }
  return items;
}
