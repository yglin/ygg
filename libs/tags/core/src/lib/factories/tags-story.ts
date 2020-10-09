import { Tags } from '../models';

export abstract class TagsStory {
  constructor() {}
  abstract async editTags(tags: Tags): Promise<Tags>;
}
