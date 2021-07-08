import { extend, get, range, sample } from 'lodash';

export const provisionTypes = [];

export class ProvisionType {
  static provisionLabels = ['分享', '出借', '二手販售'];
  static provisionIcons = ['volunteer_activism', 'local_library', 'paid'];

  value: number;

  constructor(options = {}) {
    if (typeof options === 'number') {
      this.value = options;
    } else {
      extend(this, options);
    }
  }

  get label() {
    return get(ProvisionType.provisionLabels, this.value - 1, '不明');
  }

  get icon() {
    return get(ProvisionType.provisionIcons, this.value - 1, 'help_outline');
  }

  static forge() {
    return sample(provisionTypes);
  }

  toJSON() {
    return this.value;
  }

  isEqual(other: ProvisionType): boolean {
    return this.value === other.value;
  }
}

provisionTypes.push(...range(1, 4).map(v => new ProvisionType(v)));
