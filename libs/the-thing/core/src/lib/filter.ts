import { extend, isEmpty, assign } from 'lodash';
import { TheThing } from './the-thing';
import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/core';
import { Tags } from '@ygg/tags/core';
import { __assign } from 'tslib';
import {
  DateRange,
  TimeRange,
  OmniTypeMatcher
} from '@ygg/shared/omni-types/core';

export interface CellFilter {
  cellName: string;
  matcher: OmniTypeMatcher;
  value: any;
}

export class TheThingFilter implements SerializableJSON {
  name: string;
  ids: string[] = [];
  tags: string[] = [];
  ownerId: string;
  keywordName: string;
  flags: { [name: string]: boolean } = {};
  states: { [name: string]: number } = {};
  stateTimeRange: TimeRange;
  cellFilters: CellFilter[] = [];

  constructor(...args: any[]) {
    if (!isEmpty(args)) {
      if (typeof args[0] === 'string') {
        this.name = args[0];
        if (args.length >= 2 && typeof args[1] === 'object') {
          extend(this, args[1]);
        }
      } else if (typeof args[0] === 'object') {
        extend(this, args[0]);
      }
    }
  }

  filter(theThings: TheThing[]): TheThing[] {
    return theThings.filter(theThing => this.test(theThing));
  }

  merge(filter: TheThingFilter): TheThingFilter {
    if (!filter) {
      return this.clone();
    } else {
      const name = `${this.name} ＆ ${filter.name}`;
      const tags = new Tags(this.tags)
        .merge(new Tags(filter.tags))
        .toNameArray();
      const keywordName = `${!!this.keywordName ? this.keywordName : ''} ${
        !!filter.keywordName ? filter.keywordName : ''
      }`.trim();
      const ownerId = !!filter.ownerId ? filter.ownerId : this.ownerId;
      const flags = assign({}, this.flags, filter.flags);
      const states = assign({}, this.states, filter.states);
      return new TheThingFilter(name, {
        tags: tags,
        ownerId: ownerId,
        keywordName: keywordName,
        flags,
        states,
        stateTimeRange: filter.stateTimeRange
      });
    }
  }

  test(theThing: TheThing): boolean {
    if (!isEmpty(this.ids)) {
      if (this.ids.indexOf(theThing.id) < 0) {
        return false;
      }
    }
    if (!!this.ownerId && theThing.ownerId !== this.ownerId) {
      return false;
    }
    if (!isEmpty(this.tags) && !theThing.tags.include(this.tags)) {
      return false;
    }
    if (!isEmpty(this.keywordName)) {
      const seachText = JSON.stringify(theThing).toLowerCase();
      const keywords: string[] = this.keywordName.split(' ,');
      if (!isEmpty(keywords)) {
        for (const keyword of keywords) {
          if (!seachText.includes(keyword.toLowerCase())) {
            return false;
          }
        }
      }
    }
    for (const cellFilter of this.cellFilters) {
      const cellValue = theThing.getCellValue(cellFilter.cellName);
      if (!cellFilter.matcher(cellValue, cellFilter.value)) {
        return false;
      }
    }
    for (const name in this.flags) {
      if (this.flags.hasOwnProperty(name)) {
        const value = this.flags[name];
        // console.log(`${theThing.getFlag(name)} ?= ${value}`);
        if (theThing.getFlag(name) !== value) {
          return false;
        }
      }
    }
    for (const name in this.states) {
      if (this.states.hasOwnProperty(name)) {
        const value = this.states[name];
        // console.log(`${theThing.getFlag(name)} ?= ${value}`);
        if (!theThing.isState(name, value)) {
          return false;
        }
        const stateTimestamp = theThing.stateTimestamps[`${name}__${value}`];
        if (
          this.stateTimeRange &&
          stateTimestamp &&
          !this.stateTimeRange.isBetweenIn(stateTimestamp)
        ) {
          // console.dir(this.stateTimeRange);
          // console.log(stateTimestamp);
          // console.log('Filter false~!!');
          return false;
        }
      }
    }
    return true;
  }

  addFlags(flags: { [name: string]: boolean }) {
    assign(this.flags, flags);
  }

  addState(stateName: string, value: number) {
    this.states[stateName] = value;
  }

  setStateTimeRange(timeRange: TimeRange) {
    this.stateTimeRange = timeRange;
  }

  addCellFilter(cellName: string, matcher: OmniTypeMatcher, value: any) {
    this.cellFilters.push({
      cellName,
      matcher,
      value
    });
  }

  clone(): TheThingFilter {
    return new TheThingFilter().fromJSON(this.toJSON());
  }

  fromJSON(data: any): this {
    extend(this, data);
    if (data.stateTimeRange) {
      this.stateTimeRange = new DateRange().fromJSON(data.stateTimeRange);
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
