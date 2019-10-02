import { sample, sampleSize, range } from 'lodash';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { v4 as uuid } from 'uuid';
import {
  ItemsGroupSwitcherComponent,
  GroupSwitchableItem
} from './items-group-switcher.component';
import { ActionBarredComponent } from '../action-barred/action-barred.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';

describe('ItemsGroupSwitcherComponent', () => {
  let component: ItemsGroupSwitcherComponent;
  let fixture: ComponentFixture<ItemsGroupSwitcherComponent>;
  let debugElement: DebugElement;

  class StubGroupSwitchableItem implements GroupSwitchableItem {
    id: string;
    name: string;

    static forge(): StubGroupSwitchableItem {
      const newOne = new StubGroupSwitchableItem();
      newOne.id = uuid();
      newOne.name = sample([
        'HAVE',
        'YOU',
        'EVER',
        'SEE',
        'THE',
        'RAIN',
        'YYGG',
        'BIRD',
        'BIRB',
        'BORB',
        'ORB',
        '口',
        '食道',
        '胃',
        '十二指腸',
        '小腸',
        '大腸',
        '盲腸',
        '直腸',
        '肛門',
        'Cockatiel',
        'Cockatoo',
        'Eclectus',
        'Conure',
        'Parakeet',
        'Budgie',
        'Macaw'
      ]);
      return newOne;
    }
  }

  let itemsLeft: GroupSwitchableItem[];
  let titleLeft: string;
  let itemsRight: GroupSwitchableItem[];
  let titleRight: string;

  // Click to toggle selection of item
  function clickItem(id: string) {
    debugElement.query(By.css(`[item-id="${id}"]`)).nativeElement.click();
  }

  beforeAll(function() {
    itemsLeft = range(20).map(() => StubGroupSwitchableItem.forge());
    titleLeft = 'Left Items';
    itemsRight = range(15).map(() => StubGroupSwitchableItem.forge());
    titleRight = 'Right Items';
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemsGroupSwitcherComponent, ActionBarredComponent],
      imports: [SharedUiNgMaterialModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsGroupSwitcherComponent);
    component = fixture.componentInstance;
    component.titleLeft = titleLeft;
    component.itemsLeft = itemsLeft;
    component.titleRight = titleRight;
    component.itemsRight = itemsRight;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should clone input arrays, do not mutate original arrays', () => {
    expect(component.itemsLeft).not.toBe(itemsLeft);
    expect(component.itemsRight).not.toBe(itemsRight);
  });

  it('should show left and right group items, with both their titles', () => {
    const titleLeftSpan = debugElement.query(By.css('#title-left'));
    expect(titleLeftSpan.nativeElement.textContent).toEqual(
      component.titleLeft
    );
    const itemsLeftSpans = debugElement.queryAll(
      By.css('#items-left span.name')
    );
    expect(
      itemsLeftSpans.map(dbElement => dbElement.nativeElement.textContent)
    ).toEqual(component.itemsLeft.map(item => item.name));

    const titleRightSpan = debugElement.query(By.css('#title-right'));
    expect(titleRightSpan.nativeElement.textContent).toEqual(titleRight);
    const itemsRightSpans = debugElement.queryAll(
      By.css('#items-right span.name')
    );
    expect(
      itemsRightSpans.map(dbElement => dbElement.nativeElement.textContent)
    ).toEqual(component.itemsRight.map(item => item.name));
  });

  it('should disable/enable move-to-right button when nothing/something selected in items-left list', async done => {
    const buttonMoveToRight = debugElement.query(
      By.css('button#move-to-right')
    );
    // Initially nothing selected
    expect(component.hasSelectedItemsIn('left')).toBe(false);
    expect(buttonMoveToRight.nativeElement.disabled).toBeTruthy();

    // Click first item to select it
    clickItem(component.itemsLeft[0].id);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.hasSelectedItemsIn('left')).toBe(true);
    expect(buttonMoveToRight.nativeElement.disabled).toBeFalsy();

    done();
  });

  it('should disable/enable move-to-left button when nothing/something selected in items-left list', async done => {
    const buttonMoveToLeft = debugElement.query(By.css('button#move-to-left'));
    // Initially nothing selected
    expect(component.hasSelectedItemsIn('right')).toBe(false);
    expect(buttonMoveToLeft.nativeElement.disabled).toBeTruthy();

    // Click first item to select it
    clickItem(component.itemsRight[0].id);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.hasSelectedItemsIn('right')).toBe(true);
    expect(buttonMoveToLeft.nativeElement.disabled).toBeFalsy();

    done();
  });

  it('should be able to move items from left to right group', async done => {
    jest.spyOn(component, 'moveItems');
    // Select first item in left group
    const itemsLeft0 = component.itemsLeft[0];
    clickItem(itemsLeft0.id);
    // Select second item in right group
    const itemsLeft1 = component.itemsLeft[1];
    clickItem(itemsLeft1.id);

    // Wait for button "move to right" enabled and click it
    await fixture.whenStable();
    fixture.detectChanges();
    debugElement.query(By.css('button#move-to-right')).nativeElement.click();

    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.moveItems).toHaveBeenCalled();
    // Check items not in left group
    expect(component.itemsLeft).not.toContain(itemsLeft0);
    expect(component.itemsLeft).not.toContain(itemsLeft1);
    // Check items in right group
    expect(component.itemsRight).toContain(itemsLeft0);
    expect(component.itemsRight).toContain(itemsLeft1);

    // Should clear selection of left
    expect(component.hasSelectedItemsIn('left')).toBe(false);

    done();
  });

  it('should be able to move items from right to left group', async done => {
    jest.spyOn(component, 'moveItems');
    // Select last item in right group
    const itemsRightLast =
      component.itemsRight[component.itemsRight.length - 1];
    clickItem(itemsRightLast.id);
    // Select second last item in right group
    const itemsRightLast2nd =
      component.itemsRight[component.itemsRight.length - 2];
    clickItem(itemsRightLast2nd.id);

    // Wait for button "move to left" enabled and click it
    await fixture.whenStable();
    fixture.detectChanges();
    debugElement.query(By.css('button#move-to-left')).nativeElement.click();

    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.moveItems).toHaveBeenCalled();
    // Check items not in right group
    expect(component.itemsRight).not.toContain(itemsRightLast);
    expect(component.itemsRight).not.toContain(itemsRightLast2nd);
    // Check items in left group
    expect(component.itemsLeft).toContain(itemsRightLast);
    expect(component.itemsLeft).toContain(itemsRightLast2nd);

    // Should clear selection of right
    expect(component.hasSelectedItemsIn('right')).toBe(false);

    done();
  });

  it('If copyLeft = true, moving item from left to right becomes copying', async done => {
    component.copyLeft = true;
    // Select first item in left group
    const itemsLeft0 = component.itemsLeft[0];
    clickItem(itemsLeft0.id);
    // Select second item in right group
    const itemsLeft1 = component.itemsLeft[1];
    clickItem(itemsLeft1.id);

    // Wait for button "move to right" enabled and click it
    await fixture.whenStable();
    fixture.detectChanges();
    debugElement.query(By.css('button#move-to-right')).nativeElement.click();

    await fixture.whenStable();
    fixture.detectChanges();
    // Check items still in left group
    expect(component.itemsLeft).toContain(itemsLeft0);
    expect(component.itemsLeft).toContain(itemsLeft1);
    // Check items also in right group
    expect(component.itemsRight).toContain(itemsLeft0);
    expect(component.itemsRight).toContain(itemsLeft1);

    // Should clear selection of left
    expect(component.hasSelectedItemsIn('left')).toBe(false);

    done();
  });

  it('If copyRight = true, moving item from right to left becomes copying', async done => {
    component.copyRight = true;
    jest.spyOn(component, 'moveItems');
    // Select last item in right group
    const itemsRightLast =
      component.itemsRight[component.itemsRight.length - 1];
    clickItem(itemsRightLast.id);
    // Select second last item in right group
    const itemsRightLast2nd =
      component.itemsRight[component.itemsRight.length - 2];
    clickItem(itemsRightLast2nd.id);

    // Wait for button "move to left" enabled and click it
    await fixture.whenStable();
    fixture.detectChanges();
    debugElement.query(By.css('button#move-to-left')).nativeElement.click();

    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.moveItems).toHaveBeenCalled();
    // Check items still in right group
    expect(component.itemsRight).toContain(itemsRightLast);
    expect(component.itemsRight).toContain(itemsRightLast2nd);
    // Check items in left group
    expect(component.itemsLeft).toContain(itemsRightLast);
    expect(component.itemsLeft).toContain(itemsRightLast2nd);

    // Should clear selection of right
    expect(component.hasSelectedItemsIn('right')).toBe(false);

    done();
  });

  // it('should onSubmit() with @Output() submit emitting { left: comopnent.itemsLeft, right: component.itemsRight }', done => {
  //   component.submit.subscribe(payload => {
  //     expect(payload).toEqual({
  //       left: component.itemsLeft,
  //       right: component.itemsRight
  //     });
  //     done();
  //   });
  //   debugElement.query(By.css('button#submit')).nativeElement.click();
  // });
});
