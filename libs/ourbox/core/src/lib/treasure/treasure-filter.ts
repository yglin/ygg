import { Tags } from '@ygg/shared/tags/core';
import { extend } from 'lodash';
import { ProvisionType } from './provision-type';
import { Treasure } from './treasure';

export class TreasureFilter {
  tags: Tags;
  provision: ProvisionType;

  constructor(options: any = {}) {
    extend(this, options);
    if (typeof options.provision === 'number') {
      this.provision = new ProvisionType(options.provision);
    }
  }

  match(treasure: Treasure): boolean {
    if (Tags.isTags(this.tags)) {
      if (!treasure.tags.include(this.tags.getTags())) {
        return false;
      }
    }
    if (
      this.provision &&
      this.provision.value &&
      treasure.provision.value !== this.provision.value
    ) {
      return false;
    }
    return true;
  }
}
