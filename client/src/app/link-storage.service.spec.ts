import { TestBed } from '@angular/core/testing';

import { LinkStorageService } from './link-storage.service';

describe('LinkStorageService', () => {
  let service: LinkStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
