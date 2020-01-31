import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheThingTemplateListComponent } from './the-thing-template-list.component';

describe('TheThingTemplateListComponent', () => {
  let component: TheThingTemplateListComponent;
  let fixture: ComponentFixture<TheThingTemplateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheThingTemplateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheThingTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
