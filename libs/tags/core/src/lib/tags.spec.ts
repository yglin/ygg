import { range, random, uniqBy } from 'lodash';
import { Tags } from './tags';
import { Tag } from './tag';
import { v4 as uuid } from 'uuid';

describe('Tags', () => {
  const tagsArray: Tag[] = uniqBy(range(random(5, 10)).map(() => Tag.forge()), tag => tag.name);

  it('getNames() should return names array', () => {
    const tags1 = new Tags(tagsArray);
    expect(tags1.getNames()).toEqual(tagsArray.map(tag => tag.name));
  });
  
  it('can be newed by Tags or Tag array or string array', () => {
    const tags1 = new Tags(tagsArray);
    expect(tags1.getNames()).toEqual(tagsArray.map(tag => tag.name));
    const tags2 = new Tags(tags1);
    expect(tags2.getNames()).toEqual(tags1.getNames());
    const tags3 = new Tags(tags2.getNames());
    expect(tags3.getNames()).toEqual(tags2.getNames());
  });

  it('should only add unique tags by names', () => {
    const tags = new Tags();
    tags.push(...['APPLE', 'ORANGE', 'APPLE', 'BANANA']);
    expect(tags.getNames()).toEqual(['APPLE', 'ORANGE', 'BANANA']);
  });

  it('can test if has specific tag by name', () => {
    const tags = new Tags(tagsArray);
    expect(tags.has(tagsArray[0].name)).toBe(true);
    // Nearly impossible to have a created uuid as tag name, so expect it's false;
    expect(tags.has(uuid())).toBe(false);
  });

  it('can remove tag', () => {
    const tags = new Tags();
    tags.push(...['DOG', 'CAT', 'BIRB', 'BUNNY']);
    tags.remove('BIRB');
    expect(tags.getNames()).toEqual(['DOG', 'CAT', 'BUNNY']);
  });

  it('can clear all tags', () => {
    const tags = new Tags(tagsArray);
    tags.clear();
    expect(tags.toNameArray().length).toBe(0);
  });
  
});
