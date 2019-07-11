import { TestBed } from '@angular/core/testing';

import { AuthorizeService } from './authorize.service';
import { Injectable } from '@angular/core';
import { User } from './models/user';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { Observable, of } from 'rxjs';

describe('AuthorizeService', () => {
  let testUser1: User

  @Injectable()
  class MockDataAccessService {
    getDataObject$(id: string): Observable<any> {
      return of([
        testUser1.id
      ]);
    }
  }
  
  beforeAll(() => {
    testUser1 = User.forge();
  });

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: DataAccessService, useClass: MockDataAccessService }
    ]
  }));

  it('testUser1 should be admin', () => {
    const authorizeService: AuthorizeService = TestBed.get(AuthorizeService);
    const dataAccessService: MockDataAccessService = TestBed.get(DataAccessService);
    jest.spyOn(dataAccessService, 'getDataObject$');
    authorizeService.isAdmin(testUser1.id).subscribe(isAdmin => {
      expect(dataAccessService.getDataObject$).toHaveBeenCalledWith('admin/users/roles/admin');
      expect(isAdmin).toBe(true);
    });
  });
});
