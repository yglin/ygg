import { async, TestBed } from '@angular/core/testing';
import { SharedInfraDeviceAdapterModule } from './shared-infra-device-adapter.module';

describe('SharedInfraDeviceAdapterModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedInfraDeviceAdapterModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedInfraDeviceAdapterModule).toBeDefined();
  });
});
