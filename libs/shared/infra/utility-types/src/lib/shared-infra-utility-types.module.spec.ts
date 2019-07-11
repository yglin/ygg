import { async, TestBed } from '@angular/core/testing';
import { SharedInfraUtilityTypesModule } from './shared-infra-utility-types.module';

describe('SharedInfraUtilityTypesModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedInfraUtilityTypesModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedInfraUtilityTypesModule).toBeDefined();
  });
});
