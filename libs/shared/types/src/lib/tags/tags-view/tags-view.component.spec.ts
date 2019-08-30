import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TagsViewComponent } from './tags-view.component';
import { Tags } from '../tags';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TagsViewComponentPageObject } from './tags-view.component.po';
import { AngularJestTester } from '@ygg/shared/infra/test-utils/jest';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';

describe('TagsViewComponent', () => {
  let component: TagsViewComponent;
  let fixture: ComponentFixture<TagsViewComponent>;
  let debugElement: DebugElement;
  let pageObject: TagsViewComponentPageObject;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUiNgMaterialModule],
      declarations: [TagsViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsViewComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    const tester = new AngularJestTester({ fixture, debugElement });
    pageObject = new TagsViewComponentPageObject(tester, '');
    fixture.detectChanges();
  });

  it('should show correct data', async done => {
    // TODO: Implement testing for individual property of your model
    component.tags = Tags.forge();
    await fixture.whenStable();
    fixture.detectChanges();
    pageObject.expectValue(component.tags);
    done();
  });
});
