import { range } from 'lodash';
import { Observable, of } from 'rxjs';
import { generateID } from '@ygg/shared/infra/core';

export class TagsFinder {
  findTopTags$(count: number): Observable<string[]> {
    return of(range(count).map(() => generateID()));
  }
}
