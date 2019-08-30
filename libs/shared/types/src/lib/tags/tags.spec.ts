import { range, random, uniqBy } from 'lodash';
import { Tags, Tag } from './tags';
import { v4 as uuid } from 'uuid';

describe('Tags', () => {
  const tagsArray: Tag[] = uniqBy(range(random(5, 10)).map(() => Tag.forge()), tag => tag.name);

  it('could be newed by Tags or Tag array or string array', () => {
    const tags1 = new Tags(tagsArray);
    expect(tags1.toJSON()).toEqual(tagsArray.map(tag => tag.toJSON()));
    const tags2 = new Tags(tags1);
    expect(tags2.toJSON()).toEqual(tags1.toJSON());
    const tags3 = new Tags(tagsArray.map(tag => tag.toJSON()));
    expect(tags3.toJSON()).toEqual(tagsArray.map(tag => tag.toJSON()));
  });

  it('getNames() should return names array', () => {
    const tags1 = new Tags(tagsArray);
    expect(tags1.getNames()).toEqual(tagsArray.map(tag => tag.name));
  });
  
  it('should only add unique tags by names', () => {
    const tags = new Tags();
    tags.push(...['APPLE', 'ORANGE', 'APPLE', 'BANANA']);
    expect(tags.toJSON()).toEqual(['APPLE', 'ORANGE', 'BANANA']);
  });

  it('could test if has specific tag by name', () => {
    const tags = new Tags(tagsArray);
    expect(tags.has(tagsArray[0].name)).toBe(true);
    expect(tags.has(uuid())).toBe(false);
  });

  it('could remove tag', () => {
    const tags = new Tags();
    tags.push(...['DOG', 'CAT', 'BIRB', 'BUNNY']);
    tags.remove('BIRB');
    expect(tags.toJSON()).toEqual(['DOG', 'CAT', 'BUNNY']);
  });

  it('could clear all tags', () => {
    const tags = new Tags(tagsArray);
    tags.clear();
    expect(tags.toJSON()).toHaveLength(0);
  });
  
  it('could serialize to JSON object back and forth', () => {
    const tags = new Tags(tagsArray);
    let jsonData = tags.toJSON();
    expect(jsonData).toEqual(tagsArray.map(tag => tag.toJSON()));

    tags.clear();
    jsonData = tagsArray.map(tag => tag.toJSON());
    tags.fromJSON(jsonData)
    expect(tags.toJSON()).toEqual(jsonData);
  });
  
});
