import { sampleSize } from 'lodash';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { UserSelectorComponent } from './user-selector.component';
import { DebugElement, Injectable } from '@angular/core';
import { User } from "@ygg/shared/user/core";
import { UserThumbnailComponent } from '../user-thumbnail/user-thumbnail.component';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { of, Observable } from 'rxjs';
import { UserService } from '../../user.service';

describe('UserSelectorComponent', () => {
  let component: UserSelectorComponent;
  let fixture: ComponentFixture<UserSelectorComponent>;
  let debugElement: DebugElement;
  let testUsers: User[];
  let testSelection: string[];

  @Injectable()
  class MockUserService {
    listAll$(): Observable<User[]> {
      return of(testUsers);
    }
  }

  beforeAll(() => {
    testUsers = [];
    while (testUsers.length < 10) {
      testUsers.push(User.forge());
    }
    testSelection = sampleSize(testUsers, 3).map(user => user.id);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserSelectorComponent,
        MockComponent(UserThumbnailComponent)
      ],
      imports: [SharedUiNgMaterialModule],
      providers: [
        {provide: UserService, useClass: MockUserService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSelectorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should reflect initial selection from @Input', () => {
    component.selection = testSelection;
    fixture.detectChanges();
    component.selection.forEach(selectId => {
      expect(component.isSelected(selectId)).toBe(true);
    });
  });

  it('(@Input() multi: boolean) decide if multiple selection is allowed', () => {
    // Default multi = false, for single selection;
    component.selection = testSelection;
    component.ngOnInit();
    // Due to single selection, only take first of selection
    expect(component.selection).toEqual([testSelection[0]]);
    component.select(testSelection[1]);
    expect(component.selection).toEqual([testSelection[1]]);

    // Enable multiple selection
    component.multi = true;
    component.selection = testSelection;
    const addId = 'I-am-an-additional-fake-android';
    component.select(addId);
    expect(component.selection).toEqual(testSelection.concat([addId]));
  });

  it('should submit selected', done => {
    component.submit.subscribe(selectedIds => {
      expect(selectedIds).toEqual(testSelection);
      done();
    });
    component.multi = true;
    testSelection.forEach(id => component.select(id));
    component.onSubmit();
  });
  
});
