import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartEditorComponent } from './shopping-cart-editor.component';

describe('ShoppingCartEditorComponent', () => {
  let component: ShoppingCartEditorComponent;
  let fixture: ComponentFixture<ShoppingCartEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingCartEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingCartEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
