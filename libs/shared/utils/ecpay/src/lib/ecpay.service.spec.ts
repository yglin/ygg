import { TestBed } from '@angular/core/testing';

import { EcpayService } from './ecpay.service';

describe('EcpayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EcpayService = TestBed.get(EcpayService);
    expect(service).toBeTruthy();
  });
});
