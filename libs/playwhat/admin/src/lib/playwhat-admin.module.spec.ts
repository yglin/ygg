import { async, TestBed } from '@angular/core/testing';
import { PlaywhatAdminModule } from './playwhat-admin.module';

describe('PlaywhatAdminModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PlaywhatAdminModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PlaywhatAdminModule).toBeDefined();
  });
});
