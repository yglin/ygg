import { Tag } from '@ygg/tags/core';

type UserOptionTags = Tag[];

export interface TagsFeatureConfig {
  userOptions: { [taggableType: string ]: UserOptionTags };
}