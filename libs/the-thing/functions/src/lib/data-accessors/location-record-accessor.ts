import { LocationRecordAccessor } from '@ygg/the-thing/core';
import { DataAccessor } from '@ygg/shared/infra/core';

export class LocationRecordAccessFunctions extends LocationRecordAccessor {
  constructor(dataAccessor: DataAccessor) {
    super(dataAccessor);
  }
}