import { TestBed } from '@angular/core/testing';

import { PlayAdminService } from './Play-admin.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PlaywhatAdminService } from '@ygg/playwhat/admin';

@Injectable()
class MockPlaywhatAdminService {
  async setData(path: string, data: any) {}
  getData$(path: string): Observable<any> {
    return of(null);
  }
}


describe('PlayAdminService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: PlaywhatAdminService, useClass: MockPlaywhatAdminService }
      ]
    })
  );

  it('should be created', () => {
    const service: PlayAdminService = TestBed.get(PlayAdminService);
    expect(service).toBeTruthy();
  });
});
