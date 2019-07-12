import { sampleSize, xor } from "lodash";
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsGroupSwitchComponent } from './tags-group-switch.component';
import { Tags } from '../tags';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('TagsGroupSwitchComponent', () => {
  let component: TagsGroupSwitchComponent;
  let fixture: ComponentFixture<TagsGroupSwitchComponent>;
  let debugElement: DebugElement;
  let tagsAll: Tags;
  let tagsLeft: Tags;
  let titleLeft: string;
  let tagsRight: Tags;
  let titleRight: string;

  beforeAll(function() {
    tagsAll = new Tags(['HAVE', 'YOU', 'EVER', 'SEE', 'THE', 'RAIN', 'YYGG', 'BIRD', 'BIRB', 'BORB', 'ORB', '口', '食道', '胃', '十二指腸', '小腸', '大腸', '盲腸', '直腸']);
    tagsLeft = new Tags(sampleSize(tagsAll.values, 10));
    titleLeft = 'LEFT TAGS';
    tagsRight = new Tags(xor(tagsAll.values, tagsLeft.values));
    titleRight = 'RIGHT TAGS';
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsGroupSwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsGroupSwitchComponent);
    component = fixture.componentInstance;
    component.titleLeft = titleLeft;
    component.tagsLeft = tagsLeft.values;
    component.titleRight = titleRight;
    component.tagsRight = tagsRight.values;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should show left and right group tags, with both their titles', () => {
    const titleLeftSpan = debugElement.query(By.css('#title-left span'));
    expect(titleLeftSpan.nativeElement.textContent).toEqual(component.titleLeft);
    const tagsLeftSpans = debugElement.queryAll(By.css('#tags-left span.name'));
    expect(tagsLeftSpans.map(dbElement => dbElement.nativeElement.textContent)).toEqual(component.tagsLeft);

    const titleRightSpan = debugElement.query(By.css('#title-right span'));
    expect(titleRightSpan.nativeElement.textContent).toEqual(titleRight);
    const tagsRightSpans = debugElement.queryAll(By.css('#tags-right span.name'));
    expect(tagsRightSpans.map(dbElement => dbElement.nativeElement.textContent)).toEqual(component.tagsRight);
  });

  it('should disable/enable move-to-right button when nothing/something selected in tags-left list', async done => {
    const buttonMoveToRight = debugElement.query(By.css('button#move-to-right'));
    component.tagsLeftSelected = [];
    await fixture.whenStable();
    fixture.detectChanges();
    expect(buttonMoveToRight.nativeElement.prop('disabled')).toBeTruthy();

    component.tagsLeftSelected = sampleSize(component.tagsLeft, 3);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(buttonMoveToRight.nativeElement.prop('disabled')).toBeFalsy();

    done();
  });
  
  it('should disable/enable move-to-left button when nothing/something selected in tags-left list', async done => {
    const buttonMoveToLeft = debugElement.query(By.css('button#move-to-left'));
    component.tagsRightSelected = [];
    await fixture.whenStable();
    fixture.detectChanges();
    expect(buttonMoveToLeft.nativeElement.prop('disabled')).toBeTruthy();

    component.tagsRightSelected = sampleSize(component.tagsRight, 3);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(buttonMoveToLeft.nativeElement.prop('disabled')).toBeFalsy();

    done();
  });
  
  it('should be able to move tags back and forth', async done => {
    // Move first and secone tags to the right
    let tag1Name = component.tagsLeft[0];
    let tag1Span = debugElement.query(By.css(`#tags-left span[data-name="${tag1Name}"]`));
    tag1Span.nativeElement.click();
    let tag2Name = component.tagsLeft[1];
    let tag2Span = debugElement.query(By.css(`#tags-left span[data-name="${tag2Name}"]`));
    tag2Span.nativeElement.click();
    const buttonMoveToRight = debugElement.query(By.css('button#move-to-right'));
    buttonMoveToRight.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.tagsLeft).not.toContain(tag1Name);
    expect(component.tagsLeft).not.toContain(tag2Name);
    expect(component.tagsRight).toContain(tag1Name);
    expect(component.tagsRight).toContain(tag2Name);

    // Move last and second last to the left
    tag1Name = component.tagsRight[component.tagsRight.length - 1];
    tag1Span = debugElement.query(By.css(`#tags-right span[data-name="${tag1Name}"]`));
    tag1Span.nativeElement.click();
    tag2Name = component.tagsRight[component.tagsRight.length - 2];
    tag2Span = debugElement.query(By.css(`#tags-right span[data-name="${tag2Name}"]`));
    tag2Span.nativeElement.click();
    const buttonMoveToLeft = debugElement.query(By.css('button#move-to-left'));
    buttonMoveToLeft.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.tagsLeft).toContain(tag1Name);
    expect(component.tagsLeft).toContain(tag2Name);
    expect(component.tagsRight).not.toContain(tag1Name);
    expect(component.tagsRight).not.toContain(tag2Name);

    done();
  });

  it('should onSubmit() with @Output() submit emitting [comopnent.tagsLeft, component.tagsRight]', done => {
    component.submit.subscribe(payload => {
      expect(payload).toEqual([component.tagsLeft, component.tagsRight]);
      done();
    });
    component.onSubmit();
  });
  
});
