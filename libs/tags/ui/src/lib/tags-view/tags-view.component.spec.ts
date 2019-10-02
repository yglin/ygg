import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TagsViewComponent } from './tags-view.component';
import { Tags } from '@ygg/tags/core';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TagsViewComponentPageObject } from './tags-view.component.po';
import { AngularJestTester } from '@ygg/shared/test/angular-jest';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';

class TagsViewComponentPageObjectAngularJest extends TagsViewComponentPageObject {
  tester: AngularJestTester;

  constructor(parentSelector: string, tester: AngularJestTester) {
    super(parentSelector);
    this.tester = tester;
  }

  async expectValue(tags: Tags) {
    for (const tag of tags.toTagsArray()) {
      await this.tester.expectTextContent(this.getSelectorForTagChip(tag), tag.name);
    }
    return Promise.resolve();
  }

}

describe('TagsViewComponent', () => {
  const testTags: Tags = Tags.forge();

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
    pageObject = new TagsViewComponentPageObjectAngularJest('', tester);
    fixture.detectChanges();
  });

  it('should show correct data', async done => {
    component.tags = testTags;
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    await pageObject.expectValue(testTags);
    done();
  });
});
