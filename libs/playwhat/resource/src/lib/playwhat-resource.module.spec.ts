import { async, TestBed } from '@angular/core/testing';
import { PlaywhatResourceModule } from './playwhat-resource.module';

describe('PlaywhatResourceModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PlaywhatResourceModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PlaywhatResourceModule).toBeDefined();
  });
});
