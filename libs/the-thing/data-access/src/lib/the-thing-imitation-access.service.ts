import { get, castArray, isEmpty, values, uniqBy } from 'lodash';
import { Injectable } from '@angular/core';
import {
  TheThingImitation,
  ImitationsDataPath,
  TheThing
} from '@ygg/the-thing/core';
import { Observable, throwError, of, combineLatest } from 'rxjs';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { map, startWith, catchError, filter, timeout } from 'rxjs/operators';
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

  localList: { [id: string]: TheThingImitation } = {};

  addLocal(imitations: TheThingImitation | TheThingImitation[]) {
    imitations = castArray(imitations);
    for (const imitation of imitations) {
      this.localList[imitation.id] = imitation;
    }
  }

  list$(): Observable<TheThingImitation[]> {
    const remote$ = this.dataAccessService
      .getDataObject$<TheThingImitation[]>(ImitationsDataPath)
      .pipe(
        startWith([]),
        map(items =>
          values(items).map(item => new TheThingImitation().fromJSON(item))
        ),
        catchError(error => {
          this.logService.error(error.message);
          return [];
        })
      );
    const local$ = of(values(this.localList));
    return combineLatest([remote$, local$]).pipe(
      map(([remote, local]) =>
        uniqBy<TheThingImitation>(remote.concat(local), 'id')
      )
    );
  }

  async upsert(imitation: TheThingImitation) {
    await this.dataAccessService.setDataObject(
      `${ImitationsDataPath}/${imitation.id}`,
      imitation.toJSON()
    );
    if (imitation.id in this.localList) {
      delete this.localList[imitation.id];
    }
    return imitation;
  }

  get$(id: string): Observable<TheThingImitation> {
    if (id in this.localList) {
      return of(this.localList[id]);
    } else {
      return this.dataAccessService
        .getDataObject$(`${ImitationsDataPath}/${id}`)
        .pipe(map(item => new TheThingImitation().fromJSON(item)));
    }
  }

  // getTemplate$(id: string): Observable<TheThing> {
  //   return this.get$(id).pipe(
  //     switchMap((imitation: TheThingImitation) =>
  //       this.theThingAccessService.get$(imitation.templateId)
  //     )
  //   );
  // }

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