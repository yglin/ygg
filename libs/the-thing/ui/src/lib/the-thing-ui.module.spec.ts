import { async, TestBed } from '@angular/core/testing';
import { TheThingUiModule } from './the-thing-ui.module';

describe('TheThingUiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TheThingUiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(TheThingUiModule).toBeDefined();
  });
});
