import { dataAccessor } from '@ygg/shared/functions';
import { generateOnCreateFunction } from '@ygg/shared/tags/functions';
import { Post } from '@ygg/shared/post/core';

export const onPostCreate = generateOnCreateFunction(
  Post.collection,
  dataAccessor
);
