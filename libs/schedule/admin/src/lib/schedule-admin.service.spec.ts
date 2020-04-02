import { TestBed } from '@angular/core/testing';

import { ScheduleAdminService } from './schedule-admin.service';
import { User, UserService } from "@ygg/shared/user/ui";
import { Observable, of, noop, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { PlaywhatAdminService } from '@ygg/playwhat/admin';

describe('ScheduleAdminService', () => {
  const fakePath = 'kick/your/ass';
  const stubData = {
    height: 175,
    heightWhenLaid: 30
  };

  @Injectable()
  class MockPlaywhatAdminService {
    async setData(path: string, data: any) {
      return Promise.resolve();
    }
    getData$(path: string): Observable<any> {
      return of(stubData);
    }
  }

  // @Injectable()
  // class MockUserService {
  //   listByIds$(ids: string): Observable<User[]> {
  //     return of([]);
  //   }
  // }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScheduleAdminService,
        { provide: PlaywhatAdminService, useClass: MockPlaywhatAdminService }
        // { provide: UserService, useClass: MockUserService }
      ]
    });
  });

  it('should be able to get stub data with path from menu, from PlaywhatAdminService', done => {
    const schedulerAdminService: ScheduleAdminService = TestBed.get(
      ScheduleAdminService
    );
    const mockPlaywhatAdminService: MockPlaywhatAdminService = TestBed.get(
      PlaywhatAdminService
    );
    // const mockUserService: MockUserService = TestBed.get(UserService);
    jest
      .spyOn(schedulerAdminService.menu, 'getPath')
      .mockImplementation(() => fakePath);
    jest
      .spyOn(mockPlaywhatAdminService, 'getData$')
      .mockImplementation(() => of(stubData));
    schedulerAdminService.getData$('yygg').subscribe(results => {
      expect(schedulerAdminService.menu.getPath).toHaveBeenCalledWith('yygg');
      expect(mockPlaywhatAdminService.getData$).toHaveBeenCalledWith(fakePath);
      expect(results).toBe(stubData);
      done();
    });
  });

  it('should emit updated data after setData', done => {
    const schedulerAdminService: ScheduleAdminService = TestBed.get(
      ScheduleAdminService
    );
    const mockPlaywhatAdminService: MockPlaywhatAdminService = TestBed.get(
      PlaywhatAdminService
    );

    // Let's mock the behavior of data source
    const fakeDataEmitter = new BehaviorSubject<any>(null);
    jest.spyOn(mockPlaywhatAdminService, 'getData$').mockImplementation(() => fakeDataEmitter);
    jest.spyOn(mockPlaywhatAdminService, 'setData').mockImplementation((path, data) => {
      fakeDataEmitter.next(data);
      fakeDataEmitter.complete();
      return Promise.resolve();
    });
    // With above mocking, the mocked data source will...
    // 1. Emit first value, which is null
    // 2. When mockPlaywhatAdminService.setData() is called, emit input data directly, then complete itself immediately

    let lastResult: any;
    schedulerAdminService
      .getData$('yygg')
      .subscribe(result => (lastResult = result), noop, () => {
        // When data source complete, we expect last result is exactly what setData() passed in.
        expect(lastResult).toBe(stubData);
        done();
      });
    // Call the setData() function with stubData, that should do it.
    schedulerAdminService.setData('yygg', stubData);
  });
});
