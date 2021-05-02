import { Treasure } from '@ygg/ourbox/core';
import { dataAccessor } from '@ygg/shared/functions';
import { generateOnCreateFunction } from '@ygg/shared/tags/functions';

export const onTreasureCreate = generateOnCreateFunction(
  Treasure.collection,
  dataAccessor
);
