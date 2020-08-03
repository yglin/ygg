import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { TheThing } from '@ygg/the-thing/core';
import { Observable, throwError } from 'rxjs';
import { first } from 'rxjs/operators';
import { TheThingAccessService } from '../the-thing-access.service';

@Injectable({ providedIn: 'root' })
export class TheThingResolver implements Resolve<TheThing> {
  constructor(private theThingAccessService: TheThingAccessService) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<TheThing> | Promise<TheThing> | TheThing {
    const id = route.paramMap.get('id');
    if (id) {
      return this.theThingAccessService.load$(id).pipe(
        first()
        // tap(theThing => {
        //   console.log('Resolve the-thing');
        //   console.dir(theThing);
        // })
      );
    } else {
      return throwError(new Error(`"id" or "clone" not found in url`));
    }
  }
}
