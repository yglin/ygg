import { async, TestBed } from '@angular/core/testing';
import { SharedGoogleApisModule } from './shared-google-apis.module';

describe('SharedGoogleApisModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedGoogleApisModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedGoogleApisModule).toBeDefined();
  });
});
