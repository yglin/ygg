import { get, castArray, isEmpty } from 'lodash';
import { Injectable } from '@angular/core';
import {
  TheThingImitation,
  ImitationTemplatesPath,
  TheThing
} from '@ygg/the-thing/core';
import { Observable, throwError } from 'rxjs';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { map, catchError, filter, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TheThingImitationAccessService {
  imitations: { [id: string]: TheThingImitation } = {};

  constructor(private dataAccessService: DataAccessService) {}

  get(id: string): TheThingImitation {
    return get(this.imitations, id, null);
  }

  getTemplate$(imitationId: string): Observable<TheThing> {
    if (!(imitationId in this.imitations)) {
      return throwError(
        new Error(`Unknown the-thing imitation ${imitationId}`)
      );
    }
    const templatePath = `${ImitationTemplatesPath}/${imitationId}`;
    return this.dataAccessService.getDataObject$(templatePath).pipe(
      map(item => new TheThing().fromJSON(item)),
      catchError(error => {
        return throwError(
          new Error(`Failed to load imitation template, ${error.message}`)
        );
      })
    );
  }

  add(imitations: TheThingImitation[]) {
    imitations = castArray(imitations);
    for (const imitation of imitations) {
      if (imitation.id in this.imitations) {
        throw new Error(
          `Imitation "${imitation.id}" already in global imitations`
        );
      }
      this.imitations[imitation.id] = imitation;
    }
  }
}
