import { defaults, random, sampleSize } from 'lodash';
import { Tag } from './tag';

export function forgeTags(options: { count?: number } = {}): Tag[] {
  options = defaults(options, { count: 10 });
  const tagsPool: string[] = [
    '小雞雞',
    '肚臍',
    '昏叫',
    '92共屎',
    '一中各婊',
    '小腹',
    '鄉民',
    '30cm',
    'Satoyama',
    'Permaculture',
    '你才祖國，你全家都祖國',
    '台灣難波萬',
    'B級片',
    'Screw You Guys I\'m Going Home',
    '我們的島',
    'Doh~!!!',
    'Loser~',
    'ㄇㄉㄈㄎ'
  ];
  const count = Math.min(tagsPool.length, options.count);
  return sampleSize(tagsPool, count).map(tagName => {
    const tag = new Tag().fromJSON({
      id: tagName,
      popularity: random(10, 100)
    });
    return tag;
  });
}
