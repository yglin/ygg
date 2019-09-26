import { async, TestBed } from '@angular/core/testing';
import { TagsAdminModule } from './tags-admin.module';

describe('TagsAdminModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TagsAdminModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(TagsAdminModule).toBeDefined();
  });
});
