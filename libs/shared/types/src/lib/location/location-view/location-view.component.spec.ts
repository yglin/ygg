import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationViewComponent } from './location-view.component';
import { Location } from '../location';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

class LocationViewComponentPageObject {
  selector = '.location-view'
  selectors = {
    // TODO: Add css selector for your HTML elements for testing
  };

  getSelector(name?: string): string {
    if (name && name in this.selectors) {
      return `${this.selector} ${this.selectors[name]}`;
    } else {
      return `${this.selector}`;
    }
  }
}

describe('LocationViewComponent', () => {
  let component: LocationViewComponent;
  let fixture: ComponentFixture<LocationViewComponent>;
  let debugElement: DebugElement;
  const pageObject = new LocationViewComponentPageObject();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationViewComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should show correct data', async done => {
    // TODO: Implement testing for individual property of your model
    component.location = Location.forge();
    await fixture.whenStable();
    fixture.detectChanges();
    const locationElement: HTMLElement = debugElement.query(By.css(pageObject.getSelector())).nativeElement;
    expect(locationElement.innerHTML).toContain(JSON.stringify(component.location.toJSON()));
    done();
  });
});
