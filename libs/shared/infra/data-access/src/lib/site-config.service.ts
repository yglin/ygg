import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SiteConfigService {
  siteConfig$: Observable<any>;

  constructor(private fireRealDB: AngularFireDatabase) {
    this.siteConfig$ = fireRealDB.object('site-config').valueChanges();
  }

  getSiteConfigurations(): Observable<any> {
    return this.siteConfig$.pipe(first());
  }
}
