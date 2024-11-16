import { TestBed } from '@angular/core/testing';

import { LocalizarService } from './localizar.service';

describe('LocalizarService', () => {
  let service: LocalizarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalizarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
