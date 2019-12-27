import { async, TestBed } from '@angular/core/testing';
import { TheThingDataAccessModule } from './the-thing-data-access.module';

describe('TheThingDataAccessModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TheThingDataAccessModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(TheThingDataAccessModule).toBeDefined();
  });
});
