import { get, castArray, isEmpty, values } from 'lodash';
import { Injectable } from '@angular/core';
import {
  TheThingImitation,
  ImitationsDataPath,
  TheThing
} from '@ygg/the-thing/core';
import { Observable, throwError } from 'rxjs';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { map, switchMap, catchError, filter, timeout } from 'rxjs/operators';
import { TheThingAccessService } from './the-thing-access.service';
import { LogService } from '@ygg/shared/infra/log';

@Injectable({
  providedIn: 'root'
})
export class TheThingImitationAccessService {
  constructor(
    private logService: LogService,
    private dataAccessService: DataAccessService,
    private theThingAccessService: TheThingAccessService
  ) {}

  list$(): Observable<TheThingImitation[]> {
    return this.dataAccessService
      .getDataObject$<TheThingImitation[]>(ImitationsDataPath)
      .pipe(
        map(items =>
          values(items).map(item => new TheThingImitation().fromJSON(item))
        ),
        catchError(error => {
          this.logService.error(error.message);
          return [];
        })
      );
  }

  async upsert(imitation: TheThingImitation) {
    return this.dataAccessService.setDataObject(
      `${ImitationsDataPath}/${imitation.id}`,
      imitation.toJSON()
    );
  }

  get$(id: string): Observable<TheThingImitation> {
    return this.dataAccessService
      .getDataObject$(`${ImitationsDataPath}/${id}`)
      .pipe(map(item => new TheThingImitation().fromJSON(item)));
  }

  getTemplate$(id: string): Observable<TheThing> {
    return this.get$(id).pipe(
      switchMap((imitation: TheThingImitation) =>
        this.theThingAccessService.get$(imitation.templateId)
      )
    );
  }

  // getTemplate$(imitationId: string): Observable<TheThing> {
  //   if (!(imitationId in this.imitations)) {
  //     return throwError(
  //       new Error(`Unknown the-thing imitation ${imitationId}`)
  //     );
  //   }
  //   const templatePath = `${ImitationTemplatesPath}/${imitationId}`;
  //   return this.dataAccessService.getDataObject$(templatePath).pipe(
  //     map(item => new TheThing().fromJSON(item)),
  //     catchError(error => {
  //       return throwError(
  //         new Error(`Failed to load imitation template, ${error.message}`)
  //       );
  //     })
  //   );
  // }

  // add(imitations: TheThingImitation[]) {
  //   imitations = castArray(imitations);
  //   for (const imitation of imitations) {
  //     if (imitation.id in this.imitations) {
  //       throw new Error(
  //         `Imitation "${imitation.id}" already in global imitations`
  //       );
  //     }
  //     this.imitations[imitation.id] = imitation;
  //   }
  // }
}
